import { CreateDeliveryCommand } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/CreateDeliveryCommand';
import { DeliveryId } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryId';
import { OrderId } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/OrderId';
import { Provider } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/Provider';
import { LabelUrl } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/LabelUrl';
import { DeliveryStatus } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryStatus';
import { ProviderTrackingId } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/ProviderTrackingId';
import { DeliveryIdMother } from '../../domain/DeliveryIdMother';
import { OrderIdMother } from '../../domain/OrderIdMother';
import { ProviderMother } from '../../domain/ProviderMother';
import { LabelUrlMother } from '../../domain/LabelUrlMother';
import { DeliveryStatusMother } from '../../domain/DeliveryStatusMother';
import { ProviderTrackingIdMother } from '../../domain/ProviderTrackingIdMother';

export class CreateDeliveryCommandMother {
  static create(
    id: DeliveryId,
    orderId: OrderId,
    provider: Provider,
    labelUrl: LabelUrl,
    status: DeliveryStatus,
    lastStatusUpdate: Date,
    providerTrackingId: ProviderTrackingId
  ): CreateDeliveryCommand {
    return new CreateDeliveryCommand({
      id: id.value,
      orderId: orderId.value,
      provider: provider.value,
      labelUrl: labelUrl.value,
      status: status.value,
      lastStatusUpdate: lastStatusUpdate.toISOString(),
      providerTrackingId: providerTrackingId.value
    });
  }

  static random(): CreateDeliveryCommand {
    return this.create(
      DeliveryIdMother.random(),
      OrderIdMother.random(),
      ProviderMother.random(),
      LabelUrlMother.random(),
      DeliveryStatusMother.random(),
      new Date(),
      ProviderTrackingIdMother.random()
    );
  }

  static invalidStatus(): CreateDeliveryCommand {
    return new CreateDeliveryCommand({
      id: DeliveryIdMother.random().value,
      orderId: OrderIdMother.random().value,
      provider: ProviderMother.random().value,
      labelUrl: LabelUrlMother.random().value,
      status: 'invalid-status',
      lastStatusUpdate: new Date().toISOString(),
      providerTrackingId: ProviderTrackingIdMother.random().value
    });
  }
} 