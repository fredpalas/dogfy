import { FindDeliveryByTrackingIdQueryHandler } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Find/FindDeliveryByTrackingIdQueryHandler';
import { FindDeliveryByTrackingIdQuery } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Find/FindDeliveryByTrackingIdQuery';
import { DeliveryByTrackingIdFinder } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Find/DeliveryByTrackingIdFinder';
import { DeliveryRepository } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryRepository';
import { DeliveryMother } from "../../domain/DeliveryMother";

describe('FindDeliveryByTrackingIdQueryHandler', () => {
  it('devuelve la entrega si existe', async () => {
    const repo: jest.Mocked<DeliveryRepository> = {
      save: jest.fn(),
      search: jest.fn(),
      searchByOrderId: jest.fn(),
      searchByTrackingId: jest.fn(),
      matching: jest.fn()
    };
    const delivery = DeliveryMother.random();
    repo.searchByTrackingId.mockResolvedValue(delivery);
    const finder = new DeliveryByTrackingIdFinder(repo);
    const handler = new FindDeliveryByTrackingIdQueryHandler(finder);
    const query = new FindDeliveryByTrackingIdQuery(delivery.providerTrackingId.value);
    const result = await handler.handle(query);
    expect(result.delivery).toEqual(delivery);
    expect(repo.searchByTrackingId).toHaveBeenCalledWith(delivery.providerTrackingId);
  });

  it('lanza error si la entrega no existe', async () => {
    const repo: jest.Mocked<DeliveryRepository> = {
      save: jest.fn(),
      search: jest.fn(),
      searchByOrderId: jest.fn(),
      searchByTrackingId: jest.fn().mockResolvedValue(null),
      matching: jest.fn()
    };
    const finder = new DeliveryByTrackingIdFinder(repo);
    const handler = new FindDeliveryByTrackingIdQueryHandler(finder);
    const query = new FindDeliveryByTrackingIdQuery('NO-EXISTE');
    await expect(handler.handle(query)).rejects.toThrow();
  });
}); 
