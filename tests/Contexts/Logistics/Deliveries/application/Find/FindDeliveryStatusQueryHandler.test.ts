import { FindDeliveryStatusQuery } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Find/FindDeliveryStatusQuery';
import { FindDeliveryStatusQueryHandler } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Find/FindDeliveryStatusQueryHandler';
import { FindDeliveryStatusResponse } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Find/FindDeliveryStatusResponse';
import { DeliveryFinder } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Find/DeliveryFinder';
import { DeliveryId } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryId';
import { DeliveryRepositoryMock } from "../../__mocks__/DeliveryRepositoryMock";
import { DeliveryMother } from "../../domain/DeliveryMother";
import { DeliveryIdMother } from "../../domain/DeliveryIdMother";
import {
  DeliveryNotFoundDomainError
} from "../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryNotFoundDomainError";

describe('FindDeliveryStatusQueryHandler', () => {
  it('devuelve el status y la fecha de última actualización si existe la entrega', async () => {
    const delivery = DeliveryMother.random();
    const repository = new DeliveryRepositoryMock();
    repository.search = jest.fn().mockResolvedValue(delivery);
    const finder = new DeliveryFinder(repository);
    const handler = new FindDeliveryStatusQueryHandler(finder);
    const query = new FindDeliveryStatusQuery(delivery.id.value);
    const response: FindDeliveryStatusResponse = await handler.handle(query);
    expect(response.status).toBe(delivery.status.value);
    expect(response.lastStatusUpdate).toBe(delivery.lastStatusUpdate.toISOString());
    expect(repository.search).toHaveBeenCalledWith(new DeliveryId(delivery.id.value));
  });

  it('lanza error si la entrega no existe', async () => {
    const repository = new DeliveryRepositoryMock();
    repository.search = jest.fn().mockResolvedValue(null);
    const finder = new DeliveryFinder(repository);
    const handler = new FindDeliveryStatusQueryHandler(finder);
    const query = new FindDeliveryStatusQuery(DeliveryIdMother.random().value);
    await expect(handler.handle(query)).rejects.toThrow(new DeliveryNotFoundDomainError(query.id));
  });
}); 
