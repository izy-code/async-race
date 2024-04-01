import Api, { SortBy, SortOrder } from '../api/api';
import type { Winner, WinnersData } from '../interfaces';

const MAX_ROWS_PER_PAGE = 10;

export default class WinnersState {
  private currentPage = 1;

  private pageCount = 1;

  private winnersCount = 0;

  private sortBy = SortBy.TIME;

  private sortOrder = SortOrder.ASC;

  public onNextPage = (): void => {
    if (this.currentPage < this.pageCount) {
      this.currentPage += 1;
    }
  };

  public onPrevPage = (): void => {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  };

  public onSortTypeChange = (sortBy: SortBy): void => {
    this.sortBy = sortBy;
    this.sortOrder = this.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
  };

  public getWinners = async (): Promise<WinnersData> => {
    const winnersResponse = await Api.getWinners(this.currentPage, MAX_ROWS_PER_PAGE, this.sortBy, this.sortOrder);

    if (!winnersResponse.totalCount) {
      throw new Error('Winners not found');
    }

    this.winnersCount = +winnersResponse.totalCount;
    this.pageCount = Math.ceil(+winnersResponse.totalCount / MAX_ROWS_PER_PAGE);

    const cars = await Promise.all(winnersResponse.winners.map((winner) => Api.getCar(winner.id)));
    const winners = winnersResponse.winners.map((winner, index) => ({ ...winner, ...cars[index]! }));

    return { winners, winnersCount: this.winnersCount, currentPage: this.currentPage, pageCount: this.pageCount };
  };

  public static async getWinner(winnerId: number): Promise<Winner> {
    const result = await Api.getWinner(winnerId);

    return result;
  }

  public static createWinner = async (id: number, wins: number, time: number): Promise<void> => {
    await Api.createWinner(id, wins, time);
  };

  public static deleteWinner = async (winnerId: number): Promise<void> => {
    await Api.deleteWinner(winnerId);
  };

  public static updateWinner = async (winner: Winner): Promise<void> => {
    await Api.updateWinner(winner);
  };
}
