import { DeliveryRepository } from '../domain/DeliveryRepository';
import { Delivery } from '../domain/Delivery';
import { DeliveryId } from '../domain/DeliveryId';
import { OrderId } from '../domain/OrderId';
import { Criteria } from '../../../Shared/domain/criteria/Criteria';
import { MongoRepository } from '../../../Shared/infrastructure/persistence/mongo/MongoRepository';
import { ProviderTrackingId } from "../domain/ProviderTrackingId";

interface DeliveryDocument {
  _id: string;
  orderId: string;
  provider: string;
  labelUrl: string;
  status: string;
  lastStatusUpdate: string;
  providerTrackingId: string;
}

export class MongoDeliveryRepository extends MongoRepository<Delivery> implements DeliveryRepository {
  protected collectionName(): string {
    return 'deliveries';
  }

  async save(delivery: Delivery): Promise<void> {
    await this.persist(delivery.id.value, delivery);
  }

  async search(id: DeliveryId): Promise<Delivery | null> {
    const collection = await this.collection();
    const doc = await collection.findOne<DeliveryDocument>({ _id: id.value });
    return doc ? Delivery.fromPrimitives({ ...doc, id: doc._id }) : null;
  }

  async searchByOrderId(orderId: OrderId): Promise<Delivery | null> {
    const collection = await this.collection();
    const doc = await collection.findOne<DeliveryDocument>({ orderId: orderId.value });
    return doc ? Delivery.fromPrimitives({ ...doc, id: doc._id }) : null;
  }

  async searchByTrackingId(trackingId: ProviderTrackingId): Promise<Delivery | null> {
    const collection = await this.collection();
    const doc = await collection.findOne({ providerTrackingId: trackingId.value });
    return doc ? Delivery.fromPrimitives({ ...doc, id: doc._id }) : null;
  }

  async matching(criteria: Criteria): Promise<Array<Delivery>> {
    const documents = await this.searchByCriteria<DeliveryDocument>(criteria);
    return documents.map(document =>
        Delivery.fromPrimitives(
            {
                id: document._id,
                orderId: document.orderId,
                provider: document.provider,
                labelUrl: document.labelUrl,
                status: document.status,
                lastStatusUpdate: document.lastStatusUpdate,
                providerTrackingId: document.providerTrackingId
            }
        )
    );
  }
} 
