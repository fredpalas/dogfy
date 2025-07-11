import { OrderId } from '../../../../../src/Contexts/Logistics/Deliveries/domain/OrderId';
import { WordMother } from '../../../Shared/domain/WordMother';

export class OrderIdMother {
  static create(value: string): OrderId {
    return new OrderId(value);
  }

  static random(): OrderId {
    return this.create(WordMother.random({ maxLength: 20 }));
  }
} 