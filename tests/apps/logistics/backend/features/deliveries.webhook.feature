Feature: Delivery status webhook

  Scenario: Update delivery status via webhook
    Given a delivery exists with providerTrackingId "TRACK-123" and status "pending"
    When a webhook is sent with providerTrackingId "TRACK-123" and status "shipped"
    Then the response of webhook status code should be 202
    And the delivery status should be "shipped"

  Scenario: Webhook with non-existent delivery
    Given no delivery exists with providerTrackingId "NO-EXIST"
    When a webhook is sent with providerTrackingId "NO-EXIST" and status "shipped"
    Then the response of webhook status code should be 404
