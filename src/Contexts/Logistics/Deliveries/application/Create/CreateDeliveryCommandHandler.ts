import { CommandHandler } from '../../../../Shared/domain/CommandHandler';
import { CreateDeliveryCommand } from '../../domain/CreateDeliveryCommand';
import { DeliveryCreator } from './DeliveryCreator';
import { Command } from '../../../../Shared/domain/Command';
import { DeliveryStatusEnum } from '../../domain/DeliveryStatus';

export class CreateDeliveryCommandHandler implements CommandHandler<CreateDeliveryCommand> {
  constructor(private deliveryCreator: DeliveryCreator) {}

  subscribedTo(): Command {
    return CreateDeliveryCommand;
  }

  async handle(command: CreateDeliveryCommand): Promise<void> {
    await this.deliveryCreator.run(
      command.id,
      command.orderId,
      command.provider,
      command.labelUrl,
      command.status as DeliveryStatusEnum,
      new Date(command.lastStatusUpdate),
      command.providerTrackingId
    );
  }
} 