import { ProviderApi } from '../domain/ProviderApi';

export class DummyProviderApi implements ProviderApi {
  getName(): string {
    return 'DUMMY';
  }

  async getLabelAndTrackingId(orderId: string): Promise<{ labelUrl: string; providerTrackingId: string }> {
    // Simulación de llamada a proveedor
    return {
      labelUrl: `https://dummy-provider.com/label/${orderId}.pdf`,
      providerTrackingId: `DUMMY-${orderId}`
    };
  }
} 
