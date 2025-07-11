import { Uuid } from '../../../Shared/domain/value-object/Uuid';

export class DeliveryId extends Uuid {
  constructor(value: string) {
    super(value);
  }
} 