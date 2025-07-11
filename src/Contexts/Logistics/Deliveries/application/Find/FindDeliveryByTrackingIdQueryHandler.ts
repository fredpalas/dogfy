import { QueryHandler } from '../../../../Shared/domain/QueryHandler';
import { FindDeliveryByTrackingIdQuery } from './FindDeliveryByTrackingIdQuery';
import { DeliveryByTrackingIdFinder } from './DeliveryByTrackingIdFinder';
import { FindDeliveryByTrackingIdQueryResponse } from "./FindDeliveryByTrackingIdQueryResponse";
import { ProviderTrackingId } from "../../domain/ProviderTrackingId";

export class FindDeliveryByTrackingIdQueryHandler implements QueryHandler<FindDeliveryByTrackingIdQuery, FindDeliveryByTrackingIdQueryResponse> {
  constructor(private readonly finder: DeliveryByTrackingIdFinder) {}

  subscribedTo() {
    return FindDeliveryByTrackingIdQuery;
  }

  async handle(query: FindDeliveryByTrackingIdQuery): Promise<FindDeliveryByTrackingIdQueryResponse> {
    const delivery = await this.finder.run(new ProviderTrackingId(query.providerTrackingId));
    return new FindDeliveryByTrackingIdQueryResponse(delivery);
  }
} 
