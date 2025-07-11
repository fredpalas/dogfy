import { ProviderTrackingApi } from "../../../../../src/Contexts/Logistics/ProviderApi/domain/ProviderTrackingApi";


export class NrwProviderTrackingApiMock implements ProviderTrackingApi {
  getName(): string {
    return 'NRW';
  }

  async getStatus(providerTrackingId: string): Promise<{ status: string }> {
    return { status: 'delivered' };
  }
}
