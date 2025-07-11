import { QueryBus } from "../../../Shared/domain/QueryBus";
import { CommandBus } from "../../../Shared/domain/CommandBus";
import { FindProviderDeliveryStatusQuery } from "../../ProviderApi/application/FindProviderDeliveryStatusQuery";
import { UpdateDeliveryStatusCommand } from "../application/Update/UpdateDeliveryStatusCommand";
import { FindProviderDeliveryStatusResponse } from "../../ProviderApi/application/FindProviderDeliveryStatusResponse";
import { FindDeliveriesQuery } from "../application/Find/FindDeliveriesQuery";
import { Delivery } from "../domain/Delivery";
import { ProviderTrackingApiNotFound } from "../../ProviderApi/domain/ProviderTrackingApiNotFound";

export class DeliveryStatusPollingOrchestrator {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {
  }

  async poll(): Promise<void> {
    // Buscar entregas con status 'pending' o 'shipped'
    const filters = [
      { field: "status", operator: "=", value: "pending" }
    ];
    const deliveries: Delivery[] = await this.queryBus.ask(new FindDeliveriesQuery(filters));
    const filters2 = [
      { field: "status", operator: "=", value: "shipped" }
    ];
    const deliveries2: Delivery[] = await this.queryBus.ask(new FindDeliveriesQuery(filters2));
    for (const delivery of [...deliveries, ...deliveries2]) {
      const query = new FindProviderDeliveryStatusQuery(
        delivery.provider.value,
        delivery.providerTrackingId.value
      );
      try {
        const response = await this.queryBus.ask<FindProviderDeliveryStatusResponse>(query);
        console.log(response);
        if (response.status !== delivery.status.value) {
          const command = new UpdateDeliveryStatusCommand(
            delivery.id.value,
            response.status,
            new Date().toISOString()
          );
          await this.commandBus.dispatch(command);
        }
      } catch (error) {
        if (error instanceof ProviderTrackingApiNotFound) {
          continue;
        }

        throw error;
      }
    }
  }
} 
