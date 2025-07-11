import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { QueryBus } from '../../../Contexts/Shared/domain/QueryBus';
import { FindDeliveryStatusQuery } from '../../../Contexts/Logistics/Deliveries/application/Find/FindDeliveryStatusQuery';
import { FindDeliveryStatusResponse } from '../../../Contexts/Logistics/Deliveries/application/Find/FindDeliveryStatusResponse';
import { Controller } from './Controller';
import { DeliveryNotFoundDomainError } from "../../../Contexts/Logistics/Deliveries/domain/DeliveryNotFoundDomainError";

export class DeliveryStatusGetController implements Controller {
  constructor(private queryBus: QueryBus) {}

  async run(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const response: FindDeliveryStatusResponse = await this.queryBus.ask(
        new FindDeliveryStatusQuery(id)
      );
      res.status(httpStatus.OK).json({
        status: response.status,
        lastStatusUpdate: response.lastStatusUpdate
      });
      return;
    } catch (e) {
      if (e instanceof DeliveryNotFoundDomainError) {
        res.status(httpStatus.NOT_FOUND).json(
          {
            error: e.message
          }
        );
        return;
      }

      throw e;
    }
  }
} 
