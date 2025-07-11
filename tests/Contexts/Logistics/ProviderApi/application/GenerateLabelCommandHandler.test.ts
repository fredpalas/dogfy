import { ProviderApi } from "../../../../../src/Contexts/Logistics/ProviderApi/domain/ProviderApi";
import { LabelGenerator } from "../../../../../src/Contexts/Logistics/ProviderApi/application/LabelGenerator";
import {
  GenerateLabelCommandHandler
} from "../../../../../src/Contexts/Logistics/ProviderApi/application/GenerateLabelCommandHandler";
import {
  GenerateLabelCommand
} from "../../../../../src/Contexts/Logistics/ProviderApi/application/GenerateLabelCommand";

describe('GenerateLabelCommandHandler', () => {
  it('debería devolver labelUrl y providerTrackingId usando el provider correcto', async () => {
    // Mock del provider
    const providerApiMock: ProviderApi = {
      getName: () => 'NRW',
      getLabelAndTrackingId: jest.fn().mockResolvedValue({
        labelUrl: 'https://mocked.com/label.pdf',
        providerTrackingId: 'MOCKED-TRACK'
      })
    };

    const labelGenerator = new LabelGenerator([providerApiMock]);
    const handler = new GenerateLabelCommandHandler(labelGenerator);

    const command = new GenerateLabelCommand('order-123', 'NRW');
    const response = await handler.handle(command);

    expect(response.labelUrl).toBe('https://mocked.com/label.pdf');
    expect(response.providerTrackingId).toBe('MOCKED-TRACK');
    expect(providerApiMock.getLabelAndTrackingId).toHaveBeenCalledWith('order-123');
  });

  it('lanza error si el provider no existe', async () => {
    const providerApiMock: ProviderApi = {
      getName: () => 'TLS',
      getLabelAndTrackingId: jest.fn()
    };

    const labelGenerator = new LabelGenerator([providerApiMock]);
    const handler = new GenerateLabelCommandHandler(labelGenerator);

    const command = new GenerateLabelCommand('order-123', 'NRW');
    await expect(handler.handle(command)).rejects.toThrow("Provider 'NRW' not found");
  });
}); 
