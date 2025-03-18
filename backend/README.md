# Teacher Evaluation System - Backend

This is the backend API for the Teacher Evaluation System, a platform for evaluating teacher performance in educational institutions.

## Features

- User authentication (login/logout)
- Role-based access control (admin, evaluator, teacher)
- Evaluation management
- Performance reports
- Notifications system

## Project Structure

```
backend/
├── config/             # Configuration files
│   └── database.js     # Database connection configuration
├── controllers/        # Route controllers
│   ├── auth.js         # Authentication controller
│   ├── evaluations.js  # Evaluations controller
│   └── reports.js      # Reports controller
├── middleware/         # Custom middleware
│   └── auth.js         # Authentication middleware
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── evaluations.js  # Evaluations routes
│   └── reports.js      # Reports routes
├── utils/              # Utility functions
│   └── logger.js       # Logging utility
├── .env                # Environment variables
├── package.json        # Project dependencies
├── README.md           # Project documentation
└── server.js           # Main server file
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd evaluation-system/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a MySQL database:
```sql
CREATE DATABASE evaluacion_docente;
```

4. Configure environment variables:
   - Copy the `.env.example` file to `.env`
   - Update the values in the `.env` file with your database credentials and other settings

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=evaluacion_docente
JWT_SECRET=your_secret_key
```

5. Run database migrations (if available) or import the SQL schema.

6. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/login` - Authenticate user and get token
- `POST /api/logout` - Logout and invalidate token
- `GET /api/user` - Get current user info

### Dashboard
- `GET /api/dashboard/evaluaciones` - Get evaluations list for dashboard

### Evaluations
- `POST /api/evaluaciones/iniciar` - Initialize a new evaluation
- `GET /api/evaluaciones/:id` - Get evaluation details
- `POST /api/evaluaciones/:id` - Save/update evaluation
- `POST /api/evaluaciones/:id/enviar` - Submit evaluation

### Reference Data
- `GET /api/aspectos-evaluacion` - Get aspects and rating scale

### Reports
- `GET /api/reportes/desempeno-docente/:id` - Get teacher performance report

### Notifications
- `GET /api/notificaciones` - Get user notifications
- `PUT /api/notificaciones/:id/leer` - Mark notification as read

## License

This project is licensed under the MIT License.