export class ProviderTrackingApiNotFound extends Error {
  constructor(provider: string) {
    super(`ProviderTrackingApi '${provider}' not found`);
  }
}
