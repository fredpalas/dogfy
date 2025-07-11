import { Provider } from '../../../../../src/Contexts/Logistics/Deliveries/domain/Provider';
import { WordMother } from '../../../Shared/domain/WordMother';

export class ProviderMother {
  static create(value: string): Provider {
    return new Provider(value);
  }

  static random(): Provider {
    return this.create(WordMother.random({ maxLength: 20 }));
  }
} 