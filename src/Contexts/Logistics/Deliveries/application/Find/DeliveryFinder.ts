import { DeliveryRepository } from '../../domain/DeliveryRepository';
import { DeliveryId } from '../../domain/DeliveryId';
import { DeliveryNotFoundDomainError } from "../../domain/DeliveryNotFoundDomainError";
import { Delivery } from "../../domain/Delivery";

export class DeliveryFinder {
  constructor(private repository: DeliveryRepository) {}

  async run(id: DeliveryId): Promise<Delivery> {
    const delivery = await this.repository.search(id);
    if (!delivery) {
      throw new DeliveryNotFoundDomainError(id.value)
    }
    return delivery;
  }
} 
