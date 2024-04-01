import './garage-page.scss';
import BaseComponent from '@/app/components/base-component';
import HeaderComponent from '@/app/components/header/header';
import { Page } from '@/app/router/pages';
import type Router from '@/app/router/router';
import GarageMainComponent from './main/garage-main';

export default class GaragePageComponent extends BaseComponent {
  private router: Router;

  constructor(router: Router) {
    super({ className: 'app-container__page garage-page' });

    this.router = router;

    const header = new HeaderComponent(router, Page.GARAGE);
    const main = new GarageMainComponent();

    this.appendChildren([header, main]);
  }
}
