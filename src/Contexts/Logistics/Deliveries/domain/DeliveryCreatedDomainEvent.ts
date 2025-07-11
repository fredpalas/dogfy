import { DomainEvent } from '../../../Shared/domain/DomainEvent';

export class DeliveryCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'logistics.delivery.created';

  readonly orderId: string;
  readonly provider: string;
  readonly labelUrl: string;
  readonly status: string;
  readonly lastStatusUpdate: string;
  readonly providerTrackingId: string;

  constructor(params: {
    aggregateId: string;
    orderId: string;
    provider: string;
    labelUrl: string;
    status: string;
    lastStatusUpdate: string;
    providerTrackingId: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({
      eventName: DeliveryCreatedDomainEvent.EVENT_NAME,
      aggregateId: params.aggregateId,
      eventId: params.eventId,
      occurredOn: params.occurredOn
    });
    this.orderId = params.orderId;
    this.provider = params.provider;
    this.labelUrl = params.labelUrl;
    this.status = params.status;
    this.lastStatusUpdate = params.lastStatusUpdate;
    this.providerTrackingId = params.providerTrackingId;
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: any;
    eventId: string;
    occurredOn: Date;
  }): DeliveryCreatedDomainEvent {
    return new DeliveryCreatedDomainEvent({
      aggregateId: params.aggregateId,
      orderId: params.attributes.orderId,
      provider: params.attributes.provider,
      labelUrl: params.attributes.labelUrl,
      status: params.attributes.status,
      lastStatusUpdate: params.attributes.lastStatusUpdate,
      providerTrackingId: params.attributes.providerTrackingId,
      eventId: params.eventId,
      occurredOn: params.occurredOn
    });
  }

  toPrimitives() {
    return {
      orderId: this.orderId,
      provider: this.provider,
      labelUrl: this.labelUrl,
      status: this.status,
      lastStatusUpdate: this.lastStatusUpdate,
      providerTrackingId: this.providerTrackingId
    };
  }
} 