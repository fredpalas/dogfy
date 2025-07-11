import { Query } from '../../../../Shared/domain/Query';

export class FindDeliveryByTrackingIdQuery extends Query {
  constructor(public readonly providerTrackingId: string) {
    super();
  }
} 