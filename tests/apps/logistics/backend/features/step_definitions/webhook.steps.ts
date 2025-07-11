import assert from 'assert';
import { Given, When, Then } from 'cucumber';
import request from 'supertest';
import { application, environmentArranger } from './hooks.steps';
import { Delivery } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/Delivery';
import { Provider } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/Provider';
import { LabelUrl } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/LabelUrl';
import { DeliveryStatus } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryStatus';
import { ProviderTrackingId } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/ProviderTrackingId';
import { DeliveryIdMother } from "../../../../../Contexts/Logistics/Deliveries/domain/DeliveryIdMother";
import { OrderIdMother } from "../../../../../Contexts/Logistics/Deliveries/domain/OrderIdMother";
import container from "../../../../../../src/apps/logistics/dependency-injection";

let _request: request.Test;
let _response: request.Response;

Given('a delivery exists with providerTrackingId {string} and status {string}', async function (trackingId: string, status: string) {
  await environmentArranger.arrange();
  const delivery = new Delivery(
    DeliveryIdMother.random(),
    OrderIdMother.random(),
    new Provider('NRW'),
    new LabelUrl('https://label.pdf'),
    DeliveryStatus.fromValue(status),
    new Date(),
    new ProviderTrackingId(trackingId)
  );
  const repository = container.get('Logistics.Deliveries.domain.DeliveryRepository');
  await repository.save(delivery);
});

Given('no delivery exists with providerTrackingId {string}', async function (trackingId: string) {
  await environmentArranger.arrange();
});

When('a webhook is sent with providerTrackingId {string} and status {string}', async function (trackingId: string, status: string) {
  _request = request(application.httpServer).post('/deliveries/webhook').send({
    providerTrackingId: trackingId,
    status: status,
    date: new Date().toISOString()
  });
});

Then('the response of webhook status code should be {int}', async function (status: number) {
  _response = await _request.expect(status);
});

Then('the response of webhook should be:', async function (expected) {
  _response = await _request;
  const expectedResponse = JSON.parse(expected);
  assert.deepStrictEqual(_response.body, expectedResponse);
});

Then('the delivery status should be {string}', async function (expectedStatus: string) {
  const repository = container.get('Logistics.Deliveries.domain.DeliveryRepository');
  const delivery = await repository.searchByTrackingId('TRACK-123');
  assert.ok(delivery, 'Delivery should exist');
  assert.strictEqual(delivery?.status.value, expectedStatus);
}); 
