# Apartment Rental Portal v2

## 🏢 Project Overview
**Apartment Rental Portal v2** is a modern, full-stack web application designed to streamline apartment complex management. It facilitates interaction between residents, administrators, and service providers (helpers).

### Key Features
*   **User Management**: Role-Based Access Control (RBAC) for Residents, Admins, and Super Admins.
*   **Community Connect**: A localized marketplace for finding daily help (Maids, Cooks, Drivers) with WhatsApp integration.
*   **Admin Dashboard**: comprehensive tools for managing users, service providers, and audit logs.
*   **Secure Authentication**: JWT-based secure login with session management.
*   **Booking System**: Residents can browse units and book amenities.

---

## 🛠 Technology Stack
*   **Frontend**: Angular 17 (Standalone Components, Signals, Tailwind CSS)
*   **Backend**: Python Flask (RESTful API, SQLAlchemy ORM, JWT Extended)
*   **Database**: PostgreSQL 15
*   **Containerization**: Docker & Docker Compose
*   **Server**: Nginx (Frontend Proxy), Gunicorn (Backend WSGI)

---

## 🚀 Installation & Setup

### Prerequisites
*   **Docker Desktop** (Recommended)
*   *Or manually:* Node.js v18+, Python 3.11+, PostgreSQL

### Option 1: Quick Start with Docker (Recommended)
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd apartment-rental-portal-v2
    ```

2.  **Start the Application**:
    ```bash
    docker-compose up -d --build
    ```

3.  **Access the App**:
    *   Frontend: [http://localhost](http://localhost)
    *   Backend API: [http://localhost:5001](http://localhost:5001)

### Option 2: Manual Local Development

#### Backend Setup
1.  Navigate to `backend/`:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure Database:
    *   Update `config.py` with your local PostgreSQL credentials.
    *   Run migrations:
        ```bash
        flask db upgrade
        ```
5.  Run the server:
    ```bash
    python app.py
    ```

#### Frontend Setup
1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    ng serve
    ```
4.  Access at `http://localhost:4200`.

---

## ⚙️ Configuration

### Environment Variables
The application uses the following configuration variables. In Docker, these are set in `docker-compose.yml`.

| Variable | Description | Default (Dev) |
| :--- | :--- | :--- |
| `FLASK_ENV` | Environment mode | `development` |
| `SECRET_KEY` | Flask Session Key | `dev-secret-key` |
| `DATABASE_URL` | PostgreSQL Connection String | `postgresql://user:password@db:5432/rental_db` |
| `JWT_SECRET_KEY` | JWT Signing Key | `dev-secret-key` |

---

## 📚 API Documentation

### Authentication
*   **POST** `/api/auth/login`: Authenticate user and return JWT.
*   **POST** `/api/auth/register`: Register a new resident.

### Admin Management
*   **GET** `/api/admin/users`: List all users (Filtered for Regular Admins).
*   **POST** `/api/admin/users`: Create a new Admin or Resident (Super Admin only for creating Admins).
*   **POST** `/api/admin/service-providers`: Add a new helper (Maid, Cook, etc.).

### Service Providers
*   **GET** `/api/service-providers`: List all available helpers.
*   **GET** `/api/service-providers/search`: Search helpers by type.

---

## 🛡 Administrative Tasks

### Seeding the Database
To populate the database with initial data (Super Admin, Default Towers, Amenities):
```bash
# Inside the backend container or local env
python seed.py
```
**Default Credentials:**
*   **Super Admin**: `admin@example.com` / `admin123`
*   **Resident**: `resident@example.com` / `resident123`

### Creating a New Admin
1.  Log in as **Super Admin**.
2.  Navigate to the **Admin Dashboard**.
3.  Use the "Create User" form.
4.  Select role "Admin".

---

## 📦 Deployment

### Production Checklist
1.  **Security**:
    *   Change `SECRET_KEY` and `JWT_SECRET_KEY` to strong, random strings.
    *   Ensure `FLASK_ENV` is set to `production`.
    *   Use a managed PostgreSQL database (e.g., AWS RDS) instead of the local container.
2.  **Cleanup**:
    *   Remove test files and logs (See `DEPLOYMENT_CHECKLIST.md`).
3.  **Build**:
    *   Build Docker images with production tags.
    *   Ensure Nginx is configured for SSL (HTTPS).

---

## 🧪 Testing
To run the backend test suite:
```bash
cd backend
python -m pytest
```

To run frontend unit tests:
```bash
cd frontend
ng test
```
