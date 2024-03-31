import './modal.scss';
import BaseComponent from '@/app/components/base-component';
import { div, h2 } from '@/app/components/tags';
import ButtonComponent from '@/app/components/button/button';
import type EventEmitter from '@/app/utils/event-emitter';
import CustomEventName from '@/app/events';

const OPACITY_TRANSITION_TIME_MS = 600;

export default class ModalComponent extends BaseComponent {
  private confirmButton: BaseComponent<HTMLButtonElement>;

  private contentComponent: BaseComponent<HTMLDivElement>;

  private description: BaseComponent<HTMLHeadingElement>;

  constructor(emitter: EventEmitter) {
    super({ className: 'modal modal--closed' });

    this.description = h2('modal__description', '');

    this.confirmButton = ButtonComponent({
      className: 'modal__button button',
      textContent: 'OK',
      buttonType: 'button',
      clickHandler: this.closeModal,
    });

    this.contentComponent = div({ className: 'modal__content' }, this.description, this.confirmButton);

    this.append(this.contentComponent);

    document.addEventListener('keydown', this.onDocumentEscapeKeydown);
    this.getNode().addEventListener('click', this.onModalClick);

    emitter.on(CustomEventName.MODAL_SHOW, this.onWinnerFinish);
  }

  private onWinnerFinish = ({ winnerName, winnerTime }: { winnerName: string; winnerTime: string }): void => {
    this.description.setTextContent(`${winnerName} wins in ${winnerTime}\u00A0sec`);
    this.showModal();
  };

  private showModal = (): void => {
    setTimeout(() => {
      this.addClass('modal--opaque');
      this.confirmButton.getNode().focus();
    }, 0);

    this.removeClass('modal--closed');
  };

  private closeModal = (): void => {
    this.removeClass('modal--opaque');

    setTimeout(() => {
      this.addClass('modal--closed');
    }, OPACITY_TRANSITION_TIME_MS);
  };

  private onDocumentEscapeKeydown = (evt: KeyboardEvent): void => {
    if (evt.key === 'Escape') {
      this.closeModal();
    }
  };

  private onModalClick = (evt: Event): void => {
    if (!evt.composedPath().includes(this.contentComponent.getNode())) {
      this.closeModal();
    }
  };
}
