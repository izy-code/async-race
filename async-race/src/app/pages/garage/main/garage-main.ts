import BaseComponent from '@/app/components/base-component';
import PageInfoComponent from '@/app/components/page-info/page-info';
import PaginationComponent from '@/app/components/pagination/pagination';
import { Page } from '@/app/router/pages';
import type Router from '@/app/router/router';
import EventEmitter from '@/app/utils/event-emitter';
import CarCreationComponent from './creation/car-creation';
import CarUpdateComponent from './update/car-update';

export default class GarageMainComponent extends BaseComponent {
  private router: Router;

  private emitter: EventEmitter;

  constructor(router: Router, pageNumber: number) {
    super({ className: 'garage-page__main main', tag: 'main' });

    this.router = router;
    this.emitter = new EventEmitter();

    const pageName = Page.GARAGE.charAt(0).toUpperCase() + Page.GARAGE.slice(1);
    const pageInfo = new PageInfoComponent(this.emitter, pageName);
    const pagination = new PaginationComponent(this.router, this.emitter, pageNumber);
    const carCreation = new CarCreationComponent(this.emitter);
    const carUpdate = new CarUpdateComponent(this.emitter);

    this.appendChildren([pageInfo, carCreation, carUpdate, pagination]);
  }
}
