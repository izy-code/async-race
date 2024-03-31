import CustomEventName from '../events';
import type { Car } from '../interfaces';
import GarageState from '../states/garage-state';
import type EventEmitter from '../utils/event-emitter';

export default class GarageController {
  private emitter: EventEmitter;

  private state: GarageState;

  constructor(emitter: EventEmitter, state: GarageState) {
    this.emitter = emitter;
    this.state = state;

    emitter.on(CustomEventName.RACE_START_CLICK, this.onRaceStart);
    emitter.on(CustomEventName.RACE_RESET_CLICK, this.onRaceReset);
    emitter.on(CustomEventName.CAR_CREATION_CLICK, this.onCarCreation);
    emitter.on(CustomEventName.CAR_SELECTION_CLICK, this.onCarSelection);
    emitter.on(CustomEventName.CAR_UPDATE_CLICK, this.onCarUpdate);
    emitter.on(CustomEventName.CAR_REMOVE_CLICK, this.onCarRemove);
    emitter.on(CustomEventName.CARS_GENERATION_CLICK, this.onCarsGeneration);
    emitter.on(CustomEventName.CAR_START_CLICK, this.onCarStart);
    emitter.on(CustomEventName.CAR_RESET_CLICK, this.onCarReset);
    emitter.on(CustomEventName.NEXT_PAGE_CLICK, this.onNextPage);
    emitter.on(CustomEventName.PREV_PAGE_CLICK, this.onPrevPage);
    emitter.on(CustomEventName.CARS_UPDATE, this.onCarsUpdate);

    emitter.emit(CustomEventName.CARS_UPDATE);
  }

  private onCarStart = async (car: Car): Promise<void> => {
    const engineResponse = await this.state.onCarStart(car);

    this.emitter.emit(CustomEventName.CAR_MOVEMENT_VIEW, {
      car,
      engineResponse,
    });

    const engineStatus = await this.state.onCarDrive(car);
    const winner = this.state.getWinner();

    if (winner && winner.id === car.id && this.state.getRaceStatus()) {
      this.emitter.emit(CustomEventName.MODAL_SHOW, {
        winnerName: winner.name,
        winnerTime: this.state.getWinnersTime(),
      });
    }

    if (!engineStatus) {
      this.emitter.emit(CustomEventName.CAR_STOP_VIEW, car);
    }
  };

  private onCarsUpdate = async (): Promise<void> => {
    const pageInfo = await this.state.getPageInfo();

    this.emitter.emit(CustomEventName.TRACKS_REFILL, pageInfo.cars);
    this.emitter.emit(CustomEventName.PAGE_UPDATE, {
      carsCount: pageInfo.totalCount,
      pageNumber: pageInfo.currentPage,
    });
  };

  private onNextPage = async (): Promise<void> => {
    this.state.onNextPage();

    await this.onCarsUpdate();
  };

  private onPrevPage = async (): Promise<void> => {
    this.state.onPrevPage();

    await this.onCarsUpdate();
  };

  private onCarUpdate = async (carData: Car): Promise<void> => {
    this.emitter.emit(CustomEventName.WINNER_UPDATE, carData);

    await GarageState.updateCar(carData);
    await this.onCarsUpdate();
  };

  private onCarCreation = async (params: { carName: string; carColor: string }): Promise<void> => {
    await GarageState.createCar(params);
    await this.onCarsUpdate();
  };

  private onCarsGeneration = async (): Promise<void> => {
    await GarageState.createCars();

    await this.onCarsUpdate();
  };

  private onCarReset = async (stoppedCar: Car): Promise<void> => {
    await this.state.onCarStop(stoppedCar);

    this.emitter.emit(CustomEventName.CAR_RESET_VIEW, stoppedCar.id);
  };

  private onCarSelection = (car: Car): void => {
    this.emitter.emit(CustomEventName.CAR_SELECTION_VIEW, car);
  };

  private onRaceStart = async (): Promise<void> => {
    await this.onRaceReset();
    this.state.onRaceStart();
    this.emitter.emit(CustomEventName.ALL_CARS_START);
  };

  private onRaceReset = async (): Promise<void> => {
    const carsOnTrack = this.state.getPageCars();

    this.state.onRaceEnd();

    await Promise.allSettled(carsOnTrack.map((car) => this.onCarReset(car)));

    this.emitter.emit(CustomEventName.ALL_CARS_RESET);
  };

  private onCarRemove = async (car: Car): Promise<void> => {
    await GarageState.deleteCar(car);

    const pageInfo = await this.state.getPageInfo();

    if (pageInfo.cars.length === 0 && pageInfo.currentPage > 1) {
      await this.onPrevPage();
    } else {
      this.emitter.emit(CustomEventName.TRACKS_REFILL, pageInfo.cars);
      this.emitter.emit(CustomEventName.PAGE_UPDATE, {
        carsCount: pageInfo.totalCount,
        pageNumber: pageInfo.currentPage,
      });
    }
  };
}
