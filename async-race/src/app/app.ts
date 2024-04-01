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

  private loadedPageComponents: Record<string, BaseComponent> = {};

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
      path: Page.WINNERS,
      handleRouteChange: this.handleSwitchToWinnersPage,
    },
  ];

  private handleSwitchToGaragePage = (): void => {
    if (!this.loadedPageComponents[Page.GARAGE]) {
      import('@/app/pages/garage/garage-page')
        .then(({ default: GaragePageComponent }) => {
          this.loadedPageComponents[Page.GARAGE] = new GaragePageComponent(this.router);
          this.setPage(this.loadedPageComponents[Page.GARAGE]);
        })
        .catch((error) => {
          throw new Error(`Failed to load garage page module: ${error}`);
        });
    } else {
      this.setPage(this.loadedPageComponents[Page.GARAGE]);
    }
  };

  private handleSwitchToWinnersPage = (): void => {
    if (!this.loadedPageComponents[Page.WINNERS]) {
      import('@/app/pages/winners/winners-page')
        .then(({ default: WinnersPageComponent }) => {
          this.loadedPageComponents[Page.WINNERS] = new WinnersPageComponent(this.router);
          this.setPage(this.loadedPageComponents[Page.WINNERS]);
        })
        .catch((error) => {
          throw new Error(`Failed to load winners page module: ${error}`);
        });
    } else {
      this.setPage(this.loadedPageComponents[Page.WINNERS]);
    }
  };

  private setPage(pageComponent: BaseComponent): void {
    this.container.removeClass('app-container--opaque');

    setTimeout(() => {
      this.container.getNode().replaceChildren();
      this.container.cleanComponentChildrenList();
      this.container.append(pageComponent);
    }, COMPONENT_RENEWAL_TRANSITION_TIME_MS);

    setTimeout(() => {
      this.container.addClass('app-container--opaque');
    }, OPACITY_TRANSITION_TIME_MS);
  }
}
