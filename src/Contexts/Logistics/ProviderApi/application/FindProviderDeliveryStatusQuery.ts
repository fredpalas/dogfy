import { Query } from '../../../Shared/domain/Query';

export class FindProviderDeliveryStatusQuery extends Query {
  constructor(
    public readonly provider: string,
    public readonly providerTrackingId: string
  ) {
    super();
  }
} 