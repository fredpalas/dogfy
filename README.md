# Dogfy - Logistics System

Logistics delivery management system with hexagonal architecture, implementing CQRS and DDD. Includes polling and webhook functionalities for delivery status updates.

## 🚀 Main Features

### Delivery System
- **Complete delivery management** with dynamic states
- **Multiple provider integration** (Dummy, NRW, TLS)
- **Automatic polling system** for status updates
- **Real-time webhooks** for asynchronous updates
- **Hexagonal architecture** with clear separation of responsibilities

### Architecture
- **Domain-Driven Design (DDD)** with aggregates and value objects
- **Command Query Responsibility Segregation (CQRS)** for read/write separation
- **Event-Driven Architecture** with domain events
- **Dependency Injection** with configured container
- **Repository Pattern** for persistence abstraction

## 📋 Requirements

- Node.js 18+
- MongoDB 5+
- Docker (optional)

## 🛠️ Installation

### Local Development

```bash
# Clone repository
git clone <repository-url>
cd dogfy

# Install dependencies
npm install

# Start MongoDB
docker-compose up -d mongodb

# Run tests
npm test

# Start application
npm dev:logistic:backend

# Pulling Status from providers
npm dev:command:logistics:poll:deliveries
```

### Docker

```bash
# Build and start all services MongoDB and Node.js
docker-compose up -d

# View logs
docker-compose logs -f
```
 
`http://localhost:3000` will be the base URL for the application inside of docker


## 🏗️ Project Structure

```
src/
├── apps/
│   └── logistics/          # Logistics application
│       ├── backend/       # REST API
│       └── controllers/   # HTTP controllers
├── Contexts/
│   ├── Logistics/        # Logistics context
│   │   ├── Deliveries/   # Delivery aggregate
│   │   └── ProviderApi/  # Provider APIs
│   └── Shared/          # Shared components
└── tests/               # Integration and unit tests
```

## 🔧 Configuration

### Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URL=mongodb://localhost:27017/logistics

# Logging
LOG_LEVEL=info

# Providers
DUMMY_PROVIDER_URL=http://localhost:3001
NRW_PROVIDER_URL=http://localhost:3002
```

## 📡 Available APIs

### Deliveries

#### Create Delivery
```bash
POST /deliveries
Content-Type: application/json

{ 
  "orderId": "0197f372-121f-701c-aaee-9a48d114f0ec",
  "provider": "NRW",
  "status": "pending"
}
```

#### Get Delivery Status
```bash
GET /deliveries/{id}/status
```

#### Webhook Update
```bash
POST /deliveries/webhook
Content-Type: application/json

{
  "providerTrackingId": "TRACK-123",
  "status": "shipped",
  "date": "2024-01-15T10:30:00Z"
}
```

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
npm run test:unit

# Specific tests
npm run test:unit -- --grep "Delivery"
```

### Integration Tests 
run with Unit Tests

### E2E Tests
```bash
# End-to-end tests
npm run test:features
```

## 🔄 Polling System

The system includes an automatic polling service that:

- Periodically queries providers
- Updates delivery statuses
- Handles errors and retries
- Records detailed logs

### Polling Configuration

```yaml
# application.yaml
polling:
  interval: 300000  # 5 minutes
  retryAttempts: 3
  providers:
    - dummy
    - nrw
```

## 📨 Webhook System

### Features

- **Asynchronous reception** of status updates
- **Robust validation** of input data
- **Efficient search** by `providerTrackingId`
- **Domain events** for integration with other services
- **Complete tests** of integration

### Webhook Flow

1. **Reception**: Controller receives POST request
2. **Validation**: Required fields are validated
3. **Search**: Query searches delivery by tracking ID
4. **Update**: Command updates status
5. **Persistence**: Data is saved to MongoDB
6. **Events**: Domain events are triggered

## 📊 Monitoring

### Logs
- Winston for structured logging
- Different levels (error, warn, info, debug)
- Automatic file rotation

### Metrics
- Webhook success rate
- Average response time
- Errors per provider
- Operation volume

## 🚀 Deployment

### Production

```bash
# Production build
npm run build

# Production environment variables
NODE_ENV=production
MONGODB_URL=mongodb://prod-db:27017/logistics
LOG_LEVEL=warn
```

### Docker Compose

```yaml
services:
  mongo:
    image: mongo:5.0.0
    environment:
      - MONGO_URL=mongodb://mongo:27017/dev
    volumes:
      - ./data/mongo:/data/db:delegated
    ports:
      - 27017:27017
  node:
    image: node:22
    environment:
      - NODE_ENV=development
      - MONGO_URL=mongodb://mongo:27017/dev
      - PORT=3000
    volumes:
      - ./:/app
      - node_modules:/app/node_modules
    ports:
      - 3000:3000
    entrypoint:
      - /bin/sh
      - -c
      - |
        cd /app && \
        npm install && \
        npm run dev:logistic:backend

volumes:
  node_modules:

```

## 🔧 Development

### Useful Commands

```bash
# Linting
npm run lint

# Code formatting
npm run format

# Generate documentation
npm run docs

# Clean build
npm run clean
```

### Commit Structure

```
feat: add webhook for status updates
fix: fix providerTrackingId validation
docs: update API documentation
test: add tests for webhook controller
```

## 📚 Documentation

- [Delivery API](./docs/delivery-api.md) - Complete delivery API documentation
- [Webhook API](./docs/webhook-api.md) - Webhook API documentation
- [Technical Guide](./docs/webhook-technical-guide.md) - Implementation details

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🗺️ Roadmap

### Upcoming Features

- [ ] API Key authentication for webhooks
- [ ] Rate limiting per provider
- [ ] Real-time monitoring dashboard
- [ ] Push notifications for critical statuses
- [ ] Integration with more providers
- [ ] Automatic retry system for failed webhooks

### Technical Improvements

- [ ] Implement Redis caching
- [ ] Add Prometheus metrics
- [ ] Configure automatic alerts
- [ ] Optimize MongoDB queries
- [ ] Implement circuit breakers
