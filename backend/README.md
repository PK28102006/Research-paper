# Backend API Documentation

## 🚀 Quick Start

### Installation
```bash
cd server
npm install
```

### Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

### Run Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

---

## 📁 Project Structure

```
server/
├── config/              # Configuration files
│   └── index.js         # Environment config loader
├── controllers/         # Business logic
│   ├── authController.js
│   ├── userController.js
│   └── paperController.js
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT authentication
│   ├── validator.js     # Request validation
│   └── errorHandler.js  # Error handling
├── models/              # Data models
│   ├── User.js
│   └── Paper.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── paperRoutes.js
├── utils/               # Utilities
│   └── jsonDb.js        # JSON database operations
├── data/                # Data storage
│   └── store.json       # JSON database
├── .env                 # Environment variables
├── .env.example         # Environment template
├── index.js             # Server entry point
├── migrate.js           # Password migration script
└── package.json
```

---

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Login Flow
1. User sends credentials to `/api/auth/login`
2. Server validates and returns JWT token
3. Client stores token in localStorage
4. Client includes token in all subsequent requests

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### User Routes (`/api/users`)

All user routes require authentication.

#### Get All Users (Admin only)
```http
GET /api/users
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 5,
  "users": [...]
}
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {...}
}
```

#### Get Users by Role (Admin only)
```http
GET /api/users/role/:role
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 3,
  "users": [...]
}
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}

Response:
{
  "success": true,
  "message": "User updated successfully",
  "user": {...}
}
```

#### Delete User (Admin only)
```http
DELETE /api/users/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Paper Routes (`/api/papers`)

All paper routes require authentication.

#### Get All Papers
```http
GET /api/papers
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 10,
  "papers": [...]
}

Note: Results are filtered by role:
- Students: Only their own papers
- Reviewers: Assigned papers + pending papers
- Admins: All papers
```

#### Get Paper by ID
```http
GET /api/papers/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "paper": {...}
}
```

#### Submit Paper (Student only)
```http
POST /api/papers
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Research Paper",
  "abstract": "This is the abstract of my paper...",
  "keywords": "research, science, technology",
  "pdfName": "paper.pdf"
}

Response:
{
  "success": true,
  "message": "Paper submitted successfully",
  "paper": {...}
}
```

#### Update Paper
```http
PUT /api/papers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "abstract": "Updated abstract..."
}

Response:
{
  "success": true,
  "message": "Paper updated successfully",
  "paper": {...}
}

Note: Only author can update, and only if status is "pending"
```

#### Delete Paper
```http
DELETE /api/papers/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Paper deleted successfully"
}

Note: Only author or admin can delete
```

#### Update Paper Status (Reviewer/Admin only)
```http
PUT /api/papers/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "comments": "Great work! Approved for publication."
}

Response:
{
  "success": true,
  "message": "Paper status updated successfully",
  "paper": {...}
}

Valid statuses: "pending", "under_review", "approved", "rejected"
```

#### Assign Paper to Reviewer (Admin only)
```http
PUT /api/papers/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "reviewerId": "reviewer-123"
}

Response:
{
  "success": true,
  "message": "Paper assigned to reviewer successfully",
  "paper": {...}
}
```

---

## 🔒 Role-Based Access Control

### Roles
- **student**: Can submit and manage their own papers
- **reviewer**: Can review assigned papers and pending papers
- **admin**: Full access to all resources

### Permission Matrix

| Action | Student | Reviewer | Admin |
|--------|---------|----------|-------|
| Register/Login | ✅ | ✅ | ✅ |
| View own papers | ✅ | ✅ | ✅ |
| Submit paper | ✅ | ❌ | ❌ |
| Update own paper | ✅ | ❌ | ❌ |
| Delete own paper | ✅ | ❌ | ✅ |
| View assigned papers | ❌ | ✅ | ✅ |
| Review papers | ❌ | ✅ | ✅ |
| View all papers | ❌ | ❌ | ✅ |
| Assign reviewers | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## ⚠️ Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔧 Development

### Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get papers (with token)
curl http://localhost:5000/api/papers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Database Migration

If you have existing users with plain-text passwords, run:

```bash
node migrate.js
```

This will hash all plain-text passwords using bcrypt.

---

## 📝 Notes

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days (configurable in .env)
- All timestamps are in ISO 8601 format
- Database is currently JSON-based (store.json)
- For production, consider migrating to MongoDB/PostgreSQL

