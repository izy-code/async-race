import type EventEmitter from '../utils/event-emitter';
import WinnersState from '../states/winners-state';
import CustomEventName from '../events';
import type { Car } from '../interfaces';
import type { SortBy } from '../api/api';
import crossPageEmitter from './cross-page-emitter';

export default class WinnersController {
  private emitter: EventEmitter;

  private state: WinnersState;

  constructor(emitter: EventEmitter, state: WinnersState) {
    this.emitter = emitter;
    this.state = state;

    emitter.on(CustomEventName.ROWS_SORT, this.onRowsSort);
    emitter.on(CustomEventName.NEXT_PAGE_CLICK, this.onNextPage);
    emitter.on(CustomEventName.PREV_PAGE_CLICK, this.onPrevPage);
    emitter.on(CustomEventName.WINNERS_UPDATE, this.getWinners);

    crossPageEmitter.on(CustomEventName.WINNER_UPDATE, this.onWinnerUpdate);
    crossPageEmitter.on(CustomEventName.WINNER_REMOVE, this.onWinnerRemove);

    emitter.emit(CustomEventName.WINNERS_UPDATE);
  }

  private getWinners = async (): Promise<void> => {
    const winnersData = await this.state.getWinners();

    if (winnersData) {
      this.emitter.emit(CustomEventName.PAGE_UPDATE, {
        carsCount: winnersData.winnersCount,
        pageNumber: winnersData.currentPage,
        pageCount: winnersData.pageCount,
      });
      this.emitter.emit(CustomEventName.ROWS_REFILL, winnersData.winners);
    }
  };

  private onNextPage = async (): Promise<void> => {
    this.state.onNextPage();
    await this.getWinners();
  };

  private onPrevPage = async (): Promise<void> => {
    this.state.onPrevPage();
    await this.getWinners();
  };

  private onRowsSort = async (sortBy: SortBy): Promise<void> => {
    this.state.onSortTypeChange(sortBy);
    await this.getWinners();
  };

  private onWinnerRemove = async (winnerId: number): Promise<void> => {
    await WinnersState.deleteWinner(winnerId);

    const winnersData = await this.state.getWinners();

    if (winnersData.winners.length === 0 && winnersData.currentPage > 1) {
      await this.onPrevPage();
    } else {
      this.emitter.emit(CustomEventName.PAGE_UPDATE, {
        carsCount: winnersData.winnersCount,
        pageNumber: winnersData.currentPage,
      });
      this.emitter.emit(CustomEventName.ROWS_REFILL, winnersData.winners);
    }
  };

  private onWinnerUpdate = async (winnerData: { car: Car; finishTime?: number }): Promise<void> => {
    const existingWinnerData = await WinnersState.getWinner(winnerData.car.id);

    if (Object.keys(existingWinnerData).length !== 0) {
      await WinnersState.updateWinner({
        id: existingWinnerData.id,
        wins: (winnerData.finishTime ? +existingWinnerData.wins + 1 : existingWinnerData.wins).toString(),
        time: (winnerData.finishTime
          ? Math.min(+existingWinnerData.time, winnerData.finishTime)
          : existingWinnerData.time
        ).toString(),
      });
      await this.getWinners();
    } else if (winnerData.finishTime) {
      await WinnersState.createWinner(winnerData.car.id, 1, winnerData.finishTime);
      await this.getWinners();
    }
  };
}
