# Document Management System

This project is a **Document Management System** built with **NestJS**, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. The system provides robust APIs for managing documents, including creating, uploading, downloading, updating metadata, listing, and deleting documents. It features **role-based access control (RBAC)** and utilizes **Redis for token management**.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [Approach and Design](#approach-and-design)
- [Unit Tests](#unit-tests)

---

## Project Overview
The **Document Management System** provides the following core functionalities:
- **Create and manage document metadata** (title, description, author)
- **Upload and download documents** securely
- **List and search documents by title**
- **Update document metadata**
- **Delete documents**
- **Role-based access control** for different user roles (admin, editor, viewer)
- **Token management using Redis** to blacklist JWT tokens for secure authentication

---

## Technologies Used
- **NestJS** – Framework for building scalable server-side applications
- **TypeORM** – ORM for database operations
- **PostgreSQL** – Database for storing document metadata
- **Multer** – Middleware for handling multipart file uploads
- **Redis** – In-memory store for managing token blacklists
- **Jest** – Testing framework for unit tests
- **Docker** – For containerized deployment

---

## Setup and Installation
### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL
- Redis
- Docker (optional for containerization)

---

### Installation Steps
1. Clone the repository:
```
git clone https://github.com/your-repository/document-management.git
cd document-management
```
2. Install dependencies:
```
npm install
```
3. Set up environment variables: Create a .env.development file in the root directory and configure it with your settings (refer to the Environment Variables section).
4. Run PostgreSQL and Redis locally or using Docker.

---

## Running the Application
### Start the Application
```
npm run start:dev
```
### Run Unit Tests
```
npm run test
```
## Commands for running the Application on Docker
```
docker-compose --env-file .env.development build
docker-compose --env-file .env.development up
```

---

## Environment Variables
Create a **.env.development** file in the project root with the following variables:
```
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=document_management
JWT_SECRET=defaultSecret
JWT_EXPIRES_IN=1h
REDIS_HOST=redis-host-string
REDIS_PORT=6379
REDIS_PASSWORD=redis-password
```

---

## Features
- **Role-based Access Control** using custom Roles decorator and RolesGuard.
- **JWT Authentication** with JwtAuthGuard.
- **Token Blacklisting** in Redis for enhanced security.
- **File Upload and Download** with Multer and StreamableFile.
- **CRUD Operations** for managing documents.

--

## Approach and Design
### Key Design Choices
- **Modular Structure:** Each feature is encapsulated in its own module, following the NestJS modular architecture.
- **Dependency Injection:** Used extensively for services, repositories, and guards to promote testability.
- **Custom Decorators and Guards:** Implemented Roles decorator for role-based authorization and JwtAuthGuard for token validation.
- **Redis for Token Management:** JWT tokens are blacklisted using Redis to prevent reuse after logout.

### Code Organization
- **src/auth** - Manages authentication-related APIs.
- **src/common/decorators** – Contains custom decorators (Roles).
- **src/common/guards** – Implements RolesGuard and JwtAuthGuard.
- **src/common/guards/interfaces** - Contains interfaces for Guards.
- **src/config** - Contains configurations.
- **src/database** - Manages database.
- **src/redis** – Provides RedisService for token management.
- **src/document** – Manages document-related APIs.
- **src/role** - Manages role-related APIs and services.
- **src/user** - Manages user-related APIs.
- **src/ingestion** - Manages ingestion-related APIs.

---

## Unit Tests
**Command to Run Tests**
```
npm run test
```
