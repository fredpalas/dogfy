import { DeliveryStatus, DeliveryStatusEnum } from '../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryStatus';

export class DeliveryStatusMother {
  static create(value: DeliveryStatusEnum | string): DeliveryStatus {
    return new DeliveryStatus(value as DeliveryStatusEnum);
  }

  static random(): DeliveryStatus {
    const values = Object.values(DeliveryStatusEnum);
    const randomValue = values[Math.floor(Math.random() * values.length)];
    return this.create(randomValue as DeliveryStatusEnum);
  }
} 