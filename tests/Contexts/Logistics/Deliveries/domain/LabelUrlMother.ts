import { LabelUrl } from '../../../../../src/Contexts/Logistics/Deliveries/domain/LabelUrl';
import { WordMother } from '../../../Shared/domain/WordMother';

export class LabelUrlMother {
  static create(value: string): LabelUrl {
    return new LabelUrl(value);
  }

  static random(): LabelUrl {
    return this.create(WordMother.random({ maxLength: 20 }));
  }
} 