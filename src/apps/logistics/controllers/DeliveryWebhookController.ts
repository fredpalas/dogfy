import { Request, Response } from 'express';
import container from '../dependency-injection';
import { CommandBus } from '../../../Contexts/Shared/domain/CommandBus';
import { UpdateDeliveryStatusCommand } from '../../../Contexts/Logistics/Deliveries/application/Update/UpdateDeliveryStatusCommand';
import { QueryBus } from '../../../Contexts/Shared/domain/QueryBus';
import { FindDeliveryByTrackingIdQuery } from '../../../Contexts/Logistics/Deliveries/application/Find/FindDeliveryByTrackingIdQuery';
import {
  FindDeliveryByTrackingIdQueryResponse
} from "../../../Contexts/Logistics/Deliveries/application/Find/FindDeliveryByTrackingIdQueryResponse";
import {
  DeliveryNotTrackingIdFoundDomainError
} from "../../../Contexts/Logistics/Deliveries/domain/DeliveryNotFoundByTrackingIdDomainError";

export class DeliveryWebhookController {
  private commandBus: CommandBus;
  private queryBus: QueryBus;

  constructor() {
    this.commandBus = container.get('Logistics.Shared.domain.CommandBus');
    this.queryBus = container.get('Logistics.Shared.domain.QueryBus');
  }

  async run(req: Request, res: Response) {
    const { providerTrackingId, status, date } = req.body;
    try {
      const delivery = (await this.queryBus.ask<FindDeliveryByTrackingIdQueryResponse>(new FindDeliveryByTrackingIdQuery(providerTrackingId))).delivery;
      await this.commandBus.dispatch(new UpdateDeliveryStatusCommand(delivery.id.value, status, date || new Date().toISOString()));
      return res.status(202).json({ message: 'Estado actualizado' });
    } catch (e) {
      if (e instanceof DeliveryNotTrackingIdFoundDomainError) {
        return res.status(404).json({
          error: e.message
        });
      }
      throw e;
    }

  }
} 
