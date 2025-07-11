import { GenerateLabelCommand } from './GenerateLabelCommand';
import { LabelGenerator } from './LabelGenerator';
import { GenerateLabelResponse } from './GenerateLabelResponse';
import { CommandHandler } from '../../../Shared/domain/CommandHandler';

export class GenerateLabelCommandHandler implements CommandHandler<GenerateLabelCommand, GenerateLabelResponse> {
  constructor(private labelGenerator: LabelGenerator) {}

  subscribedTo() {
    return GenerateLabelCommand;
  }

  async handle(command: GenerateLabelCommand): Promise<GenerateLabelResponse> {
    return this.labelGenerator.run(command.orderId, command.provider);
  }
} 