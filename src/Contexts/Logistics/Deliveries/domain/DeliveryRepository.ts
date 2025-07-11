import { Criteria } from '../../../Shared/domain/criteria/Criteria';
import { Delivery } from './Delivery';
import { DeliveryId } from './DeliveryId';
import { OrderId } from './OrderId';
import { ProviderTrackingId } from "./ProviderTrackingId";

export interface DeliveryRepository {
  save(delivery: Delivery): Promise<void>;
  search(id: DeliveryId): Promise<Delivery | null>;
  searchByOrderId(orderId: OrderId): Promise<Delivery | null>;
  searchByTrackingId(trackingId: ProviderTrackingId): Promise<Delivery | null>;
  matching(criteria: Criteria): Promise<Array<Delivery>>;
} 
