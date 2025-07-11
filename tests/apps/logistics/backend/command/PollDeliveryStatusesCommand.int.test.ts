import container from "../../../../../src/apps/logistics/dependency-injection";
import {
  PollDeliveryStatusesCommand
} from "../../../../../src/apps/logistics/backend/command/PollDeliveryStatusesCommand";
import { DeliveryMother } from "../../../../Contexts/Logistics/Deliveries/domain/DeliveryMother";
import { DeliveryRepository } from "../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryRepository";
import { DeliveryStatusEnum } from "../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryStatus";
import { EnvironmentArranger } from "../../../../Contexts/Shared/infrastructure/arranger/EnvironmentArranger";

describe('PollDeliveryStatusesCommand (integración)', () => {
  const repository: DeliveryRepository = container.get('Logistics.Deliveries.domain.DeliveryRepository');
  const environmentArranger: Promise<EnvironmentArranger> = container.get('Logistics.EnvironmentArranger');

  beforeEach(async () => {
    await (await environmentArranger).arrange();
  });

  afterEach(async () => {
    //await (await environmentArranger).arrange();
  });

  afterAll(async () => {
    await (await environmentArranger).close();
  });

  it('actualiza el estado de las entregas NRW según el provider dummy', async () => {
    // Insertar una entrega pendiente con provider NRW
    const delivery = DeliveryMother.withProviderStatus('NRW', DeliveryStatusEnum.Shipped)
    await repository.save(delivery);
    // Ejecutar el comando
    await PollDeliveryStatusesCommand.run();

    // Verificar que el estado se actualizó a "DELIVERED"
    const updatedDelivery = await repository.search(delivery.id);
    expect(updatedDelivery).toBeDefined();
    expect(updatedDelivery?.status.value).toBe('delivered');
  });
});
