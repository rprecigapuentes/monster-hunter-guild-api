export interface DomainEvent {
  operation: string;
  entity: string;
  entityId?: string;
}

export interface IObserver {
  update(event: DomainEvent): Promise<void> | void;
}

const ALL = '*';

export class EventManager {
  private readonly observers = new Map<string, IObserver[]>();

  suscribe(eventType: string, observer: IObserver): void {
    const list = this.observers.get(eventType) ?? [];
    list.push(observer);
    this.observers.set(eventType, list);
  }

  unsubscribe(eventType: string, observer: IObserver): void {
    const list = this.observers.get(eventType) ?? [];
    this.observers.set(
      eventType,
      list.filter((currentObserver) => currentObserver !== observer)
    );
  }

  async notify(eventType: string, event: DomainEvent): Promise<void> {
    const targets = [...(this.observers.get(eventType) ?? []), ...(this.observers.get(ALL) ?? [])];

    for (const observer of targets) {
      await observer.update(event);
    }
  }
}
