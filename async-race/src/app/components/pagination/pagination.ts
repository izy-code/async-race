import BaseComponent from '@/app/components/base-component';
import { p } from '@/app/components/tags';
import type Router from '@/app/router/router';
import ButtonComponent from '../button/button';
import CustomEventName from '@/app/events';
import type EventEmitter from '@/app/utils/event-emitter';

export default class PaginationComponent extends BaseComponent<HTMLDivElement> {
  private text: BaseComponent<HTMLParagraphElement>;

  constructor(router: Router, emitter: EventEmitter, pageNumber: number) {
    super({ className: 'garage-page__pagination', tag: 'div' });

    this.text = p({ className: 'garage-page__page-number', textContent: `Page #${pageNumber}` });

    const nextPageButton = ButtonComponent({
      className: 'garage-page__button-next button',
      textContent: 'Next page',
      buttonType: 'button',
    });
    const prevPageButton = ButtonComponent({
      className: 'garage-page__button-prev button',
      textContent: 'Prev page',
      buttonType: 'button',
    });

    emitter.on(CustomEventName.PAGE_UPDATE, this.setPageNumber);

    nextPageButton.addListener('click', () => emitter.emit(CustomEventName.NEXT_PAGE_SWITCH));
    prevPageButton.addListener('click', () => emitter.emit(CustomEventName.PREV_PAGE_SWITCH));

    this.appendChildren([this.text, prevPageButton, nextPageButton]);
  }

  private setPageNumber = (details: { pageNumber: number }): void => {
    this.text.setTextContent(`Page #${details.pageNumber}`);
  };
}
