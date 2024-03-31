import BaseComponent from '@/app/components/base-component';
import { div, input, p } from '@/app/components/tags';
import CustomEventName from '@/app/events';
import type { Car, EngineResponse } from '@/app/interfaces';
import type EventEmitter from '@/app/utils/event-emitter';
import TrackButtonsComponent from './track-buttons/track-buttons';

const INTERVAL_DURATION_MS = 8;

export default class TrackComponent extends BaseComponent<HTMLDivElement> {
  private track: BaseComponent<HTMLInputElement>;

  private trackName: BaseComponent<HTMLParagraphElement>;

  private trackCar: Car;

  private intervalId = 0;

  constructor(emitter: EventEmitter, trackCar: Car) {
    super({ className: 'garage-page__track', tag: 'div' });

    this.trackCar = trackCar;

    this.trackName = p({
      className: 'garage-page__track-name',
      textContent: '',
    });

    this.track = input({
      className: 'garage-page__track-input',
      type: 'range',
      max: '100',
    });
    this.track.setAttribute('value', '0');

    const trackButtons = new TrackButtonsComponent(emitter, trackCar);

    const trackContainer = div(
      {
        className: 'garage-page__track-container',
      },
      this.track,
    );

    this.appendChildren([this.trackName, trackButtons, trackContainer]);

    emitter.on(CustomEventName.CAR_MOVEMENT_VIEW, this.moveCar);
    emitter.on(CustomEventName.CAR_STOP_VIEW, this.stopCar);
    emitter.on(CustomEventName.CAR_RESET_VIEW, this.resetCar);
  }

  public getCar = (): Car => this.trackCar;

  public updateCar = (carData: Car): void => {
    this.trackName.setTextContent(carData.name);
    this.track.getNode().style.setProperty('--color-car', carData.color);
  };

  private moveCar = (params: { engineResponse: EngineResponse; car: Car }): void => {
    if (this.intervalId || this.trackCar.id !== params.car.id) {
      return;
    }

    let passedDistance = 0;

    this.track.setAttribute('max', params.engineResponse.distance.toString());

    const moveCarInInterval = (): void => {
      passedDistance += params.engineResponse.velocity * INTERVAL_DURATION_MS;

      if (passedDistance <= params.engineResponse.distance) {
        this.track.setAttribute('value', passedDistance.toString());
      } else {
        this.track.setAttribute('value', params.engineResponse.distance.toString());
        this.clearInterval();
      }
    };

    this.intervalId = Number(setInterval(moveCarInInterval, INTERVAL_DURATION_MS));
  };

  private clearInterval = (): void => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = 0;
    }
  };

  private stopCar = (car: Car): void => {
    if (this.trackCar.id === car.id) {
      this.clearInterval();
    }
  };

  private resetCar = (carId: number): void => {
    if (this.trackCar.id === carId) {
      this.clearInterval();
      this.track.setAttribute('value', '0');
    }
  };
}
