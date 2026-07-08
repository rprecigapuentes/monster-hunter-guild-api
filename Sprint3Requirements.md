# Sprint 3 Requirements

## Software Architecture and Maintainability

**Duration:** 6 Days

**Team Size:** 4 Developers

---

# Sprint Goal

The goal of Sprint 3 is to transform the application from a functional system into a maintainable and extensible software product.

The emphasis of this sprint is software engineering rather than implementing large amounts of new functionality.

The existing codebase should evolve by applying object-oriented design principles, design patterns, robust exception handling, and improved architecture.

---

# Learning Objectives

By the end of this sprint, the application should demonstrate:

* Proper application of the four Object-Oriented Programming pillars.
* Practical use of SOLID principles.
* Appropriate implementation of software design patterns.
* Centralized exception handling.
* Improved maintainability.
* Better testability.
* Cleaner project structure.

---

# Functional Requirements

## 1. Audit History

The system must keep track of important operations.

Every significant business action must generate an audit record.

Examples:

* Entity created
* Entity updated
* Entity deleted
* Business operation completed
* Assignment completed
* Quest completed

Audit information must contain:

| Field       | Description                       |
| ----------- | --------------------------------- |
| id          | Unique identifier                 |
| operation   | Operation performed               |
| entity      | Entity affected                   |
| timestamp   | Date and time                     |

The audit log is read-only.

---

## 2. Global Search Endpoint

Create a search endpoint capable of searching across multiple entities.

Example:

GET /search?q=dragon

Possible results:

* Hunters
* Monsters
* Quests
* Guilds

---

## 3. Statistics Dashboard

Create endpoints that expose aggregated information.

Examples:

* Total entities
* Average rewards
* Completed quests
* Hunter leaderboard based on rank

Business calculations should not be implemented inside controllers.

---

# Technical Requirements

## 1. Centralized Exception Handling

The application must implement a global error handling mechanism.

All errors should inherit from a common base exception.

Example hierarchy:

ApplicationError

├── ValidationError

├── NotFoundError

├── ConflictError

├── BusinessRuleError

└── UnauthorizedOperationError

Controllers should not contain repetitive try/catch blocks.

---

## 2. Design Patterns

The project must implement **at least three** design patterns.

Possible patterns include:

### Factory

Used for creating domain objects.

Examples:

* HunterFactory

---

### Strategy

Used for interchangeable business algorithms.

Examples:

* Reward calculation
* Reputation calculation
* Ranking algorithm

The application should allow new algorithms to be added without modifying existing code.

---

### Observer

Used to notify the system when important business events occur.

Examples:

* Quest completed

Observers may generate:

* Audit records
* Notifications
* Statistics updates

---

### Builder (Optional)

Useful when creating complex objects.

---

### Singleton (Infrastructure Only)

May be used for configuration or logging.

Business objects must not be implemented as singletons.

---

## 3. SOLID Principles

The team must demonstrate practical use of at least three SOLID principles.

During the final presentation they should explain:

* Which principles were applied.
* Where they were applied.
* Why they improved the design.

---

## 4. OOP Pillars

The codebase must clearly demonstrate:

### Encapsulation

Business rules hidden behind public methods.

---

### Abstraction

Interfaces define contracts for repositories and services.

---

### Inheritance

Use inheritance only where it represents a true "is-a" relationship.

Avoid inheritance solely for code reuse.

---

### Polymorphism

Business services should work with abstractions rather than concrete implementations whenever appropriate.

---

## 5. Dependency Inversion

High-level modules must depend on abstractions.

Repository implementations should be interchangeable.

Example:

HunterService

↓

HunterRepository Interface

↓

PrismaHunterRepository

Future implementations should require minimal code changes.

---

# Refactoring

In case team identifies areas of technical debt introduced during previous sprints, refactoring can be applied.

Examples:

* Duplicate code
* Large controllers
* Long methods
* Poor naming
* Tight coupling

Each improvement must be documented.

---

# Testing Requirements

Unit tests must include:

* Successful scenarios.
* Validation failures.
* Business rule violations.
* Exception handling.
* Strategy implementations.
* Factory creation.
* Observer notifications.

Coverage target:

Minimum **85%**

Bonus:

**90%+**

---

# Documentation

Update the README with:

* Architecture overview
* Folder structure
* Design patterns used
* SOLID principles applied
* Testing instructions
* Known limitations

---

# Final Presentation

Each team will present:

## Architecture

* Overall project structure.
* Layer responsibilities.

---

## OOP

Demonstrate examples of:

* Encapsulation
* Abstraction
* Inheritance
* Polymorphism

---

## SOLID

Explain at least three principles with concrete examples.

---

## Design Patterns

Demonstrate:

* Which patterns were implemented.
* Why they were selected.
* Benefits obtained.

---

## Testing

Present:

* Coverage report
* Example unit tests
* Mocking strategy

---

# Deliverables

The final submission must include:

* Complete source code.
* Passing CI pipeline.
* Updated documentation.
* Unit tests.
* Coverage report.
* Architecture diagram.

---

# Definition of Done

The sprint is complete when:

* All functional requirements are implemented.
* The code follows agreed coding standards.
* Design patterns are correctly applied.
* Centralized exception handling is implemented.
* Unit tests pass.
* Coverage target is reached.
* Documentation is updated.
* The team successfully demonstrates the architectural decisions during the final presentation.
