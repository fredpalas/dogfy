import { DeliveryRepository } from '../../domain/DeliveryRepository';
import { Delivery } from '../../domain/Delivery';
import { DeliveryId } from '../../domain/DeliveryId';
import { OrderId } from '../../domain/OrderId';
import { Provider } from '../../domain/Provider';
import { LabelUrl } from '../../domain/LabelUrl';
import { DeliveryStatus, DeliveryStatusEnum } from '../../domain/DeliveryStatus';
import { ProviderTrackingId } from '../../domain/ProviderTrackingId';
import { EventBus } from '../../../../Shared/domain/EventBus';

export class DeliveryCreator {
  constructor(
    private repository: DeliveryRepository,
    private eventBus: EventBus
  ) {}

  async run(
    id: string,
    orderId: string,
    provider: string,
    labelUrl: string,
    status: DeliveryStatusEnum,
    lastStatusUpdate: Date,
    providerTrackingId: string
  ): Promise<void> {
    const delivery = Delivery.create(
      new DeliveryId(id),
      new OrderId(orderId),
      new Provider(provider),
      new LabelUrl(labelUrl),
      new DeliveryStatus(status),
      lastStatusUpdate,
      new ProviderTrackingId(providerTrackingId)
    );

    await this.repository.save(delivery);
    await this.eventBus.publish(delivery.pullDomainEvents());
  }
} 