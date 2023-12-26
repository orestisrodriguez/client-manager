Feature: Create version

  Scenario: Success
    Given I have started the server
    And I have a client "client 1" connected to the server
    And "client 1" subscribes to "updateVersion" events
    When I create the following version
      | name | 1.0.1 |
    Then I receive the following "updateVersion" event for "client 1"
      | name | 1.0.1 |
