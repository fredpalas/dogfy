export class FindDeliveryStatusResponse {
  constructor(
    public readonly status: string,
    public readonly lastStatusUpdate: string
  ) {}
} 