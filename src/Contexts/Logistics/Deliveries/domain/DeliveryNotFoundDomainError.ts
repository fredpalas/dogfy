export class DeliveryNotFoundDomainError extends Error {
  constructor(id: string) {
    super(`Delivery with id <${id}> not found`);
  }
}
