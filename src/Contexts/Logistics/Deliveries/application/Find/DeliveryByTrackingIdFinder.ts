import { DeliveryRepository } from '../../domain/DeliveryRepository';
import { Delivery } from '../../domain/Delivery';
import { ProviderTrackingId } from "../../domain/ProviderTrackingId";
import { DeliveryNotTrackingIdFoundDomainError } from "../../domain/DeliveryNotFoundByTrackingIdDomainError";

export class DeliveryByTrackingIdFinder {
  constructor(private repository: DeliveryRepository) {}

  async run(trackingId: ProviderTrackingId): Promise<Delivery> {
    const delivery = await this.repository.searchByTrackingId(trackingId);
    if (!delivery) {
      throw new DeliveryNotTrackingIdFoundDomainError(trackingId.value);
    }
    return delivery;
  }
} 
