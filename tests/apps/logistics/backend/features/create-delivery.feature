Feature: Create a new delivery
  In order to have deliveries in the platform
  As a user with admin permissions
  I want to create a new delivery

  Scenario: A valid non existing delivery
    Given I send a POST request to "/deliveries" with body:
    """
    {
      "orderId": "0197f372-121f-701c-aaee-9a48d114f0ec",
      "provider": "NRW",
      "status": "pending"
    }
    """
    Then the response status code should be 201
    And the response should contain id and labelUrl

  Scenario: An invalid non existing delivery
    Given I send a POST request to "/deliveries" with body:
    """
    {
      "orderId": "0197f372-121f-701c-aaee-9a48d114f0ec",
      "provider": "INVALID_PROVIDER",
      "status": "INVALID_STATUS",
      "lastStatusUpdate": "2024-01-01T00:00:00.000Z"
    }
    """
    Then the response status code should be 422

  Scenario: Missing required fields
    Given I send a POST request to "/deliveries" with body:
    """
    {
      "id": "ef8ac118-8d7f-49cc-abec-78e0d05af80a"
    }
    """
    Then the response status code should be 422 
