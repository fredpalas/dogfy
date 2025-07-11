import { AggregateRoot } from '../../../Shared/domain/AggregateRoot';
import { DeliveryId } from './DeliveryId';
import { OrderId } from './OrderId';
import { Provider } from './Provider';
import { LabelUrl } from './LabelUrl';
import { DeliveryStatus } from './DeliveryStatus';
import { ProviderTrackingId } from './ProviderTrackingId';
import { DeliveryCreatedDomainEvent } from './DeliveryCreatedDomainEvent';
import { DeliveryStatusChangedDomainEvent } from './DeliveryStatusChangedDomainEvent';

export class Delivery extends AggregateRoot {
  id: DeliveryId;
  readonly orderId: OrderId;
  readonly provider: Provider;
  readonly labelUrl: LabelUrl;
  private _status: DeliveryStatus;
  private _lastStatusUpdate: Date;
  readonly providerTrackingId: ProviderTrackingId;

  constructor(
    id: DeliveryId,
    orderId: OrderId,
    provider: Provider,
    labelUrl: LabelUrl,
    status: DeliveryStatus,
    lastStatusUpdate: Date,
    providerTrackingId: ProviderTrackingId
  ) {
    super();
    this.id = id;
    this.orderId = orderId;
    this.provider = provider;
    this.labelUrl = labelUrl;
    this._status = status;
    this._lastStatusUpdate = lastStatusUpdate;
    this.providerTrackingId = providerTrackingId;
  }

  public get status(): DeliveryStatus {
    return this._status;
  }

  public get lastStatusUpdate(): Date {
    return this._lastStatusUpdate;
  }

  static create(
    id: DeliveryId,
    orderId: OrderId,
    provider: Provider,
    labelUrl: LabelUrl,
    status: DeliveryStatus,
    lastStatusUpdate: Date,
    providerTrackingId: ProviderTrackingId
  ): Delivery {
    const delivery = new Delivery(id, orderId, provider, labelUrl, status, lastStatusUpdate, providerTrackingId);
    delivery.record(
      new DeliveryCreatedDomainEvent({
        aggregateId: id.value,
        orderId: orderId.value,
        provider: provider.value,
        labelUrl: labelUrl.value,
        status: status.value,
        lastStatusUpdate: lastStatusUpdate.toISOString(),
        providerTrackingId: providerTrackingId.value
      })
    );
    return delivery;
  }

  static fromPrimitives(plainData: {
    id: string;
    orderId: string;
    provider: string;
    labelUrl: string;
    status: string;
    lastStatusUpdate: string;
    providerTrackingId: string;
  }): Delivery {
    return new Delivery(
      new DeliveryId(plainData.id),
      new OrderId(plainData.orderId),
      new Provider(plainData.provider),
      new LabelUrl(plainData.labelUrl),
      DeliveryStatus.fromValue(plainData.status),
      new Date(plainData.lastStatusUpdate),
      new ProviderTrackingId(plainData.providerTrackingId)
    );
  }

  toPrimitives() {
    return {
      id: this.id.value,
      orderId: this.orderId.value,
      provider: this.provider.value,
      labelUrl: this.labelUrl.value,
      status: this.status.value,
      lastStatusUpdate: this.lastStatusUpdate.toISOString(),
      providerTrackingId: this.providerTrackingId.value
    };
  }

  changeStatus(newStatus: DeliveryStatus, date: Date): void {
    if (this._status.value === newStatus.value) return;
    const oldStatus = this._status.value;
    this._status = newStatus;
    this._lastStatusUpdate = date;
    this.record(
      new DeliveryStatusChangedDomainEvent({
        aggregateId: this.id.value,
        oldStatus,
        newStatus: newStatus.value,
        changedAt: date.toISOString()
      })
    );
  }
}
