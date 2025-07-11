export class DeliveryNotTrackingIdFoundDomainError extends Error {
  constructor(id: string) {
    super(`Delivery with TrackingId <${id}> not found`);
  }
}
