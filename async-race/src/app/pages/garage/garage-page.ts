import BaseComponent from '@/app/components/base-component';
import HeaderComponent from '@/app/components/header/header';
import { Page } from '@/app/router/pages';
import type Router from '@/app/router/router';
import type LocalStorage from '@/app/utils/local-storage';

export default class GaragePageComponent extends BaseComponent {
  private router: Router;

  private storage: LocalStorage;

  constructor(router: Router, storage: LocalStorage, pageNumber: number) {
    super({ className: 'app-container__page garage-page' });

    this.router = router;
    this.storage = storage;

    console.log(pageNumber);

    const header = new HeaderComponent(router, Page.GARAGE);

    this.appendChildren([header]);
  }
}
