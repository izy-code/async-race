import BaseComponent from '@/app/components/base-component';
import ButtonComponent from '@/app/components/button/button';
import CustomEventName from '@/app/events';
import type EventEmitter from '@/app/utils/event-emitter';

export default class RaceButtonsComponent extends BaseComponent<HTMLDivElement> {
  constructor(emitter: EventEmitter) {
    super({ className: 'garage-page__race-buttons', tag: 'div' });

    const startButton = ButtonComponent({
      className: 'garage-page__start-button button button--confirm',
      textContent: 'Start race',
      buttonType: 'button',
    });
    const resetButton = ButtonComponent({
      className: 'garage-page__reset-button button button--cancel',
      textContent: 'Reset race',
      buttonType: 'button',
    });
    const generationButton = ButtonComponent({
      className: 'garage-page__random-create-button button button--continue',
      textContent: 'Generate cars',
      buttonType: 'button',
    });

    startButton.addListener('click', () => {
      emitter.emit(CustomEventName.RACE_START_CLICK);
    });
    resetButton.addListener('click', () => {
      emitter.emit(CustomEventName.RACE_RESET_CLICK);
    });
    generationButton.addListener('click', () => {
      emitter.emit(CustomEventName.CARS_GENERATION_CLICK);
    });

    this.appendChildren([startButton, resetButton, generationButton]);
  }
}
