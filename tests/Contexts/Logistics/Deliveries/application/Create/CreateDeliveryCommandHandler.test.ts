import { CreateDeliveryCommandHandler } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Create/CreateDeliveryCommandHandler';
import { DeliveryCreator } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Create/DeliveryCreator';
import { DeliveryRepositoryMock } from '../../__mocks__/DeliveryRepositoryMock';
import EventBusMock from '../../../../Mooc/Shared/domain/EventBusMock';
import { DeliveryMother } from '../../domain/DeliveryMother';
import { DeliveryCreatedDomainEvent } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryCreatedDomainEvent';
import { CreateDeliveryCommandMother } from './CreateDeliveryCommandMother';
import { InvalidArgumentError } from '../../../../../../src/Contexts/Shared/domain/value-object/InvalidArgumentError';

describe('CreateDeliveryCommandHandler', () => {
  let repository: DeliveryRepositoryMock;
  let creator: DeliveryCreator;
  let eventBus: EventBusMock;
  let handler: CreateDeliveryCommandHandler;

  beforeEach(() => {
    repository = new DeliveryRepositoryMock();
    eventBus = new EventBusMock();
    creator = new DeliveryCreator(repository, eventBus);
    handler = new CreateDeliveryCommandHandler(creator);
  });

  it('debe crear una entrega válida y publicar el evento', async () => {
    const command = CreateDeliveryCommandMother.random();
    const delivery = DeliveryMother.fromCommand(command);
    const domainEvent = new DeliveryCreatedDomainEvent({
      aggregateId: delivery.id.value,
      orderId: delivery.orderId.value,
      provider: delivery.provider.value,
      labelUrl: delivery.labelUrl.value,
      status: delivery.status.value,
      lastStatusUpdate: delivery.lastStatusUpdate.toISOString(),
      providerTrackingId: delivery.providerTrackingId.value
    });

    await handler.handle(command);

    repository.assertSaveHasBeenCalledWith(delivery);
    eventBus.assertLastPublishedEventIs(domainEvent);
  });

  it('lanza error si el estado es inválido', async () => {
    const command = CreateDeliveryCommandMother.invalidStatus();
    await expect(handler.handle(command)).rejects.toThrowError(InvalidArgumentError);
  });
}); 