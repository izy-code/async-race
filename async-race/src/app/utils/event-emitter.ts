import type CustomEventName from '@/app/events';

type EventDetails = Record<string, unknown>;

export type Handler = (details?: EventDetails) => void;

export default class EventEmitter {
  private handlers: Record<string, Handler[]> = {};

  public on(evt: CustomEventName, handler: Handler): void {
    let currentEventHandlers = this.handlers[evt];

    if (!currentEventHandlers) {
      currentEventHandlers = [];
    }

    currentEventHandlers.push(handler);
  }

  public off(evt: CustomEventName, handler: Handler): void {
    const currentEventHandlers = this.handlers[evt];

    if (!currentEventHandlers) {
      return;
    }

    for (let i = 0; i < currentEventHandlers.length; i += 1) {
      if (currentEventHandlers[i] === handler) {
        currentEventHandlers.splice((i -= 1), 1);
      }
    }
  }

  public emit(evt: CustomEventName, details?: EventDetails): void {
    const currentEventHandlers = this.handlers[evt];

    if (!currentEventHandlers) {
      return;
    }

    currentEventHandlers.forEach((handler) => handler(details));
  }
}
