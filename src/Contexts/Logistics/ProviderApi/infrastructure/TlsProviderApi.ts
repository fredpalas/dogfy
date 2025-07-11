import { ProviderApi } from '../domain/ProviderApi';

export class TlsProviderApi implements ProviderApi {
  getName(): string {
    return 'TLS';
  }

  async getLabelAndTrackingId(orderId: string): Promise<{ labelUrl: string; providerTrackingId: string }> {
    // Simulación de llamada a TLS
    return {
      labelUrl: `https://tls-provider.com/label/${orderId}.pdf`,
      providerTrackingId: `TLS-${orderId}`
    };
  }
} 
