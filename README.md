# FinTrack - Personal Finance Management System

FinTrack is a comprehensive, full-stack Personal Finance Management System. It allows users to securely register, manage their income and expenses, set monthly budgets, and view detailed dashboards and reports about their financial health.

## Technology Stack

- **Backend:** Java 17, Spring Boot 3.3.x, Spring Security (JWT), Spring Data JPA, PostgreSQL
- **Frontend:** Vanilla HTML, CSS, JavaScript (ES6), Fetch API
- **Testing & API Docs:** JUnit, Mockito, Postman, Swagger/OpenAPI

## Project Structure

```
FinTrack/
├── backend/                  # Spring Boot application (REST API)
├── frontend/                 # Vanilla HTML/JS frontend application
├── postman/                  # Postman collection for API testing
├── docker-compose.yml        # PostgreSQL database service setup
└── README.md                 # Project documentation
```

## Setup Instructions

### 1. Database Setup
Ensure Docker is installed on your machine.
Run the following command in the root directory (`FinTrack/`) to start the PostgreSQL instance:
```bash
docker compose up -d
```
*This starts a database named `fintrack_db` on port 5432.*

### 2. Backend Setup
Navigate to the `backend/` directory and run the Spring Boot application using the provided Maven wrapper:
```bash
cd backend
./mvnw spring-boot:run
```
*The backend API will start on `http://localhost:8080`. Swagger documentation is available at `http://localhost:8080/swagger-ui.html`.*

### 3. Frontend Setup
The frontend is completely vanilla and requires no build step. 
You can run it using any static server. For example:
- **Using Python:** 
  ```bash
  cd frontend
  python3 -m http.server 8000
  ```
  Then navigate to `http://localhost:8000`.
- **Using Node (npx):**
  ```bash
  cd frontend
  npx serve
  ```

### 4. API Testing
Import the `FinTrack.postman_collection.json` (located in the `postman/` directory) into Postman to easily test all the backend endpoints.

## Features Completed
- [x] **Authentication**: JWT-based Secure Login & Registration.
- [x] **Income Management**: Track income sources, dates, and amounts.
- [x] **Expense Management**: Categorize and log daily expenses.
- [x] **Categories**: Define custom categories.
- [x] **Budgets**: Set and monitor monthly budgets to avoid overspending.
- [x] **Dashboard**: High-level overview of balances, recent transactions, and budget usage.
- [x] **Reports**: Category-wise monthly spending summaries.
