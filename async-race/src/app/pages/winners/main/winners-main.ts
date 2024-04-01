import BaseComponent from '@/app/components/base-component';
import PageInfoComponent from '@/app/components/page-info/page-info';
import PaginationComponent from '@/app/components/pagination/pagination';
import { Page } from '@/app/router/pages';
import EventEmitter from '@/app/utils/event-emitter';
import WinnersTableComponent from './table/winners-table';
import WinnersState from '@/app/states/winners-state';
import WinnersController from '@/app/controllers/winners-controller';

export default class WinnersMainComponent extends BaseComponent {
  private emitter: EventEmitter;

  private controller: WinnersController;

  constructor() {
    super({ className: 'winners-page__main main', tag: 'main' });

    this.emitter = new EventEmitter();

    const winnersState = new WinnersState();

    this.controller = new WinnersController(this.emitter, winnersState);

    const pageName = Page.WINNERS.charAt(0).toUpperCase() + Page.WINNERS.slice(1);
    const pageInfo = new PageInfoComponent(this.emitter, pageName);
    const pagination = new PaginationComponent(this.emitter);
    const table = new WinnersTableComponent(this.emitter);

    this.appendChildren([pageInfo, pagination, table]);
  }
}
