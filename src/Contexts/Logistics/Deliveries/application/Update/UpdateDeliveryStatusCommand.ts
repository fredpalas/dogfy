import { Command } from '../../../../Shared/domain/Command';

export class UpdateDeliveryStatusCommand extends Command {
  constructor(
    public readonly id: string,
    public readonly status: string,
    public readonly lastStatusUpdate: string
  ) {
    super();
  }
} 
