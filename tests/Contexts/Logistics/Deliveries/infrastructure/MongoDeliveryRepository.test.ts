import container from '../../../../../src/apps/logistics/dependency-injection';
import { DeliveryRepository } from '../../../../../src/Contexts/Logistics/Deliveries/domain/DeliveryRepository';
import { EnvironmentArranger } from '../../../Shared/infrastructure/arranger/EnvironmentArranger';
import { DeliveryMother } from '../domain/DeliveryMother';
import { Criteria } from '../../../../../src/Contexts/Shared/domain/criteria/Criteria';
import { Filters } from '../../../../../src/Contexts/Shared/domain/criteria/Filters';
import { Order } from '../../../../../src/Contexts/Shared/domain/criteria/Order';
import { Filter } from '../../../../../src/Contexts/Shared/domain/criteria/Filter';
import { FilterField } from '../../../../../src/Contexts/Shared/domain/criteria/FilterField';
import { FilterOperator } from '../../../../../src/Contexts/Shared/domain/criteria/FilterOperator';
import { FilterValue } from '../../../../../src/Contexts/Shared/domain/criteria/FilterValue';

const repository: DeliveryRepository = container.get('Logistics.Deliveries.domain.DeliveryRepository');
const environmentArranger: Promise<EnvironmentArranger> = container.get('Logistics.EnvironmentArranger');

beforeEach(async () => {
  await (await environmentArranger).arrange();
});

afterEach(async () => {
  await (await environmentArranger).arrange();
});

afterAll(async () => {
  await (await environmentArranger).close();
});

describe('MongoDeliveryRepository', () => {
  describe('#save', () => {
    it('should be able to persist the same delivery twice', async () => {
      const delivery = DeliveryMother.random();
      await repository.save(delivery);
      await repository.save(delivery);
      const found = await repository.search(delivery.id);
      expect(found).toEqual(delivery);
    });
  });

  describe('#search', () => {
    it('should return the existing delivery', async () => {
      const delivery = DeliveryMother.random();
      await repository.save(delivery);
      const found = await repository.search(delivery.id);
      expect(found).toEqual(delivery);
    });
  });

  describe('#searchByOrderId', () => {
    it('should return the delivery by orderId', async () => {
      const delivery = DeliveryMother.random();
      await repository.save(delivery);
      const found = await repository.searchByOrderId(delivery.orderId);
      expect(found).toEqual(delivery);
    });
  });

  describe('#matching', () => {
    it('should return all deliveries', async () => {
      const deliveries = [
        DeliveryMother.random(),
        DeliveryMother.random(),
        DeliveryMother.random()
      ];
      await Promise.all(deliveries.map(async delivery => repository.save(delivery)));
      const criteria = new Criteria(Filters.none(), Order.none());
      const result = await repository.matching(criteria);
      expect(result.length).toBeGreaterThanOrEqual(3);
      // Puedes mejorar la comparación según tus necesidades
    });

    it('should return only deliveries with the same provider', async () => {
      const provider = 'SAME_PROVIDER';
      const d1 = DeliveryMother.withProvider(provider);
      const d2 = DeliveryMother.withProvider(provider);
      const d3 = DeliveryMother.random();
      await repository.save(d1);
      await repository.save(d2);
      await repository.save(d3);
      const filter = new Filter(
        new FilterField('provider'),
        FilterOperator.equal(),
        new FilterValue(provider)
      );
      const criteria = new Criteria(new Filters([filter]), Order.none());
      const result = await repository.matching(criteria);
      expect(result.length).toBe(2);
      expect(result.map(r => r.provider.value)).toEqual([provider, provider]);
    });
  });
}); 