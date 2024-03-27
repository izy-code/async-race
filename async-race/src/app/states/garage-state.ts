import Api from '../api/api';
import type { Car, EngineResponse } from '../interfaces';
import createRandomCars from '../utils/random-cars';

const MAX_CARS_PER_PAGE = 7;
const CARS_CREATED_ON_CLICK = 100;

export default class GarageState {
  private currentPage = 1;

  private pageCount = 1;

  private isRaceInProgress = false;

  private carsOnTrack: Car[] = [];

  private raceWinner: Car | null = null;

  public getCarsOnTrack = (): Car[] => this.carsOnTrack;

  public getRaceStatus = (): boolean => this.isRaceInProgress && this.carsOnTrack.length > 0;

  public getWinner = (): Car | null => this.raceWinner;

  public onRaceStart = (): void => {
    this.isRaceInProgress = true;
    this.raceWinner = null;
  };

  public onRaceReset = (): void => {
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

    this.carsOnTrack.push(car);

    return response;
  }

  public async onCarStop(stoppedCar: Car): Promise<void> {
    await Api.stopEngine(stoppedCar.id);
    this.carsOnTrack = this.carsOnTrack.filter((car) => car !== stoppedCar);
  }

  public async onCarDrive(drivenCar: Car): Promise<boolean> {
    const isDriveSuccessful = await Api.isDriveSuccessful(drivenCar.id);

    if (isDriveSuccessful) {
      if (!this.raceWinner) {
        this.raceWinner = drivenCar;
      }

      return true;
    }

    return false;
  }

  public async getCars(): Promise<Car[]> {
    const response = await Api.getCars(this.currentPage, MAX_CARS_PER_PAGE);

    if (response.totalCount) {
      this.pageCount = Math.ceil(+response.totalCount / MAX_CARS_PER_PAGE);
    }

    return response.cars;
  }

  public static async createCar(params: { carName: string; carColor: string }): Promise<void> {
    await Api.createCar(params.carName, params.carColor);
  }

  public static async createCars(): Promise<void> {
    const createdCars = createRandomCars(CARS_CREATED_ON_CLICK);
    const promises = createdCars.map((car) => Api.createCar(car.name, car.color));

    await Promise.all(promises);
  }

  public static async deleteCar(car: Car): Promise<void> {
    await Api.deleteCar(car.id);
  }

  public static async updateCar(car: Car): Promise<void> {
    await Api.updateCar(car);
  }
}
