import { DeliveryId } from '../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryId';
import { UuidMother } from '../../../Shared/domain/UuidMother';

export class DeliveryIdMother {
  static create(value: string): DeliveryId {
    return new DeliveryId(value);
  }

  static random(): DeliveryId {
    return this.create(UuidMother.random());
  }
} 