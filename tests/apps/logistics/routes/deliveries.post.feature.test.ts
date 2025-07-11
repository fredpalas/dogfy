import request from 'supertest';
import { LogisticsBackendApp } from '../../../../src/apps/logistics/backend/LogisticsBackendApp';
import {
  CreateDeliveryCommandMother
} from "../../../Contexts/Logistics/Deliveries/application/Create/CreateDeliveryCommandMother";

describe('POST /deliveries', () => {
  let app: any;

  beforeAll(async () => {
    const backend = new LogisticsBackendApp();
    await backend.start();
    app = backend.httpServer;
  });

  it('should create a delivery and return 201 with id, labelUrl and providerTrackingId', async () => {
    const command = CreateDeliveryCommandMother.random();
    const response = await request(app)
      .post('/deliveries')
      .send({
        id: command.id,
        orderId: command.orderId,
        provider: command.provider,
        status: command.status,
        lastStatusUpdate: command.lastStatusUpdate
      })
      .expect(201);
    expect(response.body).toHaveProperty('id', command.id);
    expect(response.body).toHaveProperty('labelUrl');
    expect(response.body).toHaveProperty('providerTrackingId');
  });

  it('should return 422 if required fields are missing', async () => {
    const response = await request(app)
      .post('/deliveries')
      .send({})
      .expect(422);
    expect(response.body.errors).toBeDefined();
  });
}); 