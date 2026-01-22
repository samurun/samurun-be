# Samurun API

[![codecov](https://codecov.io/gh/samurun/samurun-be/branch/develop/graph/badge.svg?token=9TQ4AIPT23)](https://codecov.io/gh/samurun/samurun-be)

Backend for personal portfolio & blog. This is a practice project focused on Backend Development and CI/CD workflows.

> **Current Focus**: Backend (Hono, Postgres) and CI/CD (Test & Build). Deployment pipelines are planned for future updates.

## Tech Stack

This project uses a high-performance stack designed for type safety and developer experience:

- **[Hono](https://hono.dev/)**: Ultrafast validation-first web framework (v4.11). Used for routing and handling HTTP requests.
- **[PostgreSQL](https://www.postgresql.org/)**: Robust relational database (v16).
- **[Drizzle ORM](https://orm.drizzle.team/)**: TypeScript ORM for type-safe database access and migrations.
- **[Zod](https://zod.dev/)**: TypeScript-first schema declaration and validation.
- **[Docker](https://www.docker.com/)**: Containerization for consistent development and deployment environments.
- **OpenAPI / Swagger**: Auto-generated API documentation.

## Project Structure

```text
src/
 ├─ app.ts                 # Bootstrap Hono และลงทะเบียน Middleware หลัก
 ├─ routes.ts              # รวม Route ทั้งหมดจากทุก Modules เข้าด้วยกัน
 │
 ├─ modules/               # แบ่งตาม Domain/Feature
 │   ├─ auth/
 │   │   ├─ auth.route.ts     # Route definitions สำหรับ Auth
 │   │   ├─ auth.validator.ts # Zod schemas สำหรับ Auth
 │   │   └─ auth.test.ts      # Unit/Integration tests สำหรับ Auth
 │   │
 │   ├─ user/
 │   │   └─ user.service.ts   # Logic การจัดการข้อมูล User (Shared)
 │   │
 │   ├─ experience/
 │   │   ├─ experience.route.ts
 │   │   ├─ experience.service.ts
 │   │   ├─ experience.validator.ts
 │   │   └─ experience.test.ts
 │   │
 │   ├─ summary/
 │   │   ├─ summary.route.ts
 │   │   ├─ summary.service.ts
 │   │   ├─ summary.validator.ts
 │   │   └─ summary.test.ts
 │   │
 │   └─ tech/
 │       ├─ tech.route.ts
 │       ├─ tech.service.ts
 │       ├─ tech.validator.ts
 │       └─ tech.test.ts
 │
 ├─ db/
 │   ├─ client.ts          # Drizzle client (Node-Postgres)
 │   └─ schema.ts          # Database schema
 │
 ├─ middlewares/
 │   ├─ auth.middleware.ts  # JWT Auth middleware
 │   ├─ error.middleware.ts # Global error handler
 │   └─ logger.ts           # Custom logger middleware
 │
 ├─ utils/                 # Utility functions (env, api response, etc.)
 └─ types/                 # TypeScript type definitions
```

## Prerequisites

- Node.js v20 or higher
- Docker & Docker Compose

## Setup & Installation

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Copy `.env.example` to `.env` and adjust the values if needed.
    ```bash
    cp .env.example .env
    ```

## Running the Application

### Local Development

To run the application locally with hot-reloading:

```bash
npm run dev
```

_Note: Ensure your local Postgres database is running or use the docker command below._

### Docker Development

To run both the API and Database in Docker containers (recommended for easy setup):

```bash
npm run docker:dev
```

This command builds the images and spins up the services defined in `docker-compose.yml`.

## Database Management

We use Drizzle Kit for database migrations.

- **Generate Migrations**: Create SQL migration files based on schema changes.
  ```bash
  npm run db:generate
  ```
- **Push Schema**: Push schema changes directly to the database (useful for rapid prototyping).
  ```bash
  npm run db:push
  ```

## API Documentation

The API documentation is auto-generated using OpenAPI and Swagger UI.

- **Swagger UI**: Access the interactive API docs at `http://localhost:3000/swagger`
- **OpenAPI JSON**: `http://localhost:3000/doc`

## CI/CD & Deployment

### Docker Workflow

The project is containerized using a multi-stage `Dockerfile` optimized for production:

- **Base Image**: `node:20-alpine` (lightweight and secure).
- **Build Process**: Installs dependencies and compiles the TypeScript code.
- **Production Image**: Runs the compiled `dist/index.js`.

### CI/CD Pipeline (Current Focus)

The current CI/CD focus is on automating the testing and building processes to ensure code quality and build stability.

1.  **Test**: Run linting and unit/integration tests to verify code changes.
2.  **Build**: Assemble the Docker image to ensure the application builds correctly in a containerized environment.

_Deployment strategies (e.g., pushing to registry and deploying to a server) will be implemented in a later phase._
