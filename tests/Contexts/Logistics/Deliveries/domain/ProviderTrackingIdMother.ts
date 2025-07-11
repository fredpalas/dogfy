import { ProviderTrackingId } from '../../../../../src/Contexts/Logistics/Deliveries/domain/ProviderTrackingId';
import { WordMother } from '../../../Shared/domain/WordMother';

export class ProviderTrackingIdMother {
  static create(value: string): ProviderTrackingId {
    return new ProviderTrackingId(value);
  }

  static random(): ProviderTrackingId {
    return this.create(WordMother.random({ maxLength: 20 }));
  }
}