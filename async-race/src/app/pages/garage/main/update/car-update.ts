import BaseComponent from '@/app/components/base-component';
import ButtonComponent from '@/app/components/button/button';
import { input } from '@/app/components/tags';
import CustomEventName from '@/app/events';
import type { Car } from '@/app/interfaces';
import type EventEmitter from '@/app/utils/event-emitter';

export default class CarUpdateComponent extends BaseComponent<HTMLDivElement> {
  private emitter: EventEmitter;

  private colorInput: BaseComponent<HTMLInputElement>;

  private nameInput: BaseComponent<HTMLInputElement>;

  private carUpdateButton: BaseComponent<HTMLButtonElement>;

  private selectedCar: Car | null = null;

  constructor(emitter: EventEmitter) {
    super({ className: 'garage-page__car-update', tag: 'div' });

    this.emitter = emitter;

    this.colorInput = input({
      className: 'garage-page__color-input',
      type: 'color',
      disabled: true,
    });
    this.nameInput = input({
      className: 'garage-page__name-input',
      maxLength: 16,
      placeholder: 'Enter car name',
      disabled: true,
    });
    this.carUpdateButton = ButtonComponent({
      className: 'garage-page__create-button button',
      textContent: 'Update car',
      buttonType: 'button',
    });

    this.carUpdateButton.getNode().disabled = true;

    this.nameInput.addListener('input', () => {
      this.carUpdateButton.getNode().disabled = !this.nameInput.getNode().value;
    });
    this.carUpdateButton.addListener('click', this.updateCar);

    emitter.on(CustomEventName.CAR_SELECTION, this.enableComponents);

    this.appendChildren([this.nameInput, this.colorInput, this.carUpdateButton]);
  }

  private enableComponents = (selectedCar: Car): void => {
    this.colorInput.getNode().value = selectedCar.color;
    this.nameInput.getNode().value = selectedCar.name;

    this.colorInput.removeAttribute('disabled');
    this.nameInput.removeAttribute('disabled');
    this.carUpdateButton.removeAttribute('disabled');
  };

  private updateCar = (): void => {
    if (!this.selectedCar) {
      return;
    }

    this.selectedCar.color = this.colorInput.getNode().value;
    this.selectedCar.name = this.nameInput.getNode().value;

    this.emitter.emit(CustomEventName.CAR_UPDATE, this.selectedCar);

    this.selectedCar = null;
    this.nameInput.getNode().value = '';
    this.colorInput.setAttribute('disabled', '');
    this.nameInput.setAttribute('disabled', '');
    this.carUpdateButton.setAttribute('disabled', '');
  };
}
