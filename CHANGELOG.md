# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete webhook system documentation
- Technical guide for developers
- Architecture diagrams with Mermaid
- Updated README with project information

## [1.2.0] - 2024-01-15

### Added
- **Webhook System**: Complete implementation of webhooks for asynchronous status updates
- **POST `/deliveries/webhook` endpoint**: To receive provider updates
- **`FindDeliveryByProviderTrackingIdQuery`**: To search deliveries by provider tracking ID
- **`UpdateDeliveryStatusCommand`**: To update delivery status
- **Integration tests**: Cucumber feature tests for webhooks
- **Unit tests**: For query and command handlers
- **Robust validation**: Of input data in webhooks
- **Error handling**: Appropriate HTTP responses (202, 404, 400, 500)
- **Domain events**: `DeliveryStatusUpdatedDomainEvent` triggered on updates
- **Structured logging**: For webhook monitoring
- **DI configuration**: Registration of all handlers and services

### Changed
- **Polling refactoring**: Exclusive use of container to obtain commands
- **Test improvements**: Use of existing mothers and container in integration tests
- **Import optimization**: Correction of imports in tests

### Technical Details
- **Architecture**: Implementation following CQRS and DDD
- **Patterns**: Command Bus, Query Bus, Repository Pattern
- **Testing**: Unit tests with mocks and real integration tests
- **Performance**: Efficient searches by `providerTrackingId`
- **Security**: Input validation and data sanitization

## [1.1.0] - 2024-01-10

### Added
- **Polling System**: Automatic service for status updates
- **Orchestrator**: Coordination of queries and commands
- **Provider integration**: Dummy and NRW providers
- **Integration tests**: Real tests with MongoDB and providers
- **DI configuration**: Container configured for all services
- **Logging**: Winston logger for monitoring
- **Error handling**: Retry mechanism and error handling

### Changed
- **Refactoring**: Use of QueryBus and CommandBus
- **Decoupling**: Separation of responsibilities
- **Simplification**: Runner simplified using container

### Technical Details
- **Architecture**: CQRS fully implemented
- **Testing**: Tests without mocks for real integration
- **Performance**: Efficient polling with configurable intervals
- **Monitoring**: Detailed operation logs

## [1.0.0] - 2024-01-05

### Added
- **Base architecture**: Hexagonal with DDD
- **Logistics Context**: Delivery management
- **Course Context**: MOOC course management
- **Backoffice Context**: Administration
- **Delivery system**: Creation and delivery management
- **Provider integration**: Logistics provider APIs
- **Value Objects**: DeliveryId, DeliveryStatus, ProviderTrackingId
- **Aggregate Root**: Delivery with domain events
- **Repository Pattern**: MongoDB implementation
- **Command Bus**: For write operations
- **Query Bus**: For read operations
- **Event Bus**: For domain events
- **Dependency Injection**: Configured container
- **Unit tests**: Complete domain coverage
- **Integration tests**: Cucumber features
- **Documentation**: README and technical guides

### Technical Details
- **Language**: TypeScript with Node.js
- **Database**: MongoDB with Mongoose
- **Testing**: Jest + Cucumber
- **Architecture**: Hexagonal + DDD + CQRS
- **Patterns**: Repository, Command, Query, Event Bus
- **Logging**: Winston
- **Validation**: Value Objects with validation

## [0.1.0] - 2024-01-01

### Added
- **Initial project structure**
- **Basic configuration**: TypeScript, Jest, ESLint
- **Base architecture**: Folder structure
- **Dependencies**: Configured package.json
- **Docker**: Dockerfile and docker-compose
- **CI/CD**: Basic GitHub Actions

---

## Versioning Conventions

- **MAJOR**: Incompatible changes with previous versions
- **MINOR**: Compatible new features
- **PATCH**: Compatible bug fixes

## Change Types

- **Added**: New features
- **Changed**: Changes to existing features
- **Deprecated**: Features that will be removed
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

## Contributing

To contribute to the changelog:

1. Add entries under the `[Unreleased]` section
2. Use appropriate change types
3. Include relevant technical details
4. Maintain consistent format
5. Move entries from `[Unreleased]` to corresponding version when releasing

## References

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Conventional Commits](https://www.conventionalcommits.org/) 