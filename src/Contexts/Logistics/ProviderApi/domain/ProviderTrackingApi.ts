export interface ProviderTrackingApi {
  getStatus(providerTrackingId: string): Promise<{ status: string }>;
  getName(): string;
} 