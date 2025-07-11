export interface ProviderApi {
  getLabelAndTrackingId(orderId: string): Promise<{ labelUrl: string; providerTrackingId: string }>;
  getName(): string;
} 
