# Delivery API Documentation

## Overview

The Delivery API provides comprehensive functionality for managing logistics deliveries, including creation, status updates, and integration with multiple providers. The API follows REST principles and supports both synchronous and asynchronous operations.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the API doesn't require authentication. For production environments, it's recommended to implement:

- API Key authentication
- JWT tokens
- OAuth 2.0

## Content-Type

All requests should include:
```
Content-Type: application/json
```

## Delivery Endpoints

### Create Delivery

Creates a new delivery with the specified provider and tracking information.

**Endpoint:** `POST /deliveries`

**Request Body:**
```json
{
  "orderId": "0197f372-121f-701c-aaee-9a48d114f0ec",
  "provider": "NRW",
  "status": "pending"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderId` | string | Yes | Unique order identifier (UUID format) |
| `provider` | string | Yes | Provider name (NRW, DUMMY, TLS) |
| `status` | string | Yes | Initial delivery status |

**Valid Providers:**
- `NRW` - NRW Logistics Provider
- `DUMMY` - Dummy Provider for Testing
- `TLS` - TLS Provider

**Valid Statuses:**
- `pending` - Pending shipment
- `shipped` - Shipped
- `delivered` - Delivered
- `failed` - Failed
- `returned` - Returned

**Response - 201 Created:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "orderId": "0197f372-121f-701c-aaee-9a48d114f0ec",
  "providerTrackingId": "TRACK-123456",
  "provider": "NRW",
  "status": "pending",
  "labelUrl": "https://provider.com/labels/TRACK-123456",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Response - 400 Bad Request:**
```json
{
  "error": "Invalid request data",
  "details": "Provider must be one of: NRW, DUMMY, TLS"
}
```

**Response - 422 Unprocessable Entity:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "orderId",
      "message": "Order ID must be a valid UUID"
    }
  ]
}
```

### Get Delivery Status

Retrieves the current status of a delivery by its ID.

**Endpoint:** `GET /deliveries/{id}/status`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Delivery ID (UUID) |

**Response - 200 OK:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "shipped",
  "providerTrackingId": "TRACK-123456",
  "provider": "NRW",
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

**Response - 404 Not Found:**
```json
{
  "error": "Delivery not found",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Get Delivery Details

Retrieves complete delivery information including tracking details.

**Endpoint:** `GET /deliveries/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Delivery ID (UUID) |

**Response - 200 OK:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "orderId": "0197f372-121f-701c-aaee-9a48d114f0ec",
  "providerTrackingId": "TRACK-123456",
  "provider": "NRW",
  "status": "shipped",
  "labelUrl": "https://provider.com/labels/TRACK-123456",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T14:30:00Z",
  "events": [
    {
      "type": "DeliveryCreated",
      "occurredOn": "2024-01-15T10:30:00Z"
    },
    {
      "type": "DeliveryStatusUpdated",
      "occurredOn": "2024-01-15T14:30:00Z",
      "oldStatus": "pending",
      "newStatus": "shipped"
    }
  ]
}
```

**Response - 404 Not Found:**
```json
{
  "error": "Delivery not found",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 202 | Accepted - Request accepted for processing |
| 400 | Bad Request - Invalid request data |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error - Server error |

## Examples

### Create a Delivery

```bash
curl -X POST http://localhost:3000/deliveries \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "0197f372-121f-701c-aaee-9a48d114f0ec",
    "provider": "NRW",
    "status": "pending"
  }'
```

### Get Delivery Status

```bash
curl -X GET http://localhost:3000/deliveries/550e8400-e29b-41d4-a716-446655440000/status
```

