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
      value: '#aaaaaa',
      disabled: true,
    });
    this.nameInput = input({
      className: 'garage-page__name-input',
      maxLength: 22,
      placeholder: 'Enter car name',
      disabled: true,
    });
    this.carUpdateButton = ButtonComponent({
      className: 'garage-page__update-button button',
      textContent: 'Update car',
      buttonType: 'button',
    });

    this.carUpdateButton.getNode().disabled = true;

    this.appendChildren([this.nameInput, this.colorInput, this.carUpdateButton]);

    this.addListeners();
  }

  private addListeners(): void {
    this.nameInput.addListener('input', () => {
      this.carUpdateButton.getNode().disabled = !this.nameInput.getNode().value;
    });
    this.carUpdateButton.addListener('click', this.onCarUpdate);

    this.emitter.on(CustomEventName.CAR_SELECTION_VIEW, this.onCarSelection);

    this.emitter.on(CustomEventName.NEXT_PAGE_CLICK, this.resetFields);
    this.emitter.on(CustomEventName.PREV_PAGE_CLICK, this.resetFields);
    this.emitter.on(CustomEventName.CAR_REMOVE_CLICK, (car: Car) => {
      if (car.id === this.selectedCar?.id) {
        this.resetFields();
      }
    });
  }

  private onCarSelection = (selectedCar: Car): void => {
    this.selectedCar = selectedCar;
    this.colorInput.getNode().value = selectedCar.color;
    this.nameInput.getNode().value = selectedCar.name;

    this.colorInput.removeAttribute('disabled');
    this.nameInput.removeAttribute('disabled');
    this.carUpdateButton.removeAttribute('disabled');
  };

  private onCarUpdate = (): void => {
    if (!this.selectedCar) {
      return;
    }

    this.selectedCar.color = this.colorInput.getNode().value;
    this.selectedCar.name = this.nameInput.getNode().value;

    this.emitter.emit(CustomEventName.CAR_UPDATE_CLICK, this.selectedCar);

    this.resetFields();
  };

  private resetFields = (): void => {
    this.selectedCar = null;
    this.nameInput.getNode().value = '';
    this.colorInput.getNode().value = '#aaaaaa';
    this.colorInput.setAttribute('disabled', '');
    this.nameInput.setAttribute('disabled', '');
    this.carUpdateButton.setAttribute('disabled', '');
  };
}
