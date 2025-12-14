# 🍬 Sweet Shop Management System

**TDD Kata Project**: A full-stack web application for managing a sweet shop, built with Node.js, Express, MongoDB, and React. This project demonstrates Test-Driven Development (TDD) practices with comprehensive test coverage.

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Testing & Test Report](#testing--test-report)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)

## 📖 Overview

A full-stack **Sweet Shop Management System** built following **Test-Driven Development (TDD)** principles as part of a coding kata exercise. This application allows users to browse, search, and purchase sweets, while administrators can manage inventory through a complete CRUD interface.

### Key Features
- 🔐 **Secure Authentication**: JWT-based user registration and login
- 🍭 **Sweet Management**: Browse, search, and filter sweets by name, category, or price (per kg)
- 🛒 **Purchase System**: Buy sweets by weight (kg) with real-time inventory updates
- 👨‍💼 **Admin Dashboard**: Complete CRUD operations for inventory management
- ⚖️ **Weight-Based Pricing**: All sweets priced and sold per kilogram
- ✅ **Test-Driven**: 52 comprehensive tests with 95%+ coverage

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
- **Tailwind CSS** - Styling

## 🔌 API Endpoints

All endpoints follow RESTful conventions as specified in the assignment:

### Authentication Endpoints
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login and receive JWT token

### Sweet Management Endpoints (Protected)
- **GET** `/api/sweets` - Get all sweets (requires authentication)
- **GET** `/api/sweets/search` - Search sweets by name, category, or price range (requires authentication)
- **GET** `/api/sweets/:id` - Get single sweet by ID (requires authentication)
- **POST** `/api/sweets` - Add new sweet (**Admin only**)
- **PUT** `/api/sweets/:id` - Update sweet details (**Admin only**)
- **DELETE** `/api/sweets/:id` - Delete sweet (**Admin only**)

### Inventory Endpoints (Protected)
- **POST** `/api/sweets/:id/purchase` - Purchase sweet (decreases quantity)
- **POST** `/api/sweets/:id/restock` - Restock sweet (**Admin only**, increases quantity)
- **GET** `/api/sweets/purchases` - Get user's purchase history

**Note**: All protected endpoints require a valid JWT token in the `Authorization` header as `Bearer <token>`.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** (Free tier works) - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Git** - [Download](https://git-scm.com/)

### Quick Setup (5 Minutes)

#### 1. Clone the Repository
```bash
git clone https://github.com/RitikTiwari7379/TDD-Kata-Sweet-Shop-Management-System.git
cd TDD-Kata-Sweet-Shop-Management-System
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

**Configure your `.env` file:**

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/sweet-shop?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

**MongoDB Connection Options:**

**Option A: MongoDB Atlas (Recommended - Cloud)**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with password
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Get your connection string from Atlas dashboard
5. Replace `your-username`, `your-password`, and cluster URL in `.env`
6. Add `/sweet-shop` database name after `.net/`

**Option B: Local MongoDB**
```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Use local connection string in .env:
MONGODB_URI=mongodb://localhost:27017/sweet-shop
```

**Start the backend server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5001` ✅

#### 3. Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173` ✅

#### 4. Seed Sample Data (Recommended)

Populate your database with sample sweets for immediate testing:

```bash
cd backend
npm run seed
```

This will add 8 sample sweets with images to your database. ✅

**Sample sweets include:**
- Chocolate Truffle (25 kg @ ₹299/kg)
- Strawberry Gummy Bears (50 kg @ ₹149/kg)
- Vanilla Fudge (15 kg @ ₹349/kg)
- Lemon Drops (100 kg @ ₹99/kg)
- And more...

**Note:** All quantities are in kilograms (kg). When you purchase or restock, you're dealing with weight in kg.

#### 5. Create Admin User

After registering your first user, make them an admin:

```bash
# Connect to MongoDB
mongosh "your-mongodb-connection-string"

# Or if using local MongoDB:
mongosh

# Switch to database
use sweet-shop

# Update your user to admin role
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

exit
```

### First-Time Usage

1. Open `http://localhost:5173` in your browser
2. Click "Register here" to create an account
3. Fill in your details and register
4. (Optional) Make yourself admin using the MongoDB command above
5. Login with your credentials
6. Start exploring: Browse, search, and purchase sweets!
7. If you're admin: Add, update, or delete sweets

### Troubleshooting

**MongoDB Connection Error?**
- Verify your MongoDB Atlas connection string is correct
- Check if your IP is whitelisted in Atlas Network Access
- Ensure database user credentials are correct
- For local MongoDB: Run `brew services list` to check if MongoDB is running

**Port Already in Use?**
- Backend: Change `PORT` in `backend/.env` (e.g., to 5002)
- Frontend: Change port in `frontend/vite.config.js`

**NPM Install Errors?**
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Try using Node.js v16 or v18

## 🧪 Testing & Test Report

This project was built following **Test-Driven Development (TDD)** principles with a "Red-Green-Refactor" approach. All business logic was written tests-first, ensuring high code quality and reliability.

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage
```

### Test Coverage Report

The backend has **comprehensive test coverage** across all services:

| Metric | Coverage |
|--------|----------|
| **Statements** | 95.24% |
| **Branches** | 86.67% |
| **Functions** | 100% |
| **Lines** | 94.87% |

**Detailed Coverage Report:** View the full HTML report at `backend/coverage/lcov-report/index.html`

### Test Suite Breakdown

| Test File | Tests | Coverage |
|-----------|-------|----------|
| **authService.test.ts** | 12 tests | User registration, login, JWT generation |
| **sweetService.test.ts** | 23 tests | CRUD operations, search, filtering |
| **inventoryService.test.ts** | 17 tests | Purchase, restock, purchase history |

**Total: 52 passing tests** ✅

### TDD Approach - Red-Green-Refactor Cycle

This project strictly followed **Test-Driven Development (TDD)** principles:

1. **🔴 RED**: Write a failing test first
   - Example: Wrote test for user registration before implementing the service
   - Tests in `src/tests/` directory were created before implementation

2. **🟢 GREEN**: Write minimal code to make the test pass
   - Implemented services (`authService.ts`, `sweetService.ts`, `inventoryService.ts`)
   - Each function written to satisfy specific test cases

3. **♻️ REFACTOR**: Improve code while keeping tests green
   - Refactored validation logic, error handling, and database queries
   - All 52 tests remain passing after refactoring

**Evidence in Git History:**
- Initial commit: "feat: Initialize backend project with TypeScript and testing setup"
- Test files were created alongside implementation
- Commit messages show incremental feature development
- Each feature has corresponding test coverage

**View Test Suite:**
```bash
cd backend
npm test -- --verbose
```

You'll see the complete test suite covering:
- ✅ Authentication (registration, login, JWT)
- ✅ Sweet CRUD operations (create, read, update, delete)
- ✅ Search and filtering
- ✅ Purchase and inventory management
- ✅ Edge cases and error scenarios

---

## 📸 Screenshots

> **Note**: To generate screenshots for this section, run both backend and frontend servers, then capture the following views:

### 1. Login Page
*Show the login form with email and password fields*

### 2. Register Page
*Show the registration form with name, email, and password fields*

### 3. User Dashboard (Non-Admin View)
*Show the main dashboard with sweet cards, search functionality, and purchase options*

### 4. Search Results
*Demonstrate the search functionality by filtering sweets by name, category, or price*

### 5. Admin Dashboard
*Show admin view with Add Sweet button and admin controls (Edit, Delete, Restock) on sweet cards*

### 6. Add/Edit Sweet Modal
*Show the modal form for adding or editing a sweet with all fields (name, category, price, quantity, etc.)*

**Instructions to Take Screenshots:**
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Seed database: `cd backend && npm run seed`
4. Visit `http://localhost:5173`
5. Register a user, make them admin in MongoDB, then login
6. Capture screenshots of each view listed above
7. Save images in `screenshots/` directory

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

### AI Co-authorship Transparency

**Assignment Requirement Note**: The assignment requires adding AI as a co-author using git commit trailers (e.g., `Co-authored-by: AI Tool <ai@example.com>`). 

**My Approach**: Throughout this project, I used GitHub Copilot extensively as documented above. However, I did not add explicit `Co-authored-by` trailers to my commits initially. This section serves to transparently acknowledge that AI assistance was used throughout the development process.

**Where AI Significantly Contributed:**
- Test boilerplate generation in all `*.test.ts` files
- Express route handlers and controller structures
- TypeScript interface definitions for models
- React component scaffolding and state management patterns
- CSS/Tailwind utility class suggestions
- Error handling patterns across services

**Areas of Independent Work:**
- Overall application architecture and design decisions
- Business logic implementation and validation rules
- Database schema design and relationships
- Authentication strategy and JWT implementation
- Test case design and edge case identification
- API endpoint structure and REST conventions
- Frontend routing and component composition

**Reflection**: In future projects, I will use proper git commit co-authorship trailers to maintain transparency about AI contributions from the start of development.

---

## 👤 Author

**Ritik Tiwari**
- GitHub: [@RitikTiwari7379](https://github.com/RitikTiwari7379)

---

*This project was created as part of a TDD Kata exercise to demonstrate full-stack development skills, test-driven development practices, and modern development workflows including responsible AI tool usage.*
