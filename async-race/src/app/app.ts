import './app.scss';
import type BaseComponent from './components/base-component';
import Router, { type Route } from './router/router';
import { Page } from './router/pages';
import { div } from './components/tags';

const COMPONENT_RENEWAL_TRANSITION_TIME_MS = 600;
const OPACITY_TRANSITION_TIME_MS = 700;

export default class App {
  private container: BaseComponent;

  private router: Router;

  constructor() {
    this.container = div({ className: 'app-container' });
    this.router = new Router(this.createRoutes());
  }

  public start(): void {
    document.body.append(this.container.getNode());
  }

  private createRoutes = (): Route[] => [
    {
      path: Page.EMPTY,
      handleRouteChange: this.handleSwitchToGaragePage,
    },
    {
      path: Page.GARAGE,
      handleRouteChange: this.handleSwitchToGaragePage,
    },
    {
      path: Page.GARAGE_WITH_SUFFIX,
      handleRouteChange: this.handleSwitchToGaragePage,
    },
    {
      path: Page.WINNERS,
      handleRouteChange: this.handleSwitchToWinnersPage,
    },
    {
      path: Page.WINNERS_WITH_SUFFIX,
      handleRouteChange: this.handleSwitchToWinnersPage,
    },
  ];

  private handleSwitchToGaragePage = (suffix: string): void => {
    import('@/app/pages/garage/garage-page')
      .then(({ default: GaragePageComponent }) => {
        const pageNumber = Number(suffix);

        if (suffix) {
          this.setPage(new GaragePageComponent(this.router, pageNumber));
        } else {
          this.setPage(new GaragePageComponent(this.router, 1));
        }
      })
      .catch((error) => {
        throw new Error(`Failed to load garage page module: ${error}`);
      });
  };

  private handleSwitchToWinnersPage = (suffix: string): void => {
    import('@/app/pages/winners/winners-page')
      .then(({ default: WinnersPageComponent }) => {
        const pageNumber = Number(suffix);

        if (suffix) {
          this.setPage(new WinnersPageComponent(this.router, pageNumber));
        } else {
          this.setPage(new WinnersPageComponent(this.router, 1));
        }
      })
      .catch((error) => {
        throw new Error(`Failed to load winners page module: ${error}`);
      });
  };

  private setPage(pageComponent: BaseComponent): void {
    this.container.removeClass('app-container--opaque');

    setTimeout(() => {
      this.container.removeChildren();
      this.container.append(pageComponent);
    }, COMPONENT_RENEWAL_TRANSITION_TIME_MS);

    setTimeout(() => {
      this.container.addClass('app-container--opaque');
    }, OPACITY_TRANSITION_TIME_MS);
  }
}
