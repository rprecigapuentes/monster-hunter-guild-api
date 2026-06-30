# Sprint 2 Requirements

## Monster Hunter Guild API

### Sprint 2 – Business Rules, Testing and Maintainability

**Duration:** 6 days

**Team Size:** 4 developers

---

# Sprint Goal

The objective of Sprint 2 is to improve the maintainability, quality, and business capabilities of the system.

The team must evolve the existing API by introducing:

* Object-Oriented Design
* Service Layer Business Logic
* Unit Testing
* Code Quality Practices
* New Domain Features

The focus of this sprint is not only delivering functionality but also improving the internal quality of the software.

---

# New Functional Requirements

## 1. Hunter Assignments

Hunters can now participate in quests.

A hunter may participate in multiple quests.

A quest may contain multiple hunters.

### New Entity: QuestAssignment

| Field    | Type   |
| -------- | ------ |
| id       | UUID   |
| hunterId | UUID   |
| questId  | UUID   |
| role     | string |

Allowed roles:

* Leader
* Support
* Scout

Rules:

* Hunter must exist.
* Quest must exist.
* A hunter cannot be assigned twice to the same quest.
* Every quest must have exactly one Leader.
* A quest must contain at least one hunter before it can be started.

---

## 2. Quest Status Workflow

Quest status now follows a lifecycle.

Allowed values:

* Pending
* In Progress
* Completed
* Failed

Rules:

* New quests start as Pending.
* Pending → In Progress
* In Progress → Completed
* In Progress → Failed

Invalid transitions must return an error.

Example:

Completed → Pending is not allowed.

---

## 3. Reward Distribution

When a quest is completed, rewards must be distributed among participating hunters.

Rules:

* The Leader receives 40% of the reward.
* Remaining reward is equally distributed among the other hunters.
* Rewards increase hunter experience points.
* Experience gained equals the reward received.

---

## 4. Hunter Rank Progression

Hunter ranks are now calculated automatically.

| Rank | Required Experience |
| ---- | ------------------- |
| 1    | 0                   |
| 2    | 500                 |
| 3    | 1000                |
| 4    | 2000                |
| 5    | 4000                |

Rules:

* Rank cannot be modified directly through the API.
* Rank must be recalculated whenever experience changes.

---

# Technical Requirements

## Object-Oriented Design

The application must include:

* Classes for business services.
* Domain models or entities.
* Encapsulation of business rules.
* Proper separation of responsibilities.

Recommended layers:

* Controllers
* Services
* Repositories
* Models or Entities

Business rules must not be implemented inside controllers.

---

## Dependency Injection

Services should receive their dependencies through constructors.

Example:

* QuestService receives QuestRepository.
* HunterService receives HunterRepository.

This will improve testability and maintainability.

---

## Custom Errors

Create application-specific errors.

Examples:

* HunterNotFoundError
* QuestAlreadyStartedError
* InvalidQuestTransitionError

Controllers must return appropriate HTTP status codes.

---

# Testing Requirements

## Unit Tests

The following components must have unit tests:

* HunterService
* QuestService
* Reward calculation logic
* Rank calculation logic
* Quest status transitions

External dependencies should be mocked.

---

## Coverage Goal

Minimum coverage:

**80%**

Bonus objective:

**90%**

---

## Required Test Cases

Examples:

### Quest Status

* Pending → In Progress succeeds.
* In Progress → Completed succeeds.
* Completed → Pending fails.

### Reward Distribution

* Leader receives 40%.
* Remaining reward is shared equally.
* Experience is updated.

### Rank Progression

* Experience increase changes rank.
* Rank cannot decrease.

### Assignments

* Duplicate assignment fails.
* Multiple hunters can join a quest.
* Only one Leader is allowed.

---

# Code Quality Requirements

The project must include:

* ESLint
* Prettier
* Consistent naming conventions
* Small methods and functions
* No duplicated code

Large controller methods should be refactored into services.

---

# Team Responsibilities

Suggested distribution:

### Developer 1

Quest assignments and APIs.

### Developer 2

Quest workflow and state transitions.

### Developer 3

Reward and rank calculations.

### Developer 4

Testing infrastructure, coverage, and code quality improvements.

All developers must participate in code reviews.

---

# Deliverables

The team must provide:

* Updated REST API.
* Automated unit tests.
* Coverage report.
* Updated README.
* API examples.
* Architecture diagram.

---

# Bonus Challenges

Optional features:

* Hunter statistics endpoint.
* Guild ranking endpoint.
* Quest completion history.
* Top hunters leaderboard.

---

# Definition of Done

A requirement is considered complete when:

* Code is implemented.
* Unit tests pass.
* Coverage target is reached.
* Code review is completed.
* CI pipeline succeeds.
* Documentation is updated.
