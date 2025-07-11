import { FindProviderDeliveryStatusQueryHandler } from '../../../../../src/Contexts/Logistics/ProviderApi/application/FindProviderDeliveryStatusQueryHandler';
import { FindProviderDeliveryStatusQuery } from '../../../../../src/Contexts/Logistics/ProviderApi/application/FindProviderDeliveryStatusQuery';
import { FindProviderDeliveryStatusResponse } from '../../../../../src/Contexts/Logistics/ProviderApi/application/FindProviderDeliveryStatusResponse';
import { ProviderTrackingApi } from '../../../../../src/Contexts/Logistics/ProviderApi/domain/ProviderTrackingApi';

describe('FindProviderDeliveryStatusQueryHandler', () => {
  it('devuelve el status usando el provider correcto', async () => {
    const provider = 'NRW';
    const providerTrackingId = 'TRACK-123';
    const status = 'shipped';
    const providerApiMock: ProviderTrackingApi = {
      getName: () => provider,
      getStatus: jest.fn().mockResolvedValue({ status })
    };
    const handler = new FindProviderDeliveryStatusQueryHandler([providerApiMock]);
    const query = new FindProviderDeliveryStatusQuery(provider, providerTrackingId);
    const response: FindProviderDeliveryStatusResponse = await handler.handle(query);
    expect(response.status).toBe(status);
    expect(providerApiMock.getStatus).toHaveBeenCalledWith(providerTrackingId);
  });

  it('lanza error si el provider no existe', async () => {
    const handler = new FindProviderDeliveryStatusQueryHandler([]);
    const query = new FindProviderDeliveryStatusQuery('NOEXISTE', 'TRACK-123');
    await expect(handler.handle(query)).rejects.toThrow('ProviderTrackingApi');
  });
}); 