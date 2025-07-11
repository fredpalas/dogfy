import { Query } from '../../../../Shared/domain/Query';

export type FindDeliveriesQueryFilter = {
  field: string;
  operator: string;
  value: string;
};

export class FindDeliveriesQuery extends Query {
  constructor(
    public readonly filters: FindDeliveriesQueryFilter[]
  ) {
    super();
  }
} 