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
