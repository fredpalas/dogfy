import { Server } from "./server";
import { EventBus } from "../../../Contexts/Shared/domain/EventBus";
import { DomainEventSubscribers } from "../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers";
import container from "../dependency-injection";

export class LogisticsBackendApp {
  server?: Server;

  async start() {
    const port = process.env.PORT || '5001';
    this.server = new Server(port);

    await this.configureEventBus();

    return this.server.listen();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }

  async stop() {
    return this.server?.stop();
  }

  private async configureEventBus() {
    const eventBus = container.get<EventBus>('Logistics.Shared.domain.EventBus');
    eventBus.addSubscribers(DomainEventSubscribers.from(container));
  }
} 
