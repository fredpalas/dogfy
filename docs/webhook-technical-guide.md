# Technical Guide: Webhook Implementation

## System Architecture

### Component Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Webhook       │    │   Query Bus      │    │   Command Bus   │
│   Controller    │───▶│   + Handler      │───▶│   + Handler     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │   Repository    │    │   Domain Event  │
         │              │   (MongoDB)     │    │   Bus           │
         └──────────────└─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Reception**: `DeliveryWebhookPostController` receives HTTP request
2. **Validation**: Required fields are validated
3. **Search**: `FindDeliveryByProviderTrackingIdQuery` is executed
4. **Update**: `UpdateDeliveryStatusCommand` is executed
5. **Persistence**: Data is saved to MongoDB
6. **Events**: Domain events are triggered

## Detailed Implementation

### 1. Controller

```typescript
// DeliveryWebhookPostController.ts
export class DeliveryWebhookPostController extends Controller {
  async run(req: Request, res: Response): Promise<void> {
    const { providerTrackingId, status, date } = req.body;
    
    // Validation
    if (!providerTrackingId || !status || !date) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    try {
      // Search delivery
      const query = new FindDeliveryByProviderTrackingIdQuery(providerTrackingId);
      const delivery = await this.queryBus.ask(query);
      
      if (!delivery) {
        res.status(404).json({ 
          error: 'Delivery not found', 
          providerTrackingId 
        });
        return;
      }

      // Update status
      const command = new UpdateDeliveryStatusCommand(
        delivery.id.value,
        status,
        new Date(date)
      );
      
      await this.commandBus.dispatch(command);
      
      res.status(202).json({
        message: 'Delivery status updated successfully',
        deliveryId: delivery.id.value,
        providerTrackingId,
        newStatus: status
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

### 2. Query and Handler

```typescript
// FindDeliveryByProviderTrackingIdQuery.ts
export class FindDeliveryByProviderTrackingIdQuery extends Query {
  constructor(public readonly providerTrackingId: string) {
    super();
  }
}

// FindDeliveryByProviderTrackingIdQueryHandler.ts
export class FindDeliveryByProviderTrackingIdQueryHandler implements QueryHandler<FindDeliveryByProviderTrackingIdQuery, Delivery | null> {
  constructor(private repository: DeliveryRepository) {}

  async ask(query: FindDeliveryByProviderTrackingIdQuery): Promise<Delivery | null> {
    return this.repository.searchByProviderTrackingId(query.providerTrackingId);
  }
}
```

### 3. Command and Handler

```typescript
// UpdateDeliveryStatusCommand.ts
export class UpdateDeliveryStatusCommand extends Command {
  constructor(
    public readonly deliveryId: string,
    public readonly status: string,
    public readonly date: Date
  ) {
    super();
  }
}

// UpdateDeliveryStatusCommandHandler.ts
export class UpdateDeliveryStatusCommandHandler implements CommandHandler<UpdateDeliveryStatusCommand> {
  constructor(
    private repository: DeliveryRepository,
    private eventBus: EventBus
  ) {}

  async handle(command: UpdateDeliveryStatusCommand): Promise<void> {
    const delivery = await this.repository.search(new DeliveryId(command.deliveryId));
    
    if (!delivery) {
      throw new DeliveryNotFoundError(command.deliveryId);
    }

    delivery.updateStatus(command.status, command.date);
    
    await this.repository.save(delivery);
    
    // Trigger domain event
    await this.eventBus.publish(delivery.pullDomainEvents());
  }
}
```

## Dependency Configuration

### Container Configuration

```yaml
# application.yaml
services:
  # Query Handlers
  FindDeliveryByProviderTrackingIdQueryHandler:
    class: Contexts/Logistics/Deliveries/application/Find/FindDeliveryByProviderTrackingIdQueryHandler
    arguments: ['@DeliveryRepository']
    tags:
      - { name: 'query_handler', handles: 'FindDeliveryByProviderTrackingIdQuery' }

  # Command Handlers
  UpdateDeliveryStatusCommandHandler:
    class: Contexts/Logistics/Deliveries/application/Update/UpdateDeliveryStatusCommandHandler
    arguments: ['@DeliveryRepository', '@EventBus']
    tags:
      - { name: 'command_handler', handles: 'UpdateDeliveryStatusCommand' }

  # Controllers
  DeliveryWebhookPostController:
    class: Apps/Logistics/controllers/DeliveryWebhookPostController
    arguments: ['@QueryBus', '@CommandBus']
    tags:
      - { name: 'controller' }
