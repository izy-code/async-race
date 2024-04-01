import './winners-page.scss';
import BaseComponent from '@/app/components/base-component';
import HeaderComponent from '@/app/components/header/header';
import { Page } from '@/app/router/pages';
import type Router from '@/app/router/router';
import WinnersMainComponent from './main/winners-main';

export default class WinnersPageComponent extends BaseComponent {
  private router: Router;

  constructor(router: Router) {
    super({ className: 'app-container__page winners-page' });

    this.router = router;

    const header = new HeaderComponent(router, Page.WINNERS);
    const main = new WinnersMainComponent();

    this.appendChildren([header, main]);
  }
}
