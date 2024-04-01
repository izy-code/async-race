import BaseComponent from '@/app/components/base-component';
import ButtonComponent from '@/app/components/button/button';
import CustomEventName from '@/app/events';
import type EventEmitter from '@/app/utils/event-emitter';

const RACE_MODE_SWITCH_DELAY_MS = 2000;

export default class RaceButtonsComponent extends BaseComponent<HTMLDivElement> {
  private startButton: BaseComponent<HTMLButtonElement>;

  private resetButton: BaseComponent<HTMLButtonElement>;

  private generationButton: BaseComponent<HTMLButtonElement>;

  constructor(emitter: EventEmitter) {
    super({ className: 'garage-page__race-buttons', tag: 'div' });

    this.startButton = ButtonComponent({
      className: 'garage-page__start-button button button--confirm',
      textContent: 'Start race',
      buttonType: 'button',
    });
    this.resetButton = ButtonComponent({
      className: 'garage-page__reset-button button button--cancel',
      textContent: 'Reset race',
      buttonType: 'button',
    });
    this.generationButton = ButtonComponent({
      className: 'garage-page__random-create-button button button--continue',
      textContent: 'Generate cars',
      buttonType: 'button',
    });
    this.resetButton.setAttribute('disabled', '');

    this.appendChildren([this.startButton, this.resetButton, this.generationButton]);
    this.addListeners(emitter);
  }

  private addListeners(emitter: EventEmitter): void {
    this.startButton.addListener('click', () => {
      emitter.emit(CustomEventName.RACE_START_CLICK);
      this.startButton.setAttribute('disabled', '');
      this.generationButton.setAttribute('disabled', '');
      setTimeout(() => {
        this.resetButton.removeAttribute('disabled');
      }, RACE_MODE_SWITCH_DELAY_MS);
    });
    this.resetButton.addListener('click', () => {
      emitter.emit(CustomEventName.RACE_RESET_CLICK);
      this.generationButton.removeAttribute('disabled');
      this.resetButton.setAttribute('disabled', '');
      setTimeout(() => {
        this.startButton.removeAttribute('disabled');
      }, RACE_MODE_SWITCH_DELAY_MS);
    });
    this.generationButton.addListener('click', () => {
      emitter.emit(CustomEventName.CARS_GENERATION_CLICK);
    });
  }
}
