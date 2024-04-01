import './pagination.scss';
import BaseComponent from '@/app/components/base-component';
import { p } from '@/app/components/tags';
import ButtonComponent from '../button/button';
import CustomEventName from '@/app/events';
import type EventEmitter from '@/app/utils/event-emitter';

export default class PaginationComponent extends BaseComponent<HTMLDivElement> {
  private text: BaseComponent<HTMLParagraphElement>;

  private nextPageButton: BaseComponent<HTMLButtonElement>;

  private prevPageButton: BaseComponent<HTMLButtonElement>;

  private isNextButtonDisabled = false;

  private isPrevButtonDisabled = false;

  constructor(emitter: EventEmitter) {
    super({ className: 'pagination', tag: 'div' });

    this.text = p({ className: 'pagination__page-number', textContent: 'Page #' });
    this.nextPageButton = ButtonComponent({
      className: 'pagination__button-next button',
      textContent: 'Next page',
      buttonType: 'button',
    });
    this.prevPageButton = ButtonComponent({
      className: 'pagination__button-prev button',
      textContent: 'Prev page',
      buttonType: 'button',
    });

    emitter.on(CustomEventName.PAGE_UPDATE, this.onPageUpdate);
    emitter.on(CustomEventName.RACE_START_CLICK, () => {
      this.nextPageButton.setAttribute('disabled', '');
      this.prevPageButton.setAttribute('disabled', '');
    });
    emitter.on(CustomEventName.RACE_RESET_CLICK, () => {
      this.nextPageButton.getNode().disabled = this.isNextButtonDisabled;
      this.prevPageButton.getNode().disabled = this.isNextButtonDisabled;
    });

    this.nextPageButton.addListener('click', () => emitter.emit(CustomEventName.NEXT_PAGE_CLICK));
    this.prevPageButton.addListener('click', () => emitter.emit(CustomEventName.PREV_PAGE_CLICK));

    this.appendChildren([this.text, this.prevPageButton, this.nextPageButton]);
  }

  private onPageUpdate = (details: { pageNumber: number; pageCount: number }): void => {
    this.text.setTextContent(`Page #${details.pageNumber}`);

    if (details.pageNumber === 1) {
      this.prevPageButton.setAttribute('disabled', '');
      this.isPrevButtonDisabled = true;
    } else {
      this.prevPageButton.removeAttribute('disabled');
      this.isPrevButtonDisabled = false;
    }
    if (details.pageNumber === details.pageCount || details.pageCount === 0) {
      this.nextPageButton.setAttribute('disabled', '');
      this.isNextButtonDisabled = true;
    } else if (details.pageCount !== 0 && details.pageNumber < details.pageCount) {
      this.nextPageButton.removeAttribute('disabled');
      this.isNextButtonDisabled = false;
    }
  };
}
