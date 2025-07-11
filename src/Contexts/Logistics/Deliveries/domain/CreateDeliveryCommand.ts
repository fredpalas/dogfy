import { Command } from '../../../Shared/domain/Command';

export type CreateDeliveryCommandParams = {
  id: string;
  orderId: string;
  provider: string;
  labelUrl: string;
  status: string;
  lastStatusUpdate: string;
  providerTrackingId: string;
};

export class CreateDeliveryCommand extends Command {
  id: string;
  orderId: string;
  provider: string;
  labelUrl: string;
  status: string;
  lastStatusUpdate: string;
  providerTrackingId: string;

  constructor(params: CreateDeliveryCommandParams) {
    super();
    this.id = params.id;
    this.orderId = params.orderId;
    this.provider = params.provider;
    this.labelUrl = params.labelUrl;
    this.status = params.status;
    this.lastStatusUpdate = params.lastStatusUpdate;
    this.providerTrackingId = params.providerTrackingId;
  }
} 