import Api from '../api/api';
import type { Car, EngineResponse } from '../interfaces';
import createRandomCars from '../utils/random-cars';

const MAX_CARS_PER_PAGE = 7;
const CARS_CREATED_ON_CLICK = 100;
const MS_PER_SECOND = 1000;

export default class GarageState {
  private currentPage = 1;

  private pageCount = 1;

  private pageCars: Car[] = [];

  private movingCars: Car[] = [];

  private raceWinner: Car | null = null;

  private isRaceInProgress = false;

  private winnersTime = '';

  public getPageCars = (): Car[] => this.pageCars;

  public getRaceStatus = (): boolean => this.isRaceInProgress && this.movingCars.length > 0;

  public getWinner = (): Car | null => this.raceWinner;

  public getWinnersTime = (): string => this.winnersTime;

  public onRaceStart = (): void => {
    this.isRaceInProgress = true;
    this.raceWinner = null;
  };

  public onRaceEnd = (): void => {
    this.isRaceInProgress = false;
  };

  public onNextPage = (): void => {
    if (this.currentPage < this.pageCount) {
      this.currentPage += 1;
    }
  };

  public onPrevPage = (): void => {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  };

  public async onCarStart(car: Car): Promise<EngineResponse> {
    const response = await Api.startEngine(car.id);

    this.movingCars.push(car);

    return response;
  }

  public async onCarStop(stoppedCar: Car): Promise<void> {
    await Api.stopEngine(stoppedCar.id);

    this.onCarMovementEnd(stoppedCar);
  }

  public async onCarDrive(drivenCar: Car): Promise<boolean> {
    const driveStartTime = new Date();
    const isDriveSuccessful = await Api.isDriveSuccessful(drivenCar.id);
    const driveEndTime = new Date();

    if (isDriveSuccessful) {
      if (this.getRaceStatus() && !this.raceWinner) {
        this.winnersTime = ((driveEndTime.getTime() - driveStartTime.getTime()) / MS_PER_SECOND).toFixed(2);
        this.raceWinner = drivenCar;
      }

      this.onCarMovementEnd(drivenCar);

      return true;
    }

    this.onCarMovementEnd(drivenCar);

    return false;
  }

  private onCarMovementEnd = (stoppedCar: Car): void => {
    this.movingCars = this.movingCars.filter((car) => car !== stoppedCar);

    if (this.movingCars.length === 0) {
      this.onRaceEnd();
    }
  };

  public async getPageInfo(): Promise<{
    cars: Car[];
    totalCount: string | null;
    currentPage: number;
    pageCount: number;
  }> {
    const response = await Api.getCars(this.currentPage, MAX_CARS_PER_PAGE);

    this.pageCars = response.cars;

    if (response.totalCount) {
      this.pageCount = Math.ceil(+response.totalCount / MAX_CARS_PER_PAGE);
    }

    return { ...response, currentPage: this.currentPage, pageCount: this.pageCount };
  }

  public static async createCar(params: { carName: string; carColor: string }): Promise<void> {
    await Api.createCar(params.carName, params.carColor);
  }

  public static async createCars(): Promise<void> {
    const createdCars = createRandomCars(CARS_CREATED_ON_CLICK);
    const promises = createdCars.map((car) => Api.createCar(car.name, car.color));

    await Promise.all(promises);
  }

  public static async deleteCar(carData: Car): Promise<void> {
    await Api.deleteCar(carData.id);
  }

  public static async updateCar(carData: Car): Promise<void> {
    await Api.updateCar(carData);
  }
}
