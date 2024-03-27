import BaseComponent from '@/app/components/base-component';
import CustomEventName from '@/app/events';
import type { Handler } from '@/app/utils/event-emitter';
import type EventEmitter from '@/app/utils/event-emitter';

export default class PageInfoComponent extends BaseComponent<HTMLHeadingElement> {
  private pageName: string;

  constructor(emitter: EventEmitter, pageName: string) {
    super({ className: 'garage-page__heading', tag: 'h2', textContent: pageName });

    this.pageName = pageName;

    emitter.on(CustomEventName.PAGE_UPDATE, this.setPageInfo);
  }

  private setPageInfo: Handler = (details): void => {
    if (details && typeof details.carsCount === 'number') {
      this.getNode().textContent = `${this.pageName} (${details.carsCount})`;
    }
  };
}
