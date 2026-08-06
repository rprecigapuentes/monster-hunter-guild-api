# Monster Hunter Guild API

<img src="https://img.shields.io/badge/Typescript-v6.0.3-blue?logo=typescript&style=plastic" alt="Typescript">
<img src="https://img.shields.io/badge/Node.js-v24.18.0-green?logo=nodedotjs&style=plastic" alt="Node.js">
<img src="https://img.shields.io/badge/Express-v5.2.1-black?logo=express&style=plastic" alt="Express.js">
<img src="https://img.shields.io/badge/PrismaORM-v7.8.0-14354A?logo=prisma&style=plastic" alt="PrismaORM">
<img src="https://img.shields.io/badge/MySQL-v8.4.11-DD8907?&labelColor=006085&logo=mysql&logoColor=fff&style=plastic" alt="MySQL">
<img src="https://img.shields.io/badge/Jest-v30.4.2-934258?logo=jest&style=plastic" alt="Jest">

---

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

# Tech Stack

- TypeScript
- Node.js
- Express
- Prisma ORM
- MySQL
- Jest
- Semantic Release

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

## Run with Docker

Both the API and MySQL run as containers. 

1. Start MySQL:

```bash
docker run -d --name mhg-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=monster_hunter_guild \
  -p 3307:3306 \
  mysql:8.4.11 --lower-case-table-names=1
```

2. Wait until `docker logs mhg-mysql` shows `ready for connections ... port: 3306` (about 20 s on first start).

3. Point `.env` at the host's IP (containers cannot reach MySQL through `localhost`). Get it with `ip a` and use port `3307`:

```bash
DATABASE_URL=mysql://root:root@<host-ip>:3307/monster_hunter_guild
DATABASE_HOST=<host-ip>
DATABASE_PORT=3307
```

4. Build and run the API (migrations run automatically on start):

```bash
docker build -t monster-hunter-guild-api:1.0.0 .
docker run --rm --name mhg-api -p 3000:3000 --env-file .env monster-hunter-guild-api:1.0.0
```

The API listens on `http://localhost:3000`.

5. Tear down:

```bash
docker stop mhg-api
docker rm -f mhg-mysql
```

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

# Releases

This project uses **Semantic Versioning (SemVer)** with **semantic-release** to automate version management.

When changes are merged into the `main` branch, the GitLab CI/CD pipeline automatically:

- Determines the next version following SemVer rules.
- Creates a Git tag for each release.
- Generates release notes.
- Updates the `CHANGELOG.md` file.
- Creates a GitLab Release.

The release process is based on Conventional Commits.

To validate the release configuration locally without creating a tag or release:

```bash
npx semantic-release --dry-run
```

## SonarQube — Static Code Analysis (Local)

This project includes a CI stage that analyzes the code with SonarQube Community Edition. You can run the same analysis on your machine before pushing changes to `main`.

### 1. Start SonarQube locally

The `compose.yml` includes the `sonar_db` (Postgres) and `sonarqube` services. Start them along with the rest of the stack:

```bash
docker compose up -d
```

Wait about 30-60 seconds for SonarQube to finish starting up (the first run takes longer).

### 2. Access the server and generate a token

1. Open [http://localhost:9000](http://localhost:9000) in your browser.
2. Log in with the default credentials: username `admin`, password `admin`. You'll be prompted to change it immediately.
3. Generate a token: click your avatar (top right) → **My Account → Security**.
   - **Name**: something identifiable, e.g. `local-<your-name>`
   - **Type**: `Global Analysis Token`
   - Click **Generate** and copy the token — it's only shown once.

### 3. Generate the coverage report

```bash
npm run test:ci
```

This creates `coverage/lcov.info`, which the scanner needs to report coverage.

### 4. Run the scanner

```bash
docker run --rm \
  --network mhg-network \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli:5.0.1 \
  -Dsonar.host.url=http://sonarqube:9000 \
  -Dsonar.token=YOUR_TOKEN_HERE \
  -Dsonar.qualitygate.wait=true
```

If everything goes well, you'll see `QUALITY GATE STATUS: PASSED` (or `FAILED`) in the console, and you can check the details on [http://localhost:9000/projects](http://localhost:9000/projects)

### Notes

- The local SonarQube instance is for testing only — the GitLab CI pipeline uses the server deployed at `10.27.10.184`, configured via CI/CD variables (`SONAR_HOST_URL`, `SONAR_TOKEN`).
- The analysis stage in CI only runs on the `main` branch; it doesn't run on Merge Requests or feature branches.