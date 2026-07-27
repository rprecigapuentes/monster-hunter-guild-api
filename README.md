# Monster Hunter Guild API

## Overview

The project manages the core operations of a fictional Monster Hunter Guild organization. It includes hunters, monsters, guilds, quests, quest assignments, audit history, global search, and statistics modules. The architecture emphasizes maintainability, extensibility, and testability by applying object-oriented programming principles, SOLID principles, dependency injection, and design patterns.

---

## Wiki

The complete project documentation is available in the Monster Hunter Guild Wiki, including:

- Business rules
- API endpoint reference
- Additional technical documentation

Access the wiki here:

**https://gitlab.com/jalau-bootcamps/bc-lt-at-fs-05/monster-hunter-guild/-/wikis/Monster-Hunter-Guild-API-Documentation**

---

## Wiki

The complete project documentation is available in the Monster Hunter Guild Wiki, including:

- Business rules
- API endpoint reference
- Additional technical documentation

Access the wiki here:

**https://gitlab.com/jalau-bootcamps/bc-lt-at-fs-05/monster-hunter-guild/-/wikis/Monster-Hunter-Guild-API-Documentation**

---

# Tech Stack

- TypeScript
- Node.js
- Express
- Prisma ORM
- MySQL
- Jest

---

# Getting Started

## Prerequisites

- Node.js 20+
- MySQL
- npm

## Installation

```bash
git clone https://gitlab.com/josecarlosgvr/monster-hunter-guild.git
cd monster-hunter-guild
npm install
```

## Configure Environment

Create a `.env` file with your database connection string.

## Prisma Commands

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Start the application

```bash
npm run dev
```

Build

```bash
npm run build
npm start
```

---

# Project Abstractions

---

## Repository layer

---

### ICountable

- The ICountable interface defines a common contract for repositories that can return the total number of stored records.

### IBasicRepository

- IBasicRepository defines the common CRUD operations shared by every repository.

### PrismaModelDelegate

- This interface abstracts the Prisma client.

- Instead of coupling the base repository directly to Prisma's generated delegates, it only requires the operations that are actually used.

### PrismaBaseRepository

- PrismaBaseRepository is an abstract class that provides the implementation for all generic CRUD operations defined in IBasicRepository.
- It implements:

  create()
  update()
  delete()
  findById()
  findAll()
  count()

- using the injected Prisma delegate.
- Instead of implementing these methods repeatedly for every entity, repositories simply inherit from this class.

### Specialized Repositories

Some entities require queries that are specific to their business logic.

These repositories extend IBasicRepository and define only the additional methods they need. (IHuunterRepository, IQuestRepository)

---

## Service Layer

---

### BaseService

- BaseService provides the common implementation shared by every service.

- It implements:

  create()
  update()
  delete()
  findById()
  findAll()
  exists()

- using an injected repository.

### IExistenceChecker

- Some services expose only the capability of verifying whether an entity exists.

### Entity Statistics

- Some services expose aggregated information instead of CRUD operations.

- For these cases, the project defines the IEntityStatistics contract.

### BaseStatisticsService

- BaseStatisticsService provides a generic mechanism for registering and exposing statistics.

- Each statistic is associated with a function stored in a map.

### State Abstractions

- Some services use the State pattern to model entity lifecycles.

- Each state implements the same contract

### Strategy Abstractions

- Some business rules may evolve over time or require multiple implementations. Instead of hardcoding these algorithms into services, the project uses the Strategy Pattern to encapsulate interchangeable behaviors behind interfaces.

---

## Controller Layer

---

### BaseService

- BaseController provides the common implementation for the standard REST endpoints shared by all entities.

- Each controller receives its corresponding service through dependency injection.

---

# Core Features

## CRUD Operations

Complete CRUD support for:

- Hunters
- Monsters
- Guilds
- Quests

## Quest Assignment

Hunters can participate in multiple quests through the QuestAssignment entity.
Business rules ensure:

- Hunters and quests exist before assignment.
- A hunter cannot be assigned twice to the same quest.
- Each quest has exactly one Leader.
- A quest must have at least one assigned hunter before it can start (A leader at least).

## Quest Lifecycle Management

Quests follow a controlled lifecycle:

- Pending
- In Progress
- Completed
- Failed
  Invalid state transitions are prevented through business validation.

## Reward Distribution

- When a quest is completed, rewards are automatically distributed among participating hunters.
- The leader receives 40% of the reward.
- The remaining reward is divided equally among the other participants.
- Rewards are converted into hunter experience points.

## Automatic Rank Progression

- Hunter ranks are calculated automatically based on accumulated experience.
- Rank updates occur whenever experience changes.
- Rank values cannot be modified directly through the API.

## Audit History

Every important business operation generates an audit record.

Tracked operations include:

- Entity Created
- Entity Updated
- Entity Deleted
- Quest Completed
- Assignment Completed

## Global Search

Searches across:

- Hunters
- Monsters
- Guilds
- Quests

## Statistics Dashboard

Provides:

- Total entities
- Average quest reward
- Completed quests
- Hunter leaderboard

---

# Design Patterns

## State Pattern

Manages the Quest lifecycle.

- Pending
- In Progress
- Completed
- Failed

Each state encapsulates transitions and validations.

## Factory Pattern

QuestStateFactory creates the appropriate state object.

## Strategy Pattern

RewardDistributionStrategy allows reward algorithms to be replaced without modifying the service.

## Observer Pattern

Business events are published through EventManager.

Observers generate audit records while remaining decoupled from business services.

---

# Object-Oriented Programming

## Encapsulation

Business rules are hidden inside services.

## Abstraction

Interfaces define repository and service contracts.

## Inheritance

Implemented through BaseService and BaseRepository.

## Polymorphism

Services depend on abstractions rather than concrete implementations.

---

# SOLID Principles

## Single Responsibility Principle

Each layer and classes have one responsibility.

## Open/Closed Principle

New quest states and reward strategies can be added without modifying existing code.

## Liskov Substitution Principle

Concrete repositories and services can replace their abstractions.

## Interface Segregation Principle

Specialized repositories expose only methods relevant to their entity.

## Dependency Inversion Principle

High-level modules depend on interfaces.

Dependency injection is configured centrally.

---

# Exception Handling

A global middleware handles application exceptions.

Benefits:

- No repetitive try/catch blocks
- Consistent API responses
- Cleaner controllers

---

# Unit Testing

Run all tests

```bash
npm test
```

Tests cover:

- CRUD operations
- Validation failures
- Business rules
- Exception handling
- State transitions
- Strategy implementations
- Observer notifications

---

# Known Limitations

- Statistics expose predefined metrics only.
- Search supports only implemented entities.
- Folder organization is getting bigger and could be changed.
