import { UpdateDeliveryStatusCommandHandler } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Update/UpdateDeliveryStatusCommandHandler';
import { UpdateDeliveryStatusCommand } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Update/UpdateDeliveryStatusCommand';
import { DeliveryStatusUpdater } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Update/DeliveryStatusUpdater';
import { DeliveryRepository } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryRepository';
import { DeliveryMother } from "../../domain/DeliveryMother";
import { DeliveryFinder } from "../../../../../../src/Contexts/Logistics/Deliveries/application/Find/DeliveryFinder";

describe('UpdateDeliveryStatusCommandHandler', () => {
  it('actualiza el estado de la entrega correctamente', async () => {
    const repo: jest.Mocked<DeliveryRepository> = {
      save: jest.fn(),
      search: jest.fn(),
      searchByOrderId: jest.fn(),
      matching: jest.fn()
    };
    const delivery = DeliveryMother.random();
    repo.search.mockResolvedValue(delivery);
    const updater = new DeliveryStatusUpdater(repo, new DeliveryFinder(repo));
    const handler = new UpdateDeliveryStatusCommandHandler(updater);
    const command = new UpdateDeliveryStatusCommand(delivery.id.value, 'shipped', '2024-06-01T12:00:00Z');
    await handler.handle(command);
    expect(delivery.status.value).toBe('shipped');
    expect(delivery.lastStatusUpdate.toISOString()).toBe('2024-06-01T12:00:00.000Z');
    expect(repo.save).toHaveBeenCalledWith(delivery);
  });
}); 
