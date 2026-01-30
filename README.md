# Apartment Rental Portal

**Apartment Rental Portal** is a comprehensive, full-stack web application designed to digitize and streamline the management of residential apartment complexes. It provides a robust platform for residents to manage their tenancy and lifestyle, while offering administrators powerful tools for oversight and operations.

The system features a **Hierarchical Admin System** that distinguishes between Super Admins (system owners) and Regular Admins (staff/managers), ensuring secure and appropriate delegation of duties.

---

## 🚀 Features

### 🔐 Role-Based Access Control (RBAC)
*   **Super Admin**: Full system control, including the exclusive ability to create and manage other Admin accounts.
*   **Regular Admin**: Operational control over users, bookings, and service providers, but restricted from altering system-level admin access.
*   **Resident**: Secure portal for booking amenities, finding daily help, and managing payments.

### 🏘️ Community Connect
A dedicated marketplace feature for residents to find and contact verified daily service providers:
*   **Categories**: Maids, Cooks, Drivers, Nannies, and more.
*   **Integration**: Direct WhatsApp integration for instant communication.
*   **Verification**: Admins vet and list providers to ensure safety.

### 📅 Booking & Management
*   **Amenity Booking**: Residents can browse and book common facilities (Clubhouse, Tennis Court, etc.).
*   **User Management**: Admins can view, filter, and manage resident accounts.
*   **Service Provider Management**: Full CRUD capabilities for managing the Community Connect directory.

### ⚙️ Technical Highlights
*   **Modern Frontend**: Built with **Angular 17** using Standalone Components, Signals, and Tailwind CSS for a responsive UI.
*   **Robust Backend**: Powered by **Python Flask**, featuring SQLAlchemy ORM and JWT-based authentication.
*   **Production Ready**: Dockerized environment with Nginx and Gunicorn for scalable deployment.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Angular 17, TypeScript, Tailwind CSS |
| **Backend** | Python 3.11, Flask 3.0, SQLAlchemy |
| **Database** | PostgreSQL 15 |
| **Containerization** | Docker, Docker Compose |
| **Server** | Nginx (Reverse Proxy), Gunicorn (WSGI) |

---

## 📦 Installation & Setup

### Prerequisites
*   **Docker Desktop** (Recommended for easiest setup)
*   *Or manually:* Node.js v20+, Python 3.11+, PostgreSQL 15+

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
1.  Navigate to `backend/` and create a virtual environment:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure `config.py` with your local PostgreSQL credentials and run migrations:
    ```bash
    flask db upgrade
    ```
4.  Run the server:
    ```bash
    python app.py
    ```

#### Frontend Setup
1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    npm install
    ```
2.  Run the development server:
    ```bash
    ng serve
    ```
3.  Access at `http://localhost:4200`.

---

## 🛡️ Admin & User Setup

To populate the database with initial roles, towers, amenities, and default users, run the seed script:

```bash
# Inside the backend container or local env
python seed.py
```

### Default Credentials
| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@example.com` | `admin123` | Full Access + Admin Creation |
| **Regular Admin** | `regular_admin@example.com` | `regadmin123` | User/Booking/Provider Management |
| **Resident** | `resident@example.com` | `resident123` | Bookings, Community Connect |

---

## 📖 Usage Guidelines

### For Super Admins
1.  **Create New Admins**: Go to **User Management** -> **Create User**. Select "Admin" role. This option is *only* visible to you.
2.  **System Oversight**: View all users, including other admins.

### For Regular Admins
1.  **Manage Residents**: View and manage resident accounts. Note: You cannot view or edit other Admin accounts.
2.  **Manage Services**: Navigate to **Service Providers** to add or remove helpers from the Community Connect listing.

### For Residents
1.  **Find Help**: Click on **Community Connect** to browse daily helpers. Click the WhatsApp icon to contact them directly.
2.  **Book Units**: Use the **Browse Units/Amenities** section to reserve facilities.

---

## ☁️ Cloud Deployment

The application is fully configured for cloud deployment using the root `Dockerfile`.

*   **Render**: [Deploy to Render](https://apartment-rental-portal-8bt7.onrender.com/)
*   **Railway**: [Deploy to Railway](https://apartment-rental-portal-production.up.railway.app/)

**Environment Variables Required:**
*   `DATABASE_URL`: Production PostgreSQL connection string.
*   `SECRET_KEY`: A strong random string for session security.
*   `JWT_SECRET_KEY`: A strong random string for token signing.

---

## 📚 API Documentation

### Authentication
*   `POST /api/auth/login`: Authenticate and receive JWT.
*   `POST /api/auth/register`: Register a new resident account.

### Admin Operations
*   `GET /api/admin/users`: List users (Filtered based on admin level).
*   `POST /api/admin/users`: Create a new user (Restricted: Super Admins can create Admins).
*   `POST /api/admin/service-providers`: Add a new entry to Community Connect.

### Community Connect
*   `GET /api/service-providers`: List all active service providers.
*   `GET /api/service-providers/search`: Filter providers by category (e.g., "Maid", "Driver").

---

## 🤝 Contribution

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Contact

**Project Maintainer**  
Email: [pranathi.dodd8682@gmail.com](mailto:pranathi.dodd8682@gmail.com)  
Project Link: [https://github.com/Pranathi1184/apartment-rental-portal/tree/main](https://github.com/Pranathi1184/apartment-rental-portal/tree/main)
