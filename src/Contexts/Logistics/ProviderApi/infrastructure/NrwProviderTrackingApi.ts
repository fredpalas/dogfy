import { ProviderTrackingApi } from '../domain/ProviderTrackingApi';

export class NrwProviderTrackingApi implements ProviderTrackingApi {
  getName(): string {
    return 'NRW';
  }

  async getStatus(providerTrackingId: string): Promise<{ status: string }> {
    // Simulación: alterna entre 'pending', 'shipped' y 'delivered' según el trackingId
    const statuses = ['pending', 'shipped', 'delivered'];
    const idx = Math.abs(this.hashCode(providerTrackingId)) % statuses.length;
    return { status: statuses[idx] };
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
} 