import { QueryHandler } from '../../../Shared/domain/QueryHandler';
import { FindProviderDeliveryStatusQuery } from './FindProviderDeliveryStatusQuery';
import { FindProviderDeliveryStatusResponse } from './FindProviderDeliveryStatusResponse';
import { ProviderTrackingApi } from '../domain/ProviderTrackingApi';
import { ProviderTrackingApiNotFound } from "../domain/ProviderTrackingApiNotFound";

export class FindProviderDeliveryStatusQueryHandler implements QueryHandler<FindProviderDeliveryStatusQuery, FindProviderDeliveryStatusResponse> {
  constructor(private readonly providerTrackingApis: ProviderTrackingApi[]) {}

  subscribedTo() {
    return FindProviderDeliveryStatusQuery;
  }

  async handle(query: FindProviderDeliveryStatusQuery): Promise<FindProviderDeliveryStatusResponse> {
    const api = this.providerTrackingApis.find(api => api.getName() === query.provider);
    if (!api){
        throw new ProviderTrackingApiNotFound(query.provider);
    }
    const { status } = await api.getStatus(query.providerTrackingId);
    return new FindProviderDeliveryStatusResponse(status);
  }
} 
