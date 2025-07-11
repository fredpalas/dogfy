import { Request, Response } from "express";
import httpStatus from "http-status";
import { CommandBus } from "../../../Contexts/Shared/domain/CommandBus";
import { CreateDeliveryCommand } from "../../../Contexts/Logistics/Deliveries/domain/CreateDeliveryCommand";
import { UuidGenerator } from "../../../Contexts/Shared/domain/UuidGenerator";
import { Controller } from "./Controller";
import { GenerateLabelCommand } from '../../../Contexts/Logistics/ProviderApi/application/GenerateLabelCommand';
import { GenerateLabelResponse } from '../../../Contexts/Logistics/ProviderApi/application/GenerateLabelResponse';

export class DeliveryPostController implements Controller {
  constructor(
    private commandBus: CommandBus,
    private uuidGenerator: UuidGenerator
  ) {}

  async run(req: Request, res: Response) {
    const id = this.uuidGenerator.generate();
    const { orderId, provider, status } = req.body;

    // Usar el CommandBus para generar la label
    const labelResponse: GenerateLabelResponse = await this.commandBus.dispatch(
      new GenerateLabelCommand(orderId, provider)
    );
    const lastStatusUpdate = new Date().toISOString();

    const command = new CreateDeliveryCommand({
      id,
      orderId,
      provider,
      labelUrl: labelResponse.labelUrl,
      status,
      lastStatusUpdate,
      providerTrackingId: labelResponse.providerTrackingId
    });
    await this.commandBus.dispatch(command);
    res.status(httpStatus.CREATED).json({
      id,
      orderId,
      provider,
      labelUrl: labelResponse.labelUrl,
      status,
      lastStatusUpdate,
      providerTrackingId: labelResponse.providerTrackingId
    });
  }
} 
