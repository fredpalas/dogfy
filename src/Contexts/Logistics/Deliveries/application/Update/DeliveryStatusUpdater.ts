import { DeliveryFinder } from '../Find/DeliveryFinder';
import { DeliveryId } from '../../domain/DeliveryId';
import { DeliveryStatus } from '../../domain/DeliveryStatus';
import { DeliveryRepository } from '../../domain/DeliveryRepository';

export class DeliveryStatusUpdater {

  constructor(private repository: DeliveryRepository, private finder: DeliveryFinder) {
  }

  async run(id: DeliveryId, status: DeliveryStatus, date: Date): Promise<void> {
    const delivery = await this.finder.run(id);
    delivery.changeStatus(status, date);
    await this.repository.save(delivery);
  }
} 
