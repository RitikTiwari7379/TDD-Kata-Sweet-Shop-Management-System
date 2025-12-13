# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop, built with Node.js, Express, MongoDB, and React. This project demonstrates Test-Driven Development (TDD) practices with comprehensive test coverage.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)

## ✨ Features

### User Features
- **Authentication**: Secure user registration and login with JWT tokens
- **Browse Sweets**: View all available sweets with details
- **Search & Filter**: Search sweets by name, category, or price range
- **Purchase**: Buy sweets with real-time inventory updates
- **Purchase History**: Track your purchase history

### Admin Features
- **Add Sweets**: Create new sweet products
- **Update Sweets**: Modify existing sweet details
- **Delete Sweets**: Remove sweets from inventory
- **Restock**: Increase inventory quantities

## 🛠 Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Jest** - Testing framework
- **Supertest** - API testing
- **TypeScript** - Type safety

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool
- **CSS3** - Styling

## 📁 Project Structure

```
sweet-shop-tdd/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── migrate.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── sweetController.ts
│   │   │   └── inventoryController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Sweet.ts
│   │   │   └── Purchase.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── sweetRoutes.ts
│   │   │   └── inventoryRoutes.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── sweetService.ts
│   │   │   └── inventoryService.ts
│   │   ├── tests/
│   │   │   ├── authService.test.ts
│   │   │   ├── sweetService.test.ts
│   │   │   └── inventoryService.test.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SweetCard.jsx
│   │   │   ├── AddSweetModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── sweetService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your configuration**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sweet-shop
   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

5. **Start MongoDB**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # Or run directly
   mongod
   ```

6. **Run migrations (optional)**
   ```bash
   npm run migrate
   ```

7. **Start the backend server**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   Application will run on `http://localhost:5173`

### Creating an Admin User

To create an admin user, you can register a new user and then update their role in MongoDB:

```bash
# Connect to MongoDB
mongosh

# Use the sweet-shop database
use sweet-shop

# Update user role to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Sweets

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/sweets` | Get all sweets | Yes |
| GET | `/api/sweets/:id` | Get sweet by ID | Yes |
| GET | `/api/sweets/search` | Search sweets | Yes |
| POST | `/api/sweets` | Create sweet | Admin |
| PUT | `/api/sweets/:id` | Update sweet | Admin |
| DELETE | `/api/sweets/:id` | Delete sweet | Admin |

### Inventory

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/sweets/:id/purchase` | Purchase sweet | Yes |
| POST | `/api/sweets/:id/restock` | Restock sweet | Admin |
| GET | `/api/sweets/purchases` | Get purchase history | Yes |

## 🧪 Testing

This project follows Test-Driven Development (TDD) principles. All business logic was written tests-first.

### Run Backend Tests

```bash
cd backend
npm test
```

### Test Coverage

The backend has comprehensive test coverage:

```bash
npm test -- --coverage
```

Current coverage:
- **Statements**: 95%+
- **Branches**: 86%+
- **Functions**: 100%
- **Lines**: 94%+

### Test Structure

- **authService.test.ts**: 12 tests covering user registration, login, and JWT generation
- **sweetService.test.ts**: 23 tests covering CRUD operations and search functionality
- **inventoryService.test.ts**: 17 tests covering purchase, restock, and purchase history

Total: **52 passing tests**

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Register Page
![Register Page](screenshots/register.png)

### Dashboard - Sweet Listing
![Dashboard](screenshots/dashboard.png)

### Search Functionality
![Search](screenshots/search.png)

### Admin - Add Sweet Modal
![Add Sweet](screenshots/add-sweet.png)

### Purchase Confirmation
![Purchase](screenshots/purchase.png)

## 🤖 My AI Usage

Throughout this project, I leveraged AI tools to enhance my development workflow and maintain high code quality. Here's how I used AI assistance:

### GitHub Copilot

**Code Generation & Boilerplate**
- Used Copilot to generate initial boilerplate code for Express routes and controllers
- Assisted in creating TypeScript interfaces and type definitions for models
- Helped scaffold test file structures following Jest conventions

**Test Cases**
- Copilot suggested edge cases for unit tests that I might have missed
- Generated test data and mock objects for testing scenarios
- Assisted in writing comprehensive test descriptions

**Code Completion**
- Auto-completed repetitive patterns in service layer implementations
- Suggested error handling patterns and validation logic
- Provided CSS styling suggestions for responsive design

### How It Impacted My Workflow

**Increased Productivity**
- Reduced time spent on repetitive boilerplate code by approximately 30%
- Allowed me to focus more on business logic and architecture decisions
- Faster iteration on UI components with CSS suggestions

**Improved Code Quality**
- AI suggestions often reminded me of edge cases in testing
- Helped maintain consistent code style across the project
- Suggested better variable names and function signatures

**Learning Enhancement**
- Discovered new TypeScript patterns and best practices
- Learned about MongoDB query optimization techniques
- Improved my understanding of JWT authentication implementation

### Specific Examples

1. **Test-Driven Development**: When writing tests first, Copilot helped generate comprehensive test cases covering both happy paths and error scenarios. However, I always reviewed and refined these suggestions to match project requirements.

2. **MongoDB Schema Design**: While I designed the schema structure myself, Copilot assisted in adding proper validation rules and index configurations.

3. **React Component Structure**: Copilot suggested component lifecycle patterns and state management approaches, which I adapted to fit the application's needs.

4. **Error Handling**: AI helped establish consistent error handling patterns across controllers and services, ensuring robust API responses.

### My Approach to AI Usage

- **AI as Assistant, Not Author**: I used AI to accelerate development, but all architectural decisions and business logic came from my understanding of requirements
- **Critical Review**: Every AI suggestion was reviewed and often modified to better fit the project context
- **Testing Validation**: AI-generated code was always validated through comprehensive testing
- **Documentation**: Ensured all AI-assisted code was properly documented and understandable

## 🎯 Development Process

### Red-Green-Refactor Pattern

This project strictly followed TDD methodology:

1. **Red**: Write failing tests first
2. **Green**: Write minimal code to pass tests
3. **Refactor**: Improve code while keeping tests green

Commit history demonstrates this pattern with clear test-first commits followed by implementation commits.

### Clean Code Practices

- **SOLID Principles**: Services follow single responsibility principle
- **DRY**: Reusable utility functions and middleware
- **Clear Naming**: Descriptive variable and function names
- **Error Handling**: Comprehensive error handling throughout
- **Type Safety**: TypeScript for compile-time type checking

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Ritik Tiwari**

- GitHub: [@RitikTiwari7379](https://github.com/RitikTiwari7379)

## 🙏 Acknowledgments

- MongoDB for excellent documentation
- React team for the amazing framework
- Jest team for the testing framework
- AI tools (GitHub Copilot) for development assistance

---

**Note**: This project was created as part of a TDD Kata exercise to demonstrate full-stack development skills, testing practices, and modern development workflows.
