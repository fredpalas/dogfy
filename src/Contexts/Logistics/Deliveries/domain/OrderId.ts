import { ValueObject } from '../../../Shared/domain/value-object/ValueObject';

export class OrderId extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
} 