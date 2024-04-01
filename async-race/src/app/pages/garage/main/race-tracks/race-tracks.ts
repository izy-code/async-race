import BaseComponent from '@/app/components/base-component';
import CustomEventName from '@/app/events';
import type { Car } from '@/app/interfaces';
import type EventEmitter from '@/app/utils/event-emitter';
import TrackComponent from './track/track';

export default class RaceTracksComponent extends BaseComponent<HTMLDivElement> {
  private emitter: EventEmitter;

  private tracks: TrackComponent[] = [];

  constructor(emitter: EventEmitter) {
    super({ className: 'garage-page__race-tracks', tag: 'div' });

    this.emitter = emitter;

    emitter.on(CustomEventName.TRACKS_REFILL, this.onTracksRefill);
    emitter.on(CustomEventName.ALL_CARS_START, this.onAllCarsStart);
    emitter.on(CustomEventName.ALL_CARS_RESET, this.onAllCarsReset);
  }

  private onTracksRefill = (cars: Car[]): void => {
    this.tracks = cars.map((car) => {
      const track = new TrackComponent(this.emitter, car);

      track.updateCar(car);

      return track;
    });

    this.removeChildren();
    this.appendChildren(this.tracks);
  };

  private onAllCarsStart = (): void => {
    this.tracks.forEach((track) => {
      track.clickStartButton();
    });
  };

  private onAllCarsReset = (): void => {
    this.tracks.forEach((track) => {
      track.clickResetButton();
    });
  };
}
