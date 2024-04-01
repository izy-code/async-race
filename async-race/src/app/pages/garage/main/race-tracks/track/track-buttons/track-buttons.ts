import BaseComponent from '@/app/components/base-component';
import ButtonComponent from '@/app/components/button/button';
import CustomEventName from '@/app/events';
import type { Car } from '@/app/interfaces';
import type EventEmitter from '@/app/utils/event-emitter';

export default class TrackButtonsComponent extends BaseComponent<HTMLDivElement> {
  private startButton: BaseComponent<HTMLButtonElement>;

  private resetButton: BaseComponent<HTMLButtonElement>;

  private selectButton: BaseComponent<HTMLButtonElement>;

  private removeButton: BaseComponent<HTMLButtonElement>;

  constructor(emitter: EventEmitter, trackCar: Car) {
    super({ className: 'garage-page__track-buttons', tag: 'div' });

    this.startButton = ButtonComponent({
      className: 'garage-page__button-car-start button button--confirm',
      textContent: 'Start',
      buttonType: 'button',
    });
    this.resetButton = ButtonComponent({
      className: 'garage-page__button-car-reset button button--cancel',
      textContent: 'Reset',
      buttonType: 'button',
    });
    this.selectButton = ButtonComponent({
      className: 'garage-page__button-car-select button button--continue',
      textContent: 'Select',
      buttonType: 'button',
    });
    this.removeButton = ButtonComponent({
      className: 'garage-page__button-car-remove button button--cancel',
      textContent: 'Remove',
      buttonType: 'button',
    });

    this.resetButton.setAttribute('disabled', '');

    this.appendChildren([this.startButton, this.resetButton, this.selectButton, this.removeButton]);

    this.addListeners(emitter, trackCar);
  }

  public addListeners(emitter: EventEmitter, trackCar: Car): void {
    this.startButton.addListener('click', () => {
      emitter.emit(CustomEventName.CAR_START_CLICK, trackCar);
      this.startButton.setAttribute('disabled', '');
    });
    this.resetButton.addListener('click', () => {
      emitter.emit(CustomEventName.CAR_RESET_CLICK, trackCar);
      this.resetButton.setAttribute('disabled', '');
    });
    this.selectButton.addListener('click', () => {
      emitter.emit(CustomEventName.CAR_SELECTION_CLICK, trackCar);
    });
    this.removeButton.addListener('click', () => emitter.emit(CustomEventName.CAR_REMOVE_CLICK, trackCar));

    emitter.on(CustomEventName.CAR_MOVEMENT_VIEW, ({ car }: { car: Car }) => {
      if (trackCar.id === car.id) {
        this.resetButton.removeAttribute('disabled');
      }
    });
    emitter.on(CustomEventName.CAR_RESET_VIEW, (id: number) => {
      if (trackCar.id === id) {
        this.startButton.removeAttribute('disabled');
      }
    });
    emitter.on(CustomEventName.RACE_START_CLICK, () => {
      this.selectButton.setAttribute('disabled', '');
      this.removeButton.setAttribute('disabled', '');
    });
    emitter.on(CustomEventName.RACE_RESET_CLICK, () => {
      this.selectButton.removeAttribute('disabled');
      this.removeButton.removeAttribute('disabled');
    });
  }

  public clickStartButton(): void {
    this.startButton.getNode().click();
  }

  public clickResetButton(): void {
    this.resetButton.getNode().click();
  }
}
