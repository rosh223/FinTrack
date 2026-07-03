# 💰 FinTrack — Personal Finance Management System

<div align="center">

**A full-stack personal finance management application built with Java Spring Boot and Vanilla JavaScript.**

[![Live Backend](https://img.shields.io/badge/Backend-Live%20on%20Render-46E3B7?style=for-the-badge&logo=render)](https://fintrack-vmcu.onrender.com)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger%20UI-85EA2D?style=for-the-badge&logo=swagger)](https://fintrack-vmcu.onrender.com/swagger-ui.html)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-00E5A0?style=for-the-badge&logo=postgresql)](https://neon.tech)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Design](#-database-design)
- [API Endpoints](#-api-endpoints)
- [Authentication Flow](#-authentication-flow)
- [Data Flow](#-data-flow)
- [Project Structure](#-project-structure)
- [Local Development Setup](#-local-development-setup)
- [Deployment Strategy](#-deployment-strategy)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Deployment Challenges & Solutions](#-deployment-challenges--solutions)
- [Future Enhancements](#-future-enhancements)

---

## 🌟 Overview

FinTrack is a comprehensive personal finance management system that empowers users to take control of their money. Users can securely register, track income and expenses, set monthly budgets, define spending categories, and view detailed dashboards and reports — all from a clean, responsive web interface.

The application follows a **client-server architecture** with a RESTful API backend and a lightweight vanilla JavaScript frontend, making it easy to understand, extend, and deploy.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure registration and login with stateless token-based auth |
| 💵 **Income Tracking** | Log income sources with amounts, descriptions, and dates |
| 💸 **Expense Management** | Categorize and track daily expenses |
| 🏷️ **Custom Categories** | Create personalized spending categories |
| 📊 **Monthly Budgets** | Set spending limits and monitor usage in real-time |
| 📈 **Dashboard** | High-level overview of balances, recent transactions, and budget health |
| 📋 **Reports** | Category-wise monthly spending summaries and breakdowns |
| 📄 **API Documentation** | Interactive Swagger UI for all endpoints |
| 🏥 **Health Check** | Public `/` endpoint returning API status as JSON |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Java 17** | Core programming language |
| **Spring Boot 3.3.x** | Application framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | Database ORM layer |
| **JWT (JSON Web Tokens)** | Stateless authentication tokens |
| **Hibernate** | JPA implementation & DDL auto-generation |
| **PostgreSQL** | Production database (Neon) |
| **H2** | In-memory database for local development |
| **Lombok** | Reduces boilerplate code |
| **SpringDoc OpenAPI** | Auto-generated Swagger documentation |
| **Maven** | Build and dependency management |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **HTML5** | Page structure and semantics |
| **CSS3** | Styling with responsive design |
| **Vanilla JavaScript (ES6+)** | Application logic, DOM manipulation |
| **Fetch API** | HTTP requests to backend REST API |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Render** | Cloud hosting (Backend Web Service + Frontend Static Site) |
| **Neon** | Managed PostgreSQL database (free tier) |
| **Docker** | Containerized backend deployment |
| **GitHub** | Source control + CI/CD trigger via webhooks |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET (HTTPS)                         │
└──────────┬──────────────────────────────────┬───────────────────┘
           │                                  │
           ▼                                  ▼
┌─────────────────────┐          ┌─────────────────────────┐
│   Render Static     │          │   Render Web Service    │
│   Site (Frontend)   │   HTTP   │   (Backend Docker)      │
│                     │ ───────► │                         │
│  ┌───────────────┐  │  Fetch   │  ┌───────────────────┐  │
│  │  HTML Pages   │  │  API     │  │  Spring Boot App  │  │
│  │  CSS Styles   │  │          │  │  (Java 17 + JRE)  │  │
│  │  JavaScript   │  │          │  │                   │  │
│  │  (Fetch API)  │  │          │  │  Port 8080        │  │
│  └───────────────┘  │          │  └────────┬──────────┘  │
│                     │          │           │              │
│  fintrack-frontend  │          │  fintrack-vmcu           │
│  .onrender.com      │          │  .onrender.com           │
└─────────────────────┘          └───────────┬─────────────┘
                                             │
                                             │ JDBC (SSL)
                                             ▼
                                 ┌─────────────────────────┐
                                 │   Neon PostgreSQL       │
                                 │   (AWS Singapore)       │
                                 │                         │
                                 │  Tables:                │
                                 │  ├── users              │
                                 │  ├── categories         │
                                 │  ├── expenses           │
                                 │  ├── incomes            │
                                 │  └── budgets            │
                                 │                         │
                                 │  neondb (free tier)     │
                                 └─────────────────────────┘
```

### Layered Architecture (Backend)

```
┌──────────────────────────────────────────────────┐
│                  Client Request                   │
│              (HTTP + JWT in Header)                │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│             Security Filter Chain                 │
│  ┌────────────────────────────────────────────┐   │
│  │  JwtAuthenticationFilter                   │   │
│  │  • Extracts JWT from Authorization header  │   │
│  │  • Validates token via JwtService          │   │
│  │  • Sets SecurityContext if valid           │   │
│  └────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│               Controller Layer                    │
│                                                   │
│  AuthController  │ ExpenseController │ Income...   │
│  BudgetController│ CategoryController│ Report...   │
│  DashboardController │ HealthController            │
│                                                   │
│  • Receives HTTP requests                         │
│  • Validates input (via @Valid)                    │
│  • Delegates to Service layer                     │
│  • Returns ResponseEntity<DTO>                    │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│                Service Layer                      │
│                                                   │
│  AuthService  │ ExpenseService  │ IncomeService    │
│  BudgetService│ CategoryService │ ReportService    │
│  DashboardService │ JwtService                     │
│                                                   │
│  • Contains all business logic                    │
│  • Converts Entities ↔ DTOs                       │
│  • Enforces authorization (user-specific data)    │
│  • Throws custom exceptions                       │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│              Repository Layer                     │
│                                                   │
│  UserRepository │ ExpenseRepository │ Income...    │
│  BudgetRepository │ CategoryRepository             │
│                                                   │
│  • Extends JpaRepository<Entity, Long>            │
│  • Spring Data auto-generates SQL queries          │
│  • Custom queries via method naming convention    │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│               Database (PostgreSQL)               │
│                                                   │
│  Hibernate auto-generates tables from @Entity     │
│  using ddl-auto: update                           │
└──────────────────────────────────────────────────┘
```

---

## 🗃️ Database Design

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │    categories    │       │   budgets    │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)          │       │ id (PK)      │
│ name         │◄──┐   │ name             │       │ user_id (FK) │
│ email (UQ)   │   │   │ user_id (FK)     │──┐   │ month        │
│ password     │   │   └──────────────────┘  │   │ year         │
│ role (ENUM)  │   │                         │   │ amount       │
└──────┬───────┘   │   ┌──────────────────┐  │   └──────────────┘
       │           │   │    expenses      │  │         │
       │           │   ├──────────────────┤  │         │
       │           ├───│ user_id (FK)     │  │         │
       │           │   │ category_id (FK) │──┘         │
       │           │   │ amount           │            │
       │           │   │ description      │            │
       │           │   │ date             │            │
       │           │   └──────────────────┘            │
       │           │                                   │
       │           │   ┌──────────────────┐            │
       │           │   │    incomes       │            │
       │           │   ├──────────────────┤            │
       │           └───│ user_id (FK)     │            │
       │               │ amount           │            │
       │               │ source           │            │
       │               │ description      │            │
       │               │ date             │            │
       │               └──────────────────┘            │
       │                                               │
       └─────────── One User has Many ─────────────────┘
                    (expenses, incomes, budgets, categories)
```

### Key Design Decisions

- **`ddl-auto: update`** — Hibernate automatically creates and updates tables from `@Entity` classes. No manual SQL migration scripts needed.
- **`@GeneratedValue(IDENTITY)`** — Auto-incrementing primary keys managed by PostgreSQL.
- **`Role` as ENUM** — Stored as `STRING` in the database for readability (`USER`, `ADMIN`).
- **User-scoped data** — Every entity (expense, income, budget, category) belongs to a specific user via a `user_id` foreign key, ensuring data isolation.

---

## 🔌 API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login and receive JWT token |

### Expenses (Protected — JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/expenses` | Get all expenses for logged-in user |
| `POST` | `/api/v1/expenses` | Add a new expense |
| `PUT` | `/api/v1/expenses/{id}` | Update an existing expense |
| `DELETE` | `/api/v1/expenses/{id}` | Delete an expense |

### Income (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/incomes` | Get all incomes |
| `POST` | `/api/v1/incomes` | Add a new income |
| `PUT` | `/api/v1/incomes/{id}` | Update an income |
| `DELETE` | `/api/v1/incomes/{id}` | Delete an income |

### Categories (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/categories` | Get all categories |
| `POST` | `/api/v1/categories` | Create a new category |
| `DELETE` | `/api/v1/categories/{id}` | Delete a category |

### Budgets (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/budgets` | Get budget for current month |
| `POST` | `/api/v1/budgets` | Set a monthly budget |

### Dashboard & Reports (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/dashboard` | Get financial overview (balance, recent transactions) |
| `GET` | `/api/v1/reports/monthly` | Get category-wise spending report |

### Health (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API health check (returns status JSON) |

> 📝 All protected endpoints require a `Authorization: Bearer <jwt_token>` header.

---

## 🔐 Authentication Flow

```
┌──────────┐                    ┌──────────────┐                ┌──────────┐
│  Client  │                    │  Spring Boot │                │ Database │
│ (Browser)│                    │   Backend    │                │ (Neon)   │
└────┬─────┘                    └──────┬───────┘                └────┬─────┘
     │                                 │                             │
     │  1. POST /api/v1/auth/register  │                             │
     │  {name, email, password}        │                             │
     │────────────────────────────────►│                             │
     │                                 │  2. Hash password           │
     │                                 │     (BCrypt)                │
     │                                 │  3. Save user               │
     │                                 │────────────────────────────►│
     │                                 │                             │
     │                                 │  4. Generate JWT            │
     │                                 │     (HMAC-SHA256)           │
     │  5. Return {token: "eyJ..."}    │                             │
     │◄────────────────────────────────│                             │
     │                                 │                             │
     │  6. Store token in localStorage │                             │
     │                                 │                             │
     │  ─ ─ ─ ─ ─ (Later) ─ ─ ─ ─ ─  │                             │
     │                                 │                             │
     │  7. GET /api/v1/expenses        │                             │
     │  Header: Bearer eyJ...          │                             │
     │────────────────────────────────►│                             │
     │                                 │  8. JwtAuthFilter extracts  │
     │                                 │     token, validates it     │
     │                                 │  9. Sets SecurityContext    │
     │                                 │ 10. Fetch user's expenses   │
     │                                 │────────────────────────────►│
     │                                 │◄────────────────────────────│
     │  11. Return expense list        │                             │
     │◄────────────────────────────────│                             │
     │                                 │                             │
```

### Security Implementation Details

- **Password Storage**: BCrypt hashing with salt (never stored in plain text)
- **Token Signing**: HMAC-SHA256 with a 256-bit secret key
- **Token Expiration**: 24 hours (86400000 ms)
- **Stateless Sessions**: No server-side session storage; each request is authenticated independently via the JWT
- **Filter Chain**: `JwtAuthenticationFilter` runs before every request as a `OncePerRequestFilter`

---

## 🔄 Data Flow

### Example: Adding a New Expense

```
User clicks "Add Expense" on the UI
         │
         ▼
┌─────────────────────────────┐
│  Frontend (JavaScript)      │
│                             │
│  1. Collect form data       │
│  2. Read JWT from           │
│     localStorage            │
│  3. fetch('/api/v1/expenses'│
│     method: 'POST',         │
│     headers: {              │
│       'Authorization':      │
│       'Bearer ' + token,    │
│       'Content-Type':       │
│       'application/json'    │
│     },                      │
│     body: JSON.stringify({  │
│       amount: 500,          │
│       description: "Rent",  │
│       categoryId: 3,        │
│       date: "2026-07-01"    │
│     })                      │
│  )                          │
└──────────────┬──────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────┐
│  JwtAuthenticationFilter    │
│                             │
│  • Extract token from       │
│    Authorization header     │
│  • Validate signature       │
│    and expiration            │
│  • Load user from DB        │
│  • Set SecurityContext      │
└──────────────┬──────────────┘
               │ (Authenticated)
               ▼
┌─────────────────────────────┐
│  ExpenseController          │
│                             │
│  @PostMapping("/expenses")  │
│  • Receives @RequestBody    │
│    ExpenseRequest DTO       │
│  • @Valid validates fields  │
│  • Calls ExpenseService     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  ExpenseService             │
│                             │
│  • Gets current user from   │
│    SecurityContext           │
│  • Converts DTO → Entity    │
│  • Sets user_id on entity   │
│  • Calls repository.save()  │
│  • Converts Entity → DTO    │
│  • Returns ExpenseResponse  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  ExpenseRepository          │
│  (extends JpaRepository)    │
│                             │
│  • Hibernate generates:     │
│    INSERT INTO expenses     │
│    (amount, description,    │
│     category_id, user_id,   │
│     date)                   │
│    VALUES (500, 'Rent',     │
│     3, 1, '2026-07-01')    │
└──────────────┬──────────────┘
               │ JDBC + SSL
               ▼
┌─────────────────────────────┐
│  PostgreSQL (Neon)          │
│                             │
│  Row inserted into          │
│  expenses table ✅           │
└─────────────────────────────┘
```

---

## 📁 Project Structure

```
FinTrack/
│
├── backend/                                    # Spring Boot REST API
│   ├── Dockerfile                              # Multi-stage Docker build
│   ├── pom.xml                                 # Maven dependencies
│   ├── mvnw                                    # Maven wrapper (no install needed)
│   └── src/main/java/com/fintrack/
│       ├── FinTrackApplication.java            # Main entry point (@SpringBootApplication)
│       ├── config/
│       │   └── SecurityConfig.java             # Spring Security + CORS + JWT filter chain
│       ├── controller/
│       │   ├── AuthController.java             # POST /register, /login
│       │   ├── ExpenseController.java          # CRUD /expenses
│       │   ├── IncomeController.java           # CRUD /incomes
│       │   ├── CategoryController.java         # CRUD /categories
│       │   ├── BudgetController.java           # GET/POST /budgets
│       │   ├── DashboardController.java        # GET /dashboard
│       │   ├── ReportController.java           # GET /reports
│       │   └── HealthController.java           # GET / (public health check)
│       ├── dto/                                # Data Transfer Objects
│       │   ├── AuthRequest.java                # Login request body
│       │   ├── RegisterRequest.java            # Registration request body
│       │   ├── AuthResponse.java               # JWT token response
│       │   ├── ExpenseRequest/Response.java    # Expense I/O
│       │   ├── IncomeRequest/Response.java     # Income I/O
│       │   ├── BudgetRequest/Response.java     # Budget I/O
│       │   ├── CategoryRequest/Response.java   # Category I/O
│       │   ├── DashboardResponse.java          # Dashboard summary
│       │   ├── CategorySpendingDto.java        # Report data
│       │   ├── TransactionDto.java             # Recent transactions
│       │   └── ErrorResponse.java              # Standardized error format
│       ├── entity/                             # JPA Entities (= Database Tables)
│       │   ├── User.java                       # users table (implements UserDetails)
│       │   ├── Expense.java                    # expenses table
│       │   ├── Income.java                     # incomes table
│       │   ├── Category.java                   # categories table
│       │   ├── Budget.java                     # budgets table
│       │   └── Role.java                       # ENUM: USER, ADMIN
│       ├── repository/                         # Spring Data JPA Repositories
│       │   ├── UserRepository.java
│       │   ├── ExpenseRepository.java
│       │   ├── IncomeRepository.java
│       │   ├── CategoryRepository.java
│       │   └── BudgetRepository.java
│       ├── security/                           # JWT Security Implementation
│       │   ├── JwtService.java                 # Token generation & validation
│       │   ├── JwtAuthenticationFilter.java    # OncePerRequestFilter
│       │   └── CustomUserDetailsService.java   # Loads user by email
│       ├── service/                            # Business Logic Layer
│       │   ├── AuthService.java
│       │   ├── ExpenseService.java
│       │   ├── IncomeService.java
│       │   ├── CategoryService.java
│       │   ├── BudgetService.java
│       │   ├── DashboardService.java
│       │   └── ReportService.java
│       ├── exception/                          # Custom Exception Handling
│       └── util/                               # Utility classes
│
├── frontend/                                   # Vanilla HTML/CSS/JS Frontend
│   ├── index.html                              # Login & Registration page
│   ├── dashboard.html                          # Financial overview
│   ├── expense.html                            # Expense management
│   ├── income.html                             # Income management
│   ├── budget.html                             # Budget management
│   ├── category.html                           # Category management
│   ├── reports.html                            # Monthly reports
│   ├── css/
│   │   └── style.css                           # Global styles
│   └── js/
│       └── app.js                              # Core JS (API calls, auth, DOM logic)
│
├── postman/                                    # API Testing
│   └── FinTrack.postman_collection.json        # Import into Postman
│
├── docker-compose.yml                          # Local PostgreSQL setup
├── .gitignore                                  # Git ignore rules
└── README.md                                   # This file
```

---

## 💻 Local Development Setup

### Prerequisites
- Java 17+ (JDK)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/rosh223/FinTrack.git
cd FinTrack
```

### 2. Start the Backend
The backend is configured to use an **in-memory H2 database** by default for local development, so you don't need PostgreSQL or Docker installed.

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at:
- **API Base**: `http://localhost:8080/api/v1`
- **Swagger Docs**: `http://localhost:8080/swagger-ui.html`
- **H2 Console**: `http://localhost:8080/h2-console`

### 3. Start the Frontend
```bash
cd frontend
python3 -m http.server 8000
```
Open `http://localhost:8000` in your browser.

### 4. API Testing with Postman
Import `postman/FinTrack.postman_collection.json` into Postman to test all endpoints with pre-configured requests.

---

## 🚀 Deployment Strategy

The application is deployed using a **three-tier cloud architecture**:

```
┌────────────────────────────────────────────────────────────┐
│                     GitHub Repository                       │
│                    (Source of Truth)                         │
└─────────┬──────────────────────┬──────────────────┬────────┘
          │                      │                  │
          │ Webhook              │ Webhook           │
          ▼                      ▼                  │
┌──────────────────┐   ┌──────────────────┐         │
│  Render           │   │  Render           │         │
│  Web Service      │   │  Static Site      │         │
│  (Backend)        │   │  (Frontend)       │         │
│                   │   │                   │         │
│  • Docker runtime │   │  • Serves HTML/   │         │
│  • Java 17 JRE    │   │    CSS/JS files   │         │
│  • Port 8080      │   │  • Global CDN     │         │
│  • 256MB heap     │   │  • No build step  │         │
│  • Auto-sleep on  │   │                   │         │
│    inactivity     │   │                   │         │
└────────┬─────────┘   └──────────────────┘         │
         │                                           │
         │ JDBC + SSL                                │
         ▼                                           │
┌──────────────────┐                                 │
│  Neon PostgreSQL  │◄────────────── Config ──────────┘
│  (AWS Singapore)  │               (Environment
│                   │                Variables)
│  • Free tier      │
│  • 0.5GB storage  │
│  • Auto-suspend   │
│  • Serverless     │
└──────────────────┘
```

### Deployment Configuration

| Component | Platform | Type | Root Directory |
|-----------|----------|------|---------------|
| **Backend** | Render | Web Service (Docker) | `backend` |
| **Frontend** | Render | Static Site | `frontend` |
| **Database** | Neon | Managed PostgreSQL | — |

### Environment Variables (Backend on Render)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | JDBC connection string to Neon PostgreSQL |
| `DATABASE_USERNAME` | Database username |
| `DATABASE_PASSWORD` | Database password (secret) |
| `DATABASE_DRIVER` | `org.postgresql.Driver` |
| `DATABASE_DIALECT` | `org.hibernate.dialect.PostgreSQLDialect` |

### Dockerfile (Multi-Stage Build)

```dockerfile
# Stage 1: Build the JAR using Maven
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Run with lightweight JRE
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]
```

**Why multi-stage?**
- Stage 1 uses the full JDK (500MB+) to compile the code
- Stage 2 uses only the JRE (200MB) to run it
- Final image is ~60% smaller, faster to deploy

**Why `-Xmx256m`?**
- Render's free tier has a 512MB RAM limit
- Without this flag, Java greedily allocates all available memory and gets killed by the OS (OOM kill)
- 256MB is plenty for a Spring Boot app with low traffic

---

## 🔁 CI/CD Pipeline

### How It Works (No Setup Required!)

Render provides **built-in CI/CD** through GitHub webhooks. There is no need to configure GitHub Actions, Jenkins, or any external CI tool.

```
Developer pushes code
        │
        ▼
┌──────────────────┐
│     GitHub        │
│  (main branch)    │
│                   │
│  Receives push    │
│  event            │
└────────┬─────────┘
         │
         │  Webhook notification
         │  (automatic, configured when
         │   you linked your repo to Render)
         │
         ▼
┌──────────────────────────────────────────┐
│              Render Platform              │
│                                           │
│  1. Detects which Root Directory changed  │
│     • backend/ changed → rebuild backend  │
│     • frontend/ changed → rebuild frontend│
│     • both changed → rebuild both         │
│                                           │
│  2. Backend Build Pipeline:               │
│     ┌─────────────────────────────────┐   │
│     │ a. Pull latest code from GitHub │   │
│     │ b. Run Dockerfile               │   │
│     │    • Stage 1: mvnw package      │   │
│     │    • Stage 2: Create JRE image  │   │
│     │ c. Deploy new container         │   │
│     │ d. Health check on port 8080    │   │
│     │ e. Route traffic to new version │   │
│     │ f. Shut down old container      │   │
│     └─────────────────────────────────┘   │
│                                           │
│  3. Frontend Build Pipeline:              │
│     ┌─────────────────────────────────┐   │
│     │ a. Pull latest code from GitHub │   │
│     │ b. Serve static files via CDN   │   │
│     │ c. Instant deployment (~10 sec) │   │
│     └─────────────────────────────────┘   │
│                                           │
│  4. Zero-downtime deployment              │
│     (old version serves traffic until     │
│      new version is healthy)              │
└──────────────────────────────────────────┘
```

### What Happens Under the Hood

1. **You run**: `git push origin main`
2. **GitHub** receives the push and fires a webhook (POST request) to Render's API
3. **Render** pulls the latest commit, checks which root directory was affected
4. **Build starts**: Dockerfile is executed (Maven compiles, tests are skipped, JAR is created)
5. **New container** starts on an isolated environment
6. **Health check**: Render pings port 8080 — if the app responds, deployment succeeds
7. **Traffic switch**: Render routes all incoming requests to the new container
8. **Old container** is gracefully shut down

> ⚡ **Total deployment time**: ~3-5 minutes for backend, ~10 seconds for frontend

---

## 🐛 Deployment Challenges & Solutions

### Challenge 1: Java Out of Memory (OOM) on Render

**Problem**: Spring Boot application crashed immediately on startup with `Exited with status 1` and `No open ports detected`.

**Root Cause**: Java's default behavior is to allocate as much heap memory as the OS allows. On Render's free tier (512MB RAM), Java tried to grab ~400MB for the heap, leaving no room for the OS, JVM internals, or Hibernate — causing an Out of Memory kill.

**Solution**: Added `-Xmx256m` flag to the Dockerfile's `ENTRYPOINT` to cap Java's heap at 256MB:
```dockerfile
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]
```

---

### Challenge 2: Supabase IPv6 vs Render IPv4

**Problem**: After fixing the OOM issue, the app crashed with `java.net.UnknownHostException: db.xxxx.supabase.co` — meaning Render couldn't even find the database server.

**Root Cause**: Supabase recently migrated their **direct connections** to **IPv6-only**. Render's free tier Docker containers run on **IPv4-only** networks. IPv4 machines literally cannot resolve IPv6 addresses — it's like trying to call a phone number with too many digits.

**Attempted Fix**: Switched to Supabase's **Connection Pooler** (PgBouncer), which supports IPv4.

---

### Challenge 3: Supabase PgBouncer Tenant Routing Failure

**Problem**: Even after switching to the pooler URL, the app crashed with: `FATAL: (ENOTFOUND) tenant/user postgres.mwcyyhsytfueuagqywcd not found`

**Root Cause**: Supabase's PgBouncer uses the **username** (format: `postgres.<project_ref>`) to route connections to the correct database. For newly created projects, the pooler's routing table sometimes hasn't propagated the tenant information yet. Supabase's own dashboard was displaying "We are investigating a technical issue" at the time, confirming this was an infrastructure problem on their end.

**Solution**: Abandoned Supabase entirely and switched to **Neon** — a PostgreSQL provider that offers:
- Direct IPv4 connections (no pooler needed)
- Instant project provisioning (created in 2223ms)
- Free tier with 0.5GB storage
- Works flawlessly with standard JDBC connections

---

### Challenge 4: 403 Forbidden on Root URL

**Problem**: Visiting `https://fintrack-vmcu.onrender.com/` returned `HTTP ERROR 403 - Access Denied`, which looked like the app was broken.

**Root Cause**: Spring Security's default configuration blocks all unauthenticated requests. Since there was no controller mapped to `/`, Spring returned a 403.

**Solution**: 
1. Created a `HealthController.java` with a `@GetMapping("/")` that returns a JSON status response
2. Added `"/"` to the `permitAll()` list in `SecurityConfig.java`

```json
{
  "status": "running",
  "application": "FinTrack API",
  "version": "1.0.0",
  "docs": "/swagger-ui.html"
}
```

---

### Summary of Issues

| # | Issue | Cause | Fix |
|---|-------|-------|-----|
| 1 | OOM crash on Render | Java default heap too large | `-Xmx256m` in Dockerfile |
| 2 | Can't resolve Supabase host | Supabase uses IPv6, Render uses IPv4 | Switched to Connection Pooler |
| 3 | Pooler tenant not found | Supabase infrastructure issue | Migrated to Neon PostgreSQL |
| 4 | 403 on root URL | Spring Security blocks `/` | Added HealthController + permitAll |

---

## 🔮 Future Enhancements

- [ ] **Email Verification** — Verify user email during registration
- [ ] **Password Reset** — Forgot password flow with email OTP
- [ ] **Export to CSV/PDF** — Download expense reports
- [ ] **Recurring Expenses** — Auto-log monthly recurring bills
- [ ] **Multi-Currency Support** — Track expenses in different currencies
- [ ] **Charts & Graphs** — Visual spending trends using Chart.js
- [ ] **Dark Mode** — Theme toggle for the frontend
- [ ] **Mobile Responsive** — Fully responsive design for mobile devices
- [ ] **Admin Panel** — Admin dashboard to manage all users
- [ ] **Rate Limiting** — Prevent API abuse with request throttling
- [ ] **Unit & Integration Tests** — Comprehensive test coverage with JUnit + Mockito
- [ ] **GitHub Actions CI** — Run tests automatically before deployment

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Roshan Singh](https://github.com/rosh223)**

*If you found this project helpful, consider giving it a ⭐ on GitHub!*

</div>
