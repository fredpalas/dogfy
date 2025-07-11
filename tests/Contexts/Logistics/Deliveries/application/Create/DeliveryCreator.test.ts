import { DeliveryCreator } from '../../../../../../src/Contexts/Logistics/Deliveries/application/Create/DeliveryCreator';
import { DeliveryMother } from '../../domain/DeliveryMother';
import { DeliveryRepositoryMock } from '../../__mocks__/DeliveryRepositoryMock';
import EventBusMock from '../../../../Mooc/Shared/domain/EventBusMock';
import { DeliveryCreatedDomainEvent } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryCreatedDomainEvent';


describe('DeliveryCreator', () => {
  it('crea una entrega y publica el evento de dominio', async () => {
    const delivery = DeliveryMother.random();
    const domainEvent = new DeliveryCreatedDomainEvent({
      aggregateId: delivery.id.value,
      orderId: delivery.orderId.value,
      provider: delivery.provider.value,
      labelUrl: delivery.labelUrl.value,
      status: delivery.status.value,
      lastStatusUpdate: delivery.lastStatusUpdate.toISOString(),
      providerTrackingId: delivery.providerTrackingId.value
    });

    const repository = new DeliveryRepositoryMock();
    const eventBus = new EventBusMock();
    const applicationService = new DeliveryCreator(repository, eventBus);

    await applicationService.run(
      delivery.id.value,
      delivery.orderId.value,
      delivery.provider.value,
      delivery.labelUrl.value,
      delivery.status.value,
      delivery.lastStatusUpdate,
      delivery.providerTrackingId.value
    );

    repository.assertSaveHasBeenCalledWith(delivery);
    eventBus.assertLastPublishedEventIs(domainEvent);
  });
}); 