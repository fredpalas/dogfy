import { DeliveryRepository } from '../../domain/DeliveryRepository';
import { Criteria } from '../../../../Shared/domain/criteria/Criteria';
import { Delivery } from '../../domain/Delivery';

export class DeliveriesFinder {
  constructor(private repository: DeliveryRepository) {}

  async run(criteria: Criteria): Promise<Delivery[]> {
    return this.repository.matching(criteria);
  }
} 