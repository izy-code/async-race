import BaseComponent from '@/app/components/base-component';
import ButtonComponent from '@/app/components/button/button';
import { input } from '@/app/components/tags';
import CustomEventName from '@/app/events';
import type EventEmitter from '@/app/utils/event-emitter';

export default class CarCreationComponent extends BaseComponent<HTMLDivElement> {
  constructor(emitter: EventEmitter) {
    super({ className: 'garage-page__car-creation', tag: 'div' });

    const colorInput = input({
      className: 'garage-page__color-input',
      type: 'color',
    });
    const nameInput = input({
      className: 'garage-page__name-input',
      maxLength: 16,
      placeholder: 'Enter car name',
    });
    const carCreationButton = ButtonComponent({
      className: 'garage-page__create-button button',
      textContent: 'Create car',
      buttonType: 'button',
    });

    carCreationButton.getNode().disabled = true;

    nameInput.addListener('input', () => {
      carCreationButton.getNode().disabled = !nameInput.getNode().value;
    });

    carCreationButton.addListener('click', () => {
      const carName = nameInput.getNode().value;
      const carColor = colorInput.getNode().value;

      emitter.emit(CustomEventName.CAR_CREATION, {
        carName,
        carColor,
      });
    });

    this.appendChildren([nameInput, colorInput, carCreationButton]);
  }
}
