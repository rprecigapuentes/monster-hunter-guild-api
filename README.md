# Monster Hunter Guild API

## Overview

The world is plagued by dangerous monsters that threaten villages, cities, and trade routes.

The Monster Hunter Guild is responsible for coordinating hunters, managing quests, tracking monster sightings, and distributing rewards.

Your team has been hired to develop the backend platform that powers the Guild's operations.

The system will evolve over multiple iterations, requiring the team to design a flexible and maintainable architecture capable of supporting new business requirements.

---

# Sprint 1 Scope

Implement CRUD operations for the following entities:

* Hunters
* Monsters
* Quests
* Guilds

---

# Domain Model

## Hunter

| Field            | Type   |
| ---------------- | ------ |
| id               | UUID   |
| name             | string |
| rank             | number |
| experiencePoints | number |
| guildId          | UUID   |

Rules:

* Name required
* Rank >= 1
* Experience >= 0

---

## Monster

| Field       | Type   |
| ----------- | ------ |
| id          | UUID   |
| name        | string |
| species     | string |
| dangerLevel | number |
| rewardValue | number |

Rules:

* Name required
* Danger Level between 1 and 10
* Reward Value >= 0

---

## Quest

| Field     | Type   |
| --------- | ------ |
| id        | UUID   |
| title     | string |
| monsterId | UUID   |
| location  | string |
| reward    | number |
| status    | string |

Rules:

* Monster must exist
* Reward >= 0
* Title required

---

## Guild

| Field        | Type   |
| ------------ | ------ |
| id           | UUID   |
| name         | string |
| region       | string |
| headquarters | string |

Rules:

* Name required

---

# API Requirements

CRUD endpoints for all entities.

Example:

GET /hunters

GET /hunters/{id}

POST /hunters

PUT /hunters/{id}

DELETE /hunters/{id}

---

# Testing Requirements

Minimum:

* Unit Tests
* Validation Tests
* Service Tests

Coverage Target:

80%

---

## Continuous Integration

Every Pull Request must execute:

* Dependency installation
* Linting
* Tests
* Build validation

The Pull Request must not be merged if the pipeline fails.

---

# Future Iterations

Future requirements may include:

* Hunter assignments
* Equipment
* Quest completion
* Reward calculations
* Guild rankings
* Monster weaknesses
* Hunter progression
