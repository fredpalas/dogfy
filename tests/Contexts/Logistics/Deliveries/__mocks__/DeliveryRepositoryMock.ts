import { DeliveryRepository } from '../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryRepository';
import { Delivery } from '../../../../../src/Contexts/Logistics/Deliveries/domain/Delivery';
import { DeliveryId } from '../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryId';
import { OrderId } from '../../../../../src/Contexts/Logistics/Deliveries/domain/OrderId';
import { Criteria } from '../../../../../src/Contexts/Shared/domain/criteria/Criteria';

export class DeliveryRepositoryMock implements DeliveryRepository {
  private saveMock = jest.fn();

  async save(delivery: Delivery): Promise<void> {
    this.saveMock(delivery);
  }

  async search(id: DeliveryId): Promise<Delivery | null> {
    return null;
  }

  async searchByOrderId(orderId: OrderId): Promise<Delivery | null> {
    return null;
  }

  async matching(criteria: Criteria): Promise<Array<Delivery>> {
    return [];
  }

  assertSaveHasBeenCalledWith(expected: Delivery) {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }
} 