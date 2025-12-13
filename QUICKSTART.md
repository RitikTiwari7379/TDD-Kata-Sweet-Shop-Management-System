# Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js v16+ installed
- [ ] MongoDB v5.0+ installed and running
- [ ] Git installed

## 5-Minute Setup

### 1. Clone and Setup Backend (2 minutes)
```bash
# Clone the repository
git clone https://github.com/RitikTiwari7379/TDD-Kata-Sweet-Shop-Management-System.git
cd TDD-Kata-Sweet-Shop-Management-System

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env if needed (default settings work for local development)

# Start backend
npm run dev
```
Backend should now be running on http://localhost:5000

### 2. Setup Frontend (2 minutes)
```bash
# Open a new terminal window
cd frontend
npm install

# Start frontend
npm run dev
```
Frontend should now be running on http://localhost:5173

### 3. Create Admin User (1 minute)
```bash
# Open a new terminal
mongosh

# In MongoDB shell:
use sweet-shop
db.users.updateOne(
  { email: "YOUR_EMAIL@example.com" },
  { $set: { role: "admin" } }
)
exit
```

## First-Time Usage

1. **Register**: Go to http://localhost:5173 and click "Register here"
2. **Create Account**: Fill in your details and register
3. **Make Admin** (optional): Use the MongoDB command above to make yourself admin
4. **Login**: Login with your credentials
5. **Explore**: Browse, search, purchase sweets (or add them if you're admin)

## Testing

```bash
cd backend
npm test
```

All 52 tests should pass!

## Troubleshooting

**MongoDB Connection Error?**
- Make sure MongoDB is running: `brew services start mongodb-community`
- Check the MONGODB_URI in backend/.env

**Port Already in Use?**
- Backend: Change PORT in backend/.env
- Frontend: Change port in frontend/vite.config.js

**NPM Install Errors?**
- Try: `rm -rf node_modules package-lock.json && npm install`

## Project Structure Overview

```
backend/
  ├── src/
  │   ├── controllers/    # Request handlers
  │   ├── services/       # Business logic (TDD)
  │   ├── models/        # MongoDB schemas
  │   ├── routes/        # API routes
  │   ├── middleware/    # Auth middleware
  │   └── tests/         # Jest tests (52 tests)

frontend/
  ├── src/
  │   ├── components/    # React components
  │   └── services/      # API communication
```

## Key Features to Try

✅ User registration and login
✅ Browse all sweets
✅ Search by name, category, or price range
✅ Purchase sweets (decreases inventory)
✅ Admin: Add/Edit/Delete sweets
✅ Admin: Restock inventory

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the test report in `test-report.txt`
- Explore the API endpoints listed in README
- Consider deploying to platforms like Vercel (frontend) and Heroku (backend)

Happy coding! 🍬
