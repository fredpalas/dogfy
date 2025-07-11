import { Delivery } from '../../../../../src/Contexts/Logistics/Deliveries/domain/Delivery';
import { DeliveryIdMother } from './DeliveryIdMother';
import { OrderIdMother } from './OrderIdMother';
import { ProviderMother } from './ProviderMother';
import { LabelUrlMother } from './LabelUrlMother';
import { DeliveryStatusMother } from './DeliveryStatusMother';
import { ProviderTrackingIdMother } from './ProviderTrackingIdMother';
import { CreateDeliveryCommand } from '../../../../../src/Contexts/Logistics/Deliveries/domain/CreateDeliveryCommand';
import { DeliveryId } from '../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryId';
import {
  DeliveryStatus,
  DeliveryStatusEnum
} from "../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryStatus";
import { LabelUrl } from '../../../../../src/Contexts/Logistics/Deliveries/domain/LabelUrl';
import { OrderId } from '../../../../../src/Contexts/Logistics/Deliveries/domain/OrderId';
import { Provider } from '../../../../../src/Contexts/Logistics/Deliveries/domain/Provider';
import { ProviderTrackingId } from '../../../../../src/Contexts/Logistics/Deliveries/domain/ProviderTrackingId';

export class DeliveryMother {
  static create(
    id: DeliveryId,
    orderId: OrderId,
    provider: Provider,
    labelUrl: LabelUrl,
    status: DeliveryStatus,
    lastStatusUpdate: Date,
    providerTrackingId: ProviderTrackingId
  ) {
    return new Delivery(id, orderId, provider, labelUrl, status, lastStatusUpdate, providerTrackingId);
  }

  static random() {
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

  static withProvider(provider: string): Delivery {
    return this.create(
      DeliveryIdMother.random(),
      OrderIdMother.random(),
      ProviderMother.create(provider),
      LabelUrlMother.random(),
      DeliveryStatusMother.random(),
      new Date(),
      ProviderTrackingIdMother.random()
    );
  }

  static withProviderStatus(provider: string, status: DeliveryStatusEnum): Delivery {
    return this.create(
      DeliveryIdMother.random(),
      OrderIdMother.random(),
      ProviderMother.create(provider),
      LabelUrlMother.random(),
      new DeliveryStatus(status),
      new Date(),
      ProviderTrackingIdMother.random()
    );
  }

  static fromCommand(command: CreateDeliveryCommand): Delivery {
    return this.create(
      DeliveryIdMother.create(command.id),
      OrderIdMother.create(command.orderId),
      ProviderMother.create(command.provider),
      LabelUrlMother.create(command.labelUrl),
      DeliveryStatusMother.create(command.status),
      new Date(command.lastStatusUpdate),
      ProviderTrackingIdMother.create(command.providerTrackingId)
    );
  }
} 
