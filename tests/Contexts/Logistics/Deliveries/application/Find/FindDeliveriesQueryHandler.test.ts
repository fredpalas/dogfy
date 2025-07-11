import { FindDeliveriesQueryHandler } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Find/FindDeliveriesQueryHandler';
import { FindDeliveriesQuery } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Find/FindDeliveriesQuery';
import { DeliveryRepository } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryRepository';
import { DeliveriesFinder } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Find/DeliveriesFinder';
import { DeliveryMother } from "../../domain/DeliveryMother";

describe('FindDeliveriesQueryHandler', () => {
  it('devuelve las entregas que cumplen los filtros', async () => {
    const repo: jest.Mocked<DeliveryRepository> = {
      save: jest.fn(),
      search: jest.fn(),
      searchByOrderId: jest.fn(),
      matching: jest.fn()
    };
    const deliveries = [DeliveryMother.random(), DeliveryMother.random()];
    repo.matching.mockResolvedValue(deliveries);
    const finder = new DeliveriesFinder(repo);
    const handler = new FindDeliveriesQueryHandler(finder);
    const filters = [
      { field: 'status', operator: '=', value: 'pending' },
      { field: 'provider', operator: '=', value: 'NRW' }
    ];
    const query = new FindDeliveriesQuery(filters);
    const result = await handler.handle(query);
    expect(result).toEqual(deliveries);
    expect(repo.matching).toHaveBeenCalled();
  });
});
