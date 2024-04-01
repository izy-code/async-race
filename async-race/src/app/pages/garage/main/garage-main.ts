import BaseComponent from '@/app/components/base-component';
import PageInfoComponent from '@/app/components/page-info/page-info';
import PaginationComponent from '@/app/components/pagination/pagination';
import { Page } from '@/app/router/pages';
import EventEmitter from '@/app/utils/event-emitter';
import CarCreationComponent from './creation/car-creation';
import CarUpdateComponent from './update/car-update';
import RaceButtonsComponent from './race-buttons/race-buttons';
import GarageState from '@/app/states/garage-state';
import GarageController from '@/app/controllers/garage-controller';
import RaceTracksComponent from './race-tracks/race-tracks';
import ModalComponent from './modal/modal';

export default class GarageMainComponent extends BaseComponent {
  private emitter: EventEmitter;

  private controller: GarageController;

  constructor() {
    super({ className: 'garage-page__main main', tag: 'main' });

    this.emitter = new EventEmitter();

    const garageState = new GarageState();

    this.controller = new GarageController(this.emitter, garageState);

    const pageName = Page.GARAGE.charAt(0).toUpperCase() + Page.GARAGE.slice(1);
    const pageInfo = new PageInfoComponent(this.emitter, pageName);
    const carCreation = new CarCreationComponent(this.emitter);
    const carUpdate = new CarUpdateComponent(this.emitter);
    const raceButtons = new RaceButtonsComponent(this.emitter);
    const pagination = new PaginationComponent(this.emitter);
    const raceTracks = new RaceTracksComponent(this.emitter);
    const modal = new ModalComponent(this.emitter);

    this.appendChildren([pageInfo, carCreation, carUpdate, raceButtons, pagination, raceTracks, modal]);
  }
}
