import './header.scss';
import '../button/button.scss';
import type Router from '@/app/router/router';
import BaseComponent from '../base-component';
import { a, h1, nav } from '../tags';
import { Page } from '@/app/router/pages';

export default class HeaderComponent extends BaseComponent {
  private router: Router;

  constructor(router: Router, pageName: Page) {
    super({ className: 'header', tag: 'header' });

    this.getNode().classList.add(`${pageName}-page__header`);
    this.router = router;

    const title = h1('header__title', 'Async Race');
    const garageLink = a({
      className: 'header__link button',
      href: `#${Page.GARAGE}`,
      textContent: `Garage page`,
    });
    const winnersLink = a({
      className: 'header__link button',
      href: `#${Page.WINNERS}`,
      textContent: `Winners page`,
    });
    const navLinks = nav(
      {
        className: 'header__nav',
      },
      garageLink,
      winnersLink,
    );

    if (pageName === Page.GARAGE) {
      garageLink.getNode().classList.add('button--disabled');
      garageLink.getNode().removeAttribute('href');
    } else if (pageName === Page.WINNERS) {
      winnersLink.getNode().classList.add('button--disabled');
      winnersLink.getNode().removeAttribute('href');
    }

    this.appendChildren([title, navLinks]);
  }
}