```

## Testing Strategy

### 1. Unit Tests

#### Query Handler Test

```typescript
describe('FindDeliveryByProviderTrackingIdQueryHandler', () => {
  let handler: FindDeliveryByProviderTrackingIdQueryHandler;
  let repository: DeliveryRepository;

  beforeEach(() => {
    repository = mock<DeliveryRepository>();
    handler = new FindDeliveryByProviderTrackingIdQueryHandler(repository);
  });

  it('should find delivery by provider tracking id', async () => {
    const delivery = DeliveryMother.create();
    const query = new FindDeliveryByProviderTrackingIdQuery('TRACK-123');
    
    repository.searchByProviderTrackingId.mockResolvedValue(delivery);
    
    const result = await handler.ask(query);
    
    expect(result).toBe(delivery);
    expect(repository.searchByProviderTrackingId).toHaveBeenCalledWith('TRACK-123');
  });
});
```

#### Command Handler Test

```typescript
describe('UpdateDeliveryStatusCommandHandler', () => {
  let handler: UpdateDeliveryStatusCommandHandler;
  let repository: DeliveryRepository;
  let eventBus: EventBus;

  beforeEach(() => {
    repository = mock<DeliveryRepository>();
    eventBus = mock<EventBus>();
    handler = new UpdateDeliveryStatusCommandHandler(repository, eventBus);
  });

  it('should update delivery status', async () => {
    const delivery = DeliveryMother.create();
    const command = new UpdateDeliveryStatusCommand(
      delivery.id.value,
      'shipped',
      new Date()
    );
    
    repository.search.mockResolvedValue(delivery);
    repository.save.mockResolvedValue();
    eventBus.publish.mockResolvedValue();
    
    await handler.handle(command);
    
    expect(delivery.status.value).toBe('shipped');
    expect(repository.save).toHaveBeenCalledWith(delivery);
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
```

### 2. Integration Tests

#### Feature Test

```gherkin
Feature: Delivery Webhook Updates
  As a logistics provider
  I want to update delivery status via webhook
  So that I can provide real-time updates

  Scenario: Successful webhook update
    Given a delivery exists with providerTrackingId "TRACK-123" and status "pending"
    When a webhook is sent with providerTrackingId "TRACK-123" and status "shipped"
    Then the response of webhook status code should be 202
    And the delivery status should be "shipped"

  Scenario: Webhook with non-existent delivery
    Given no delivery exists with providerTrackingId "NO-EXIST"
    When a webhook is sent with providerTrackingId "NO-EXIST" and status "shipped"
    Then the response of webhook status code should be 404
```

## Design Patterns Used

### 1. Command Query Responsibility Segregation (CQRS)

- **Queries**: For read operations (`FindDeliveryByProviderTrackingIdQuery`)
- **Commands**: For write operations (`UpdateDeliveryStatusCommand`)

### 2. Domain-Driven Design (DDD)

- **Value Objects**: `DeliveryId`, `DeliveryStatus`, `ProviderTrackingId`
- **Aggregate Root**: `Delivery`
- **Domain Events**: `DeliveryStatusUpdatedDomainEvent`
- **Repository Pattern**: `DeliveryRepository`

### 3. Hexagonal Architecture

- **Ports**: Interfaces that define contracts
- **Adapters**: Concrete implementations
- **Application Services**: Use case orchestration

## Error Handling

### Error Types

```typescript
// DeliveryNotFoundError.ts
export class DeliveryNotFoundError extends Error {
  constructor(deliveryId: string) {
    super(`Delivery with id ${deliveryId} not found`);
    this.name = 'DeliveryNotFoundError';
  }
}

// InvalidDeliveryStatusError.ts
export class InvalidDeliveryStatusError extends Error {
  constructor(status: string) {
    super(`Invalid delivery status: ${status}`);
    this.name = 'InvalidDeliveryStatusError';
  }
}
```

### Response Strategy

```typescript
// Error handling in controller
try {
  // Webhook logic
} catch (error) {
  if (error instanceof DeliveryNotFoundError) {
    res.status(404).json({ error: error.message });
  } else if (error instanceof InvalidDeliveryStatusError) {
    res.status(400).json({ error: error.message });
  } else {
    logger.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Logging and Monitoring

### Log Configuration

```typescript
// WinstonLogger.ts
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'webhook.log' })
  ]
});
```

### Key Metrics

```typescript
// Metrics to implement
const metrics = {
  webhookRequests: 0,
  webhookSuccess: 0,
  webhookErrors: 0,
  averageResponseTime: 0
};
```

## Performance and Scalability

### Implemented Optimizations

1. **MongoDB Indexes**: For searches by `providerTrackingId`
2. **Connection Pooling**: For MongoDB connections
3. **Async/Await**: For non-blocking operations
4. **Error Boundaries**: For robust error handling

### Scalability Considerations

1. **Load Balancing**: Multiple service instances
2. **Database Sharding**: By provider or region
3. **Caching**: Redis for frequent queries
4. **Message Queues**: For asynchronous processing

## Security

### Implemented Validations

```typescript
// Input validation
const validateWebhookData = (data: any) => {
  if (!data.providerTrackingId || typeof data.providerTrackingId !== 'string') {
    throw new Error('Invalid providerTrackingId');
  }
  
  if (!data.status || !VALID_STATUSES.includes(data.status)) {
    throw new Error('Invalid status');
  }
  
  if (!data.date || isNaN(Date.parse(data.date))) {
    throw new Error('Invalid date format');
  }
};
```

### Security Recommendations

1. **Rate Limiting**: Per IP and provider
2. **API Keys**: Authentication per provider
3. **HMAC Signatures**: Integrity verification
4. **Input Sanitization**: Input data cleaning
5. **HTTPS**: Encrypted communication

## Deployment

### Docker Configuration

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

```bash
# .env
PORT=3000
MONGODB_URL=mongodb://localhost:27017/logistics
LOG_LEVEL=info
NODE_ENV=production
```

## Troubleshooting

### Debugging Checklist

- [ ] Verify MongoDB connectivity
- [ ] Check application logs
- [ ] Validate input data format
- [ ] Confirm delivery exists
- [ ] Verify database permissions

### Debug Commands

```bash
# View real-time logs
tail -f logs/webhook.log

# Test MongoDB connectivity
mongo mongodb://localhost:27017/logistics

# Check service status
curl -X GET http://localhost:3000/health
```

## Technical Roadmap

### Phase 1: Immediate Improvements
- [ ] Implement rate limiting
- [ ] Add API Key authentication
- [ ] Improve structured logging

### Phase 2: Scalability
- [ ] Implement Redis caching
- [ ] Add Prometheus metrics
- [ ] Configure automatic alerts

### Phase 3: Advanced Features
- [ ] Webhook retry mechanism
- [ ] Push notifications
- [ ] Monitoring dashboard 