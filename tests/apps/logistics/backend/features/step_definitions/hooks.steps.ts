import { AfterAll, BeforeAll } from 'cucumber';
import { LogisticsBackendApp } from '../../../../../../src/apps/logistics/backend/LogisticsBackendApp';
import { EventBus } from '../../../../../../src/Contexts/Shared/domain/EventBus';
import { EnvironmentArranger } from '../../../../../Contexts/Shared/infrastructure/arranger/EnvironmentArranger';
import container from '../../../../../../src/apps/logistics/dependency-injection';

let application: LogisticsBackendApp;
let environmentArranger: EnvironmentArranger;
let eventBus: EventBus;

BeforeAll(async () => {  

  environmentArranger = await container.get<Promise<EnvironmentArranger>>('Logistics.EnvironmentArranger');
  eventBus = container.get<EventBus>('Logistics.Shared.domain.EventBus');
  await environmentArranger.arrange();

  application = new LogisticsBackendApp();
  await application.start();
});

AfterAll(async () => {
  await environmentArranger.arrange();
  await environmentArranger.close();

  await application.stop();
});

export { application, environmentArranger, eventBus }; 