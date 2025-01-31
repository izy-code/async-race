import BaseComponent from '@/app/components/base-component';
import ButtonComponent from '@/app/components/button/button';
import { div, input } from '@/app/components/tags';
import CustomEventName from '@/app/events';
import type EventEmitter from '@/app/utils/event-emitter';

const DEFAULT_COLOR = '#aaaaaa';

export default class CarCreationComponent extends BaseComponent<HTMLDivElement> {
  private colorInput: BaseComponent<HTMLInputElement>;

  private nameInput: BaseComponent<HTMLInputElement>;

  private carCreationButton: BaseComponent<HTMLButtonElement>;

  private isButtonDisabled = true;

  private carPreview: BaseComponent<HTMLDivElement>;

  constructor(emitter: EventEmitter) {
    super({ className: 'garage-page__car-creation', tag: 'div' });

    this.colorInput = input({
      className: 'garage-page__color-input',
      type: 'color',
      value: DEFAULT_COLOR,
    });
    this.nameInput = input({
      className: 'garage-page__name-input',
      maxLength: 22,
      placeholder: 'Enter car name',
    });
    this.carCreationButton = ButtonComponent({
      className: 'garage-page__create-button button',
      textContent: 'Create car',
      buttonType: 'button',
    });
    this.carPreview = div({
      className: 'garage-page__car-preview',
    });
    this.carPreview.getNode().style.setProperty('--color-car-preview', DEFAULT_COLOR);

    this.carCreationButton.getNode().disabled = true;

    this.addListeners(emitter);
    this.appendChildren([this.nameInput, this.colorInput, this.carPreview, this.carCreationButton]);
  }

  private addListeners(emitter: EventEmitter): void {
    this.nameInput.addListener('input', () => {
      this.carCreationButton.getNode().disabled = !this.nameInput.getNode().value;
      this.isButtonDisabled = this.carCreationButton.getNode().disabled;
    });
    this.colorInput.addListener('input', () => {
      this.carPreview.getNode().style.setProperty('--color-car-preview', this.colorInput.getNode().value);
    });
    this.carCreationButton.addListener('click', () => {
      const carName = this.nameInput.getNode().value;
      const carColor = this.colorInput.getNode().value;

      emitter.emit(CustomEventName.CAR_CREATION_CLICK, {
        carName,
        carColor,
      });
    });

    emitter.on(CustomEventName.RACE_START_CLICK, () => {
      this.carCreationButton.setAttribute('disabled', '');
    });
    emitter.on(CustomEventName.RACE_RESET_CLICK, () => {
      this.carCreationButton.getNode().disabled = this.isButtonDisabled;
    });
  }
}
