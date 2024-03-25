import type { Car, EngineResponse, Winner } from '../interfaces';

const BASE_URL = 'http://localhost:3000';
const ENGINE_SUCCESS_CODE = 200;
const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
};

enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
enum Route {
  GARAGE = 'garage',
  ENGINE = 'engine',
  WINNERS = 'winners',
}
enum EngineStatus {
  STARTED = 'started',
  STOPPED = 'stopped',
  DRIVE = 'drive',
}
enum Sort {
  ID = 'id',
  WINS = 'wins',
  TIME = 'time',
}
enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export default class Api {
  private static async getFetchResponse(url: string, options?: RequestInit): Promise<Response> {
    const response = await fetch(url, options);

    return response;
  }

  public static async getCars(page: number, limit: number): Promise<{ cars: Car[]; totalCount: string | null }> {
    const response = await Api.getFetchResponse(
      `${BASE_URL}/${Route.GARAGE}?_page=${page ?? ''}&_limit=${limit ?? ''}`,
    );
    const cars = (await response.json()) as Car[];
    const totalCount = response.headers.get('X-Total-Count');

    return { cars, totalCount };
  }

  public static async getCar(id: number): Promise<Car> {
    const response = await Api.getFetchResponse(`${BASE_URL}/${Route.GARAGE}/${id}`);

    return response.json() as Promise<Car>;
  }

  public static async createCar(name: string, color: string): Promise<void> {
    await Api.getFetchResponse(`${BASE_URL}/${Route.GARAGE}`, {
      method: Method.POST,
      headers: REQUEST_HEADERS,
      body: JSON.stringify({ name, color }),
    });
  }

  public static async deleteCar(id: number): Promise<void> {
    await Api.getFetchResponse(`${BASE_URL}/${Route.GARAGE}/${id}`, {
      method: Method.DELETE,
    });
  }

  public static async updateCar(carData: Car): Promise<void> {
    await Api.getFetchResponse(`${BASE_URL}/${Route.GARAGE}/${carData.id}`, {
      method: Method.PUT,
      headers: REQUEST_HEADERS,
      body: JSON.stringify({ name: carData.name, color: carData.color }),
    });
  }

  public static async startEngine(id: number): Promise<EngineResponse> {
    const response = await Api.getFetchResponse(`${BASE_URL}/${Route.ENGINE}?id=${id}&status=${EngineStatus.STARTED}`, {
      method: Method.PATCH,
    });

    return response.json() as Promise<EngineResponse>;
  }

  public static async stopEngine(id: number): Promise<void> {
    await Api.getFetchResponse(`${BASE_URL}/${Route.ENGINE}?id=${id}&status=${EngineStatus.STOPPED}`, {
      method: Method.PATCH,
    });
  }

  public static async isDriveSuccessful(id: number): Promise<boolean> {
    const response = await Api.getFetchResponse(`${BASE_URL}/${Route.ENGINE}?id=${id}&status=${EngineStatus.DRIVE}`, {
      method: Method.PATCH,
    });

    return response.status === ENGINE_SUCCESS_CODE;
  }

  public static async getWinners(
    page: number,
    limit: number,
    sort: Sort,
    order: Order,
  ): Promise<{ winners: Winner[]; totalCount: string | null }> {
    const response = await Api.getFetchResponse(
      `${BASE_URL}/${Route.WINNERS}?_page=${page ?? ''}&_limit=${limit ?? ''}&_sort=${sort ?? ''}&_order=${order ?? ''}`,
    );
    const winners = (await response.json()) as Winner[];
    const totalCount = response.headers.get('X-Total-Count');

    return { winners, totalCount };
  }

  public static async getWinner(id: number): Promise<Winner> {
    const response = await fetch(`${BASE_URL}/${Route.WINNERS}/${id}`);

    return response.json() as Promise<Winner>;
  }

  public static async createWinner(id: number, wins: number, time: number): Promise<void> {
    await Api.getFetchResponse(`${BASE_URL}/${Route.WINNERS}`, {
      method: Method.POST,
      headers: REQUEST_HEADERS,
      body: JSON.stringify({ id, wins, time }),
    });
  }

  public static async deleteWinner(id: number): Promise<void> {
    await Api.getFetchResponse(`${BASE_URL}/${Route.WINNERS}/${id}`, {
      method: Method.DELETE,
    });
  }

  public static async updateWinner(winnerData: Winner): Promise<void> {
    await Api.getFetchResponse(`${BASE_URL}/${Route.WINNERS}/${winnerData.id}`, {
      method: Method.PUT,
      headers: REQUEST_HEADERS,
      body: JSON.stringify({ wins: winnerData.wins, time: winnerData.time }),
    });
  }
}
