import assert from 'assert';
import { Given, Then, When } from 'cucumber';
import request from 'supertest';
import { application, environmentArranger } from './hooks.steps';
import { Delivery } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/Delivery';
import { DeliveryId } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryId';
import { Provider } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/Provider';
import { LabelUrl } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/LabelUrl';
import { DeliveryStatus } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryStatus';
import { ProviderTrackingId } from '../../../../../../src/Contexts/Logistics/Deliveries/domain/ProviderTrackingId';
import { OrderIdMother } from "../../../../../Contexts/Logistics/Deliveries/domain/OrderIdMother";
import container from "../../../../../../src/apps/logistics/dependency-injection";

let _request: request.Test;
let _response: request.Response;

Given('I send a POST request to {string} with body:', function (route: string, body: string) {
  const jsonBody = JSON.parse(body);
  _request = request(application.httpServer).post(route).send(jsonBody);
});

When('I send a GET request to {string}', function (route: string) {
  _request = request(application.httpServer).get(route);
});

Given('a delivery exists with id {string} and status {string} and lastStatusUpdate {string}', async function (id, status, lastStatusUpdate) {
  // Limpiar la base de datos antes de insertar
  await environmentArranger.arrange();
  // Crear la entrega en la base de datos
  const delivery = new Delivery(
    new DeliveryId(id),
    OrderIdMother.random(),
    new Provider('NRW'),
    new LabelUrl('https://label.pdf'),
    DeliveryStatus.fromValue(status),
    new Date(lastStatusUpdate),
    new ProviderTrackingId('TRACK-123')
  );
  const repository = container.get('Logistics.Deliveries.domain.DeliveryRepository');
  await repository.save(delivery);
});

Then('the response status code should be {int}', async function (status) {
  _response = await _request.expect(status);
});

Then('the response should be:', async function (expected) {
  _response = await _request;
  const expectedResponse = JSON.parse(expected);
  assert.deepStrictEqual(_response.body, expectedResponse);
});

Then('the response should contain error', async function () {
  _response = await _request;
  assert.ok(_response.body.error, 'Response should contain error');
});

Then('the response should contain id and labelUrl', async function () {
  _response = await _request;
  assert.ok(_response.body.id, 'Response should contain id');
  assert.ok(_response.body.labelUrl, 'Response should contain labelUrl');
  assert.ok(_response.body.providerTrackingId, 'Response should contain providerTrackingId');
}); 
