# Webhook API for Deliveries

## General Description

The webhook API allows receiving asynchronous status updates for deliveries from external providers. This functionality complements the existing polling system, providing real-time updates.

## Endpoint

### POST /deliveries/webhook

Updates the status of a delivery based on the provider's tracking ID.

#### Input Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `providerTrackingId` | string | Yes | Unique provider tracking ID |
| `status` | string | Yes | New delivery status |
| `date` | string | Yes | Update date (ISO 8601 format) |

#### Valid Statuses

- `pending` - Pending shipment
- `shipped` - Shipped
- `delivered` - Delivered
- `failed` - Failed
- `returned` - Returned

#### Request Example

```json
{
  "providerTrackingId": "TRACK-123",
  "status": "shipped",
  "date": "2024-01-15T10:30:00Z"
}
```

#### Responses

##### 202 - Successful Update

```json
{
  "message": "Delivery status updated successfully",
  "deliveryId": "uuid-delivery-id",
  "providerTrackingId": "TRACK-123",
  "newStatus": "shipped"
}
```

##### 404 - Delivery Not Found

```json
{
  "error": "Delivery not found",
  "providerTrackingId": "NO-EXIST"
}
```

##### 422 - Invalid Data

```json
{
  "error": "Invalid request data",
  "details": "Status must be one of: pending, shipped, delivered, failed, returned"
}
```

## Processing Flow

1. **Webhook Reception**: Controller receives POST request
2. **Validation**: Required fields and data format are validated
3. **Delivery Search**: Delivery is searched by `providerTrackingId`
4. **Update**: If found, status is updated and domain event is triggered
5. **Response**: Appropriate status code is returned

## System Integration

### Architecture

The webhook integrates with the existing hexagonal architecture:

- **Controller**: `DeliveryWebhookPostController` handles HTTP requests
- **Query**: `FindDeliveryByProviderTrackingIdQuery` searches for delivery
- **Command**: `UpdateDeliveryStatusCommand` updates status
- **Repository**: `MongoDeliveryRepository` persists changes

### Domain Events

When status is updated via webhook, the `DeliveryStatusUpdatedDomainEvent` is triggered which can be consumed by other services.

## Security

### Authentication

Currently the endpoint doesn't require authentication, but it's recommended to implement:

- API Keys per provider
- HMAC signatures to verify authenticity
- Rate limiting per IP/provider

### Validation

- ISO 8601 date format validation
- Allowed status validation
- Input sanitization

## Testing

### Unit Tests

- `FindDeliveryByProviderTrackingIdQueryHandler.test.ts`
- `UpdateDeliveryStatusCommandHandler.test.ts`

### Integration Tests

- `deliveries.webhook.feature` - Cucumber tests
- Covered scenarios:
  - Successful update
  - Delivery not found
  - Data validation

## Monitoring

### Logs

The system logs:
- Webhook reception
- Validation errors
- Successful updates
- Database errors

### Recommended Metrics

- Webhook success rate
- Response time
- Errors per provider
- Webhook volume per hour

## Configuration

### Environment Variables

```bash
# Server port
PORT=3000

# MongoDB configuration
MONGODB_URL=mongodb://localhost:27017/logistics

# Logging
LOG_LEVEL=info
```

## Usage Examples

### cURL

```bash
curl -X POST http://localhost:3000/deliveries/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "providerTrackingId": "TRACK-123",
    "status": "shipped",
    "date": "2024-01-15T10:30:00Z"
  }'
```

### JavaScript

```javascript
const response = await fetch('http://localhost:3000/deliveries/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    providerTrackingId: 'TRACK-123',
    status: 'shipped',
    date: new Date().toISOString()
  })
});

const result = await response.json();
```

## Troubleshooting

### Common Issues

1. **404 - Delivery not found**
   - Verify that `providerTrackingId` exists
   - Confirm that delivery was created previously

2. **400 - Invalid data**
   - Verify ISO 8601 date format
   - Confirm that status is valid

3. **500 - Internal error**
   - Check server logs
   - Verify MongoDB connectivity

### Debugging

Enable detailed logs:

```bash
LOG_LEVEL=debug npm start
```

## Roadmap

### Future Improvements

- [ ] API Key authentication
- [ ] HMAC signatures for security
- [ ] Rate limiting
- [ ] Webhook retry mechanism
- [ ] Push notifications for critical updates
- [ ] Webhook monitoring dashboard 
