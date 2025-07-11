import { DomainEvent } from '../../../Shared/domain/DomainEvent';

export class DeliveryStatusChangedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'logistics.delivery.status_changed';

  readonly oldStatus: string;
  readonly newStatus: string;
  readonly changedAt: string;

  constructor(params: {
    aggregateId: string;
    oldStatus: string;
    newStatus: string;
    changedAt: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({
      eventName: DeliveryStatusChangedDomainEvent.EVENT_NAME,
      aggregateId: params.aggregateId,
      eventId: params.eventId,
      occurredOn: params.occurredOn
    });
    this.oldStatus = params.oldStatus;
    this.newStatus = params.newStatus;
    this.changedAt = params.changedAt;
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: any;
    eventId: string;
    occurredOn: Date;
  }): DeliveryStatusChangedDomainEvent {
    return new DeliveryStatusChangedDomainEvent({
      aggregateId: params.aggregateId,
      oldStatus: params.attributes.oldStatus,
      newStatus: params.attributes.newStatus,
      changedAt: params.attributes.changedAt,
      eventId: params.eventId,
      occurredOn: params.occurredOn
    });
  }

  toPrimitives() {
    return {
      oldStatus: this.oldStatus,
      newStatus: this.newStatus,
      changedAt: this.changedAt
    };
  }
} 