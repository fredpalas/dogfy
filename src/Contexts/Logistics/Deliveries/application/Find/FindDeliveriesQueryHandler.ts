import { QueryHandler } from '../../../../Shared/domain/QueryHandler';
import { FindDeliveriesQuery } from './FindDeliveriesQuery';
import { DeliveriesFinder } from './DeliveriesFinder';
import { Criteria } from '../../../../Shared/domain/criteria/Criteria';
import { Filters } from '../../../../Shared/domain/criteria/Filters';
import { Filter } from '../../../../Shared/domain/criteria/Filter';
import { FilterField } from '../../../../Shared/domain/criteria/FilterField';
import { FilterOperator } from '../../../../Shared/domain/criteria/FilterOperator';
import { FilterValue } from '../../../../Shared/domain/criteria/FilterValue';
import { Order } from '../../../../Shared/domain/criteria/Order';
import { Delivery } from '../../domain/Delivery';

export class FindDeliveriesQueryHandler implements QueryHandler<FindDeliveriesQuery, Delivery[]> {
  constructor(private readonly finder: DeliveriesFinder) {}

  subscribedTo() {
    return FindDeliveriesQuery;
  }

  async handle(query: FindDeliveriesQuery): Promise<Delivery[]> {
    const filters = query.filters.map(
      f => new Filter(
        new FilterField(f.field),
        FilterOperator.fromValue(f.operator),
        new FilterValue(f.value)
      )
    );
    const criteria = new Criteria(new Filters(filters), Order.none());
    return this.finder.run(criteria);
  }
} 
