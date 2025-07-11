import { ProviderApi } from '../domain/ProviderApi';

export class NrwProviderApi implements ProviderApi {
  getName(): string {
    return 'NRW';
  }

  async getLabelAndTrackingId(orderId: string): Promise<{ labelUrl: string; providerTrackingId: string }> {
    // Simulación de llamada a NRW
    return {
      labelUrl: `https://nrw-provider.com/label/${orderId}.pdf`,
      providerTrackingId: `NRW-${orderId}`
    };
  }
} 
