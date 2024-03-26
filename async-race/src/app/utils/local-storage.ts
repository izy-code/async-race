const APP_KEY = 'izy-async-race';

export default class LocalStorage {
  private dataMap: Map<string, unknown>;

  constructor() {
    this.dataMap = new Map();
    this.getData();
  }

  public getField(key: string): unknown {
    if (this.dataMap.has(key)) {
      return this.dataMap.get(key);
    }

    return null;
  }

  public setField(key: string, value: unknown): void {
    this.dataMap.set(key, value);
    this.saveData();
  }

  public deleteField(key: string): void {
    this.dataMap.delete(key);
    this.saveData();
  }

  public clearAllData(): void {
    this.dataMap = new Map();
    localStorage.removeItem(APP_KEY);
  }

  private getData(): void {
    const storageString = localStorage.getItem(APP_KEY);

    if (storageString) {
      const storageObject = JSON.parse(storageString) as unknown;

      if (!(storageObject instanceof Object)) {
        throw new TypeError('Invalid storage object type');
      }

      this.dataMap = new Map(Object.entries(storageObject));
    }
  }

  private saveData(): void {
    const dataObject = Object.fromEntries(this.dataMap.entries());

    localStorage.setItem(APP_KEY, JSON.stringify(dataObject));
  }
}
