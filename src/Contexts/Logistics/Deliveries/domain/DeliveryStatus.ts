import { EnumValueObject } from '../../../Shared/domain/value-object/EnumValueObject';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';

export enum DeliveryStatusEnum {
  Pending = 'pending',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Failed = 'failed'
}

export class DeliveryStatus extends EnumValueObject<DeliveryStatusEnum> {
  constructor(value: DeliveryStatusEnum) {
    super(value, Object.values(DeliveryStatusEnum));
  }

  protected throwErrorForInvalidValue(value: DeliveryStatusEnum): void {
    throw new InvalidArgumentError(`El estado ${value} no es válido para DeliveryStatus`);
  }

  static fromValue(value: string): DeliveryStatus {
    for (const deliveryStatus of Object.values(DeliveryStatusEnum)) {
      if (value === deliveryStatus.toString()) {
        return new DeliveryStatus(deliveryStatus);
      }
    }

    throw new InvalidArgumentError(`The order type ${value} is invalid`);
  }
} 
