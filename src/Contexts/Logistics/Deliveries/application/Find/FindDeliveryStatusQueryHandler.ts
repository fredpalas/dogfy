import { FindDeliveryStatusQuery } from './FindDeliveryStatusQuery';
import { FindDeliveryStatusResponse } from './FindDeliveryStatusResponse';
import { QueryHandler } from '../../../../Shared/domain/QueryHandler';
import { DeliveryFinder } from './DeliveryFinder';
import { DeliveryId } from "../../domain/DeliveryId";

export class FindDeliveryStatusQueryHandler implements QueryHandler<FindDeliveryStatusQuery, FindDeliveryStatusResponse> {
  constructor(private finder: DeliveryFinder) {}

  subscribedTo() {
    return FindDeliveryStatusQuery;
  }

  async handle(query: FindDeliveryStatusQuery): Promise<FindDeliveryStatusResponse> {
    const delivery = await this.finder.run(new DeliveryId(query.id));

    return new FindDeliveryStatusResponse(
      delivery.status.value,
      delivery.lastStatusUpdate.toISOString()
    )
  }
} 
