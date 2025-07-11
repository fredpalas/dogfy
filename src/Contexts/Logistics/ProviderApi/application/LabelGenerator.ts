import { ProviderApi } from '../domain/ProviderApi';
import { GenerateLabelResponse } from './GenerateLabelResponse';

export class LabelGenerator {
  constructor(private providerApis: ProviderApi[]) {}

  async run(orderId: string, provider: string): Promise<GenerateLabelResponse> {
    const providerApi = this.providerApis.find(api => api.getName() === provider);
    
    if (!providerApi) {
      throw new Error(`Provider '${provider}' not found`);
    }

    const { labelUrl, providerTrackingId } = await providerApi.getLabelAndTrackingId(orderId);
    return new GenerateLabelResponse(labelUrl, providerTrackingId);
  }
} 
