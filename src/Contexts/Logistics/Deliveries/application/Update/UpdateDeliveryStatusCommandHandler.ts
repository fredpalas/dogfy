import { CommandHandler } from '../../../../Shared/domain/CommandHandler';
import { UpdateDeliveryStatusCommand } from './UpdateDeliveryStatusCommand';
import { DeliveryId } from '../../domain/DeliveryId';
import { DeliveryStatus } from '../../domain/DeliveryStatus';
import { DeliveryStatusUpdater } from './DeliveryStatusUpdater';

export class UpdateDeliveryStatusCommandHandler implements CommandHandler<UpdateDeliveryStatusCommand> {
  constructor(private readonly updater: DeliveryStatusUpdater) {}

  subscribedTo() {
    return UpdateDeliveryStatusCommand;
  }

  async handle(command: UpdateDeliveryStatusCommand): Promise<void> {
    await this.updater.run(
      new DeliveryId(command.id),
      DeliveryStatus.fromValue(command.status),
      new Date(command.lastStatusUpdate)
    );
  }
} 
