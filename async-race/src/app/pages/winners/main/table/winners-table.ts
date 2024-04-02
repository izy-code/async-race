import { SortBy } from '@/app/api/api';
import BaseComponent from '@/app/components/base-component';
import { p, tbody, td, th, thead, tr } from '@/app/components/tags';
import CustomEventName from '@/app/events';
import type EventEmitter from '@/app/utils/event-emitter';
import { getClosestFromEventTarget } from '@/app/utils/helpers';

const TABLE_HEADERS = ['№', 'Car', 'Name', 'Wins', 'Time,\nsec'];

interface WinnersData {
  name: string;
  color: string;
  wins: number;
  time: number;
}

export default class WinnersTableComponent extends BaseComponent<HTMLTableElement> {
  private emitter: EventEmitter;

  private head: BaseComponent<HTMLTableSectionElement>;

  private body: BaseComponent<HTMLTableSectionElement>;

  private sortElements: HTMLTableCellElement[] = [];

  private pageNumber = 1;

  constructor(emitter: EventEmitter) {
    super({ className: 'winners-page__table', tag: 'table' });

    this.emitter = emitter;

    const headElements = TABLE_HEADERS.map((header) => {
      const headElement = th({ className: 'winners-page__table-head-element', textContent: header });

      if (header === TABLE_HEADERS[3] || header === TABLE_HEADERS[4]) {
        const sortContent = p({ textContent: header, className: 'winners-page__sort-content' });
        headElement.setTextContent('');
        headElement.append(sortContent);

        headElement.addClass('winners-page__sort-element');
        this.sortElements.push(headElement.getNode());

        if (header === TABLE_HEADERS[3]) {
          headElement.addClass('winners-page__wins-count');
        } else if (header === TABLE_HEADERS[4]) {
          headElement.addClass('winners-page__time');
        }
      }

      return headElement;
    });
    const headRow = tr({ className: 'winners-page__table-head-row' }, ...headElements);

    this.head = thead({ className: 'winners-page__table-head' }, headRow);
    this.body = tbody({ className: 'winners-page__table-body' });

    this.appendChildren([this.head, this.body]);

    this.head.addListener('click', this.onHeadClick);

    emitter.on(CustomEventName.PAGE_UPDATE, ({ pageNumber }: { pageNumber: number }) => {
      this.pageNumber = pageNumber;
    });
    emitter.on(CustomEventName.ROWS_REFILL, this.refillTable);
  }

  private createBodyRows = (winnersData: WinnersData[]): BaseComponent<HTMLTableRowElement>[] =>
    winnersData.map((winnerData, dataIndex) => {
      const image = td({ className: 'winners-page__image-container' });
      const rowNumber = td({
        textContent: (dataIndex + 1 + (this.pageNumber - 1) * 10).toString(),
        className: 'winners-page__row-number',
      });
      const name = td({ textContent: winnerData.name, className: 'winners-page__car-name' });
      const winsCount = td({ textContent: winnerData.wins.toString(), className: 'winners-page__wins-count' });
      const time = td({ textContent: winnerData.time.toString(), className: 'winners-page__time' });

      image.getNode().style.setProperty('--color-car', winnerData.color);

      return tr({ className: 'winners-page__table-row' }, rowNumber, image, name, winsCount, time);
    });

  private refillTable = (winnersData: WinnersData[]): void => {
    const bodyRows = this.createBodyRows(winnersData);

    this.body.removeChildren();
    this.body.appendChildren(bodyRows);
  };

  private handleArrowNearSortElement = (closest: HTMLElement): void => {
    if (closest.classList.contains('winners-page__sort-element--active')) {
      closest.classList.toggle('winners-page__sort-element--arrow-up');
    } else {
      closest.classList.toggle('winners-page__sort-element--active');

      this.sortElements.forEach((element) => {
        if (element !== closest && element.classList.contains('winners-page__sort-element--active')) {
          if (!element.classList.contains('winners-page__sort-element--arrow-up')) {
            closest.classList.add('winners-page__sort-element--arrow-up');
          }

          element.classList.remove('winners-page__sort-element--active');
          element.classList.remove('winners-page__sort-element--arrow-up');
        }
      });
    }
  };

  private onHeadClick = (evt: Event): void => {
    const closest = getClosestFromEventTarget(evt, '.winners-page__sort-element');

    if (!closest) {
      return;
    }

    if (closest.classList.contains('winners-page__wins-count')) {
      this.emitter.emit(CustomEventName.ROWS_SORT, SortBy.WINS);
    } else if (closest.classList.contains('winners-page__time')) {
      this.emitter.emit(CustomEventName.ROWS_SORT, SortBy.TIME);
    }

    this.handleArrowNearSortElement(closest);
  };
}
