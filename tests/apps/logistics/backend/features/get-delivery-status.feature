Feature: Get delivery status
  In order to know the current status of a delivery
  As a user
  I want to get the latest known status from the database

  Scenario: Get status of an existing delivery
    Given a delivery exists with id "0197f423-64bf-750c-890f-460c41d46129" and status "shipped" and lastStatusUpdate "2024-06-01T12:00:00.000Z"
    When I send a GET request to "/deliveries/0197f423-64bf-750c-890f-460c41d46129/status"
    Then the response status code should be 200
    And the response should be:
    """
    {
      "status": "shipped",
      "lastStatusUpdate": "2024-06-01T12:00:00.000Z"
    }
    """

  Scenario: Get status of a non-existing delivery
    When I send a GET request to "/deliveries/0197f423-64bf-751c-890f-460c41d46129/status"
    Then the response status code should be 404
    And the response should contain error 
