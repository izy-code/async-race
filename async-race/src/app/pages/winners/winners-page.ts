import BaseComponent from '@/app/components/base-component';
import HeaderComponent from '@/app/components/header/header';
import { Page } from '@/app/router/pages';
import type Router from '@/app/router/router';

export default class WinnersPageComponent extends BaseComponent {
  private router: Router;

  constructor(router: Router, pageNumber: number) {
    super({ className: 'app-container__page garage-page' });

    this.router = router;

    console.log(pageNumber);

    const header = new HeaderComponent(router, Page.WINNERS);

    this.appendChildren([header]);
  }
}
