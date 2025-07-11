import container from "../../dependency-injection";
import {
  DeliveryStatusPollingOrchestrator
} from "../../../../Contexts/Logistics/Deliveries/infrastructure/DeliveryStatusPollingOrchestrator";
import { EventBus } from "../../../../Contexts/Shared/domain/EventBus";
import { DomainEventSubscribers } from "../../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers";

export class PollDeliveryStatusesCommand {
  static async run() {
    const eventBus = container.get<EventBus>('Logistics.Shared.domain.EventBus');
    eventBus.addSubscribers(DomainEventSubscribers.from(container));
    const orchestrator = container.get<DeliveryStatusPollingOrchestrator>('Logistics.Deliveries.infrastructure.DeliveryStatusPollingOrchestrator');
    await orchestrator.poll();
    console.log('Polling de estados de entregas completado');
  }
}
