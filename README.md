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
