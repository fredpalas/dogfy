import { Delivery } from "../../domain/Delivery";

export class FindDeliveryByTrackingIdQueryResponse {
  constructor(
    public readonly delivery: Delivery
  ) {}
}
