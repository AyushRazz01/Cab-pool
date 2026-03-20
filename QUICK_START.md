# Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Start PostgreSQL
Make sure PostgreSQL is running on your machine.

```bash
# macOS (if using Homebrew)
brew services start postgresql

# Windows (PostgreSQL should auto-start)
# Linux
sudo service postgresql start
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Create database
createdb carpool_db

# Run migrations
npm run prisma:migrate

# Start server
npm run dev
```

**Expected Output:**
```
🚗 Carpool API Server running on http://localhost:3001
📡 WebSocket server listening for real-time updates
🏥 Health check: http://localhost:3001/health
```

### Step 3: Setup Frontend

In a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development server
npm run dev
```

**Expected Output:**
```
Ready in XXXms
```

### Step 4: Open Application

- Go to `http://localhost:3000` in your browser
- You'll be redirected to login page

## 🧪 First Run - Testing

### Create a Driver Account

1. **Phone Number**: Any 10 digits (e.g., `1234567890`)
2. **Send OTP** button
3. **Check backend console** for the mock OTP (6 digits)
4. **Enter OTP** in the login form
5. **Name**: Enter your name
6. **Select "Driver"** role
7. **Click "Get Started"**

### Create a Trip

1. Click **"+ Create Trip"**
2. Fill in:
   - **Pickup**: Mumbai
   - **Destination**: Pune
   - **Date & Time**: Tomorrow at 8:00 AM
   - **Available Seats**: 4
   - **Price per Seat**: ₹500
3. Click **"Create Trip"**

### Test as Rider

1. **Open private/incognito window** (different browser session)
2. Go to `http://localhost:3000`
3. Login with **different phone number** (e.g., `0987654321`)
4. Select **"Rider"** role
5. Go to **"Search Rides"**
6. Search for trips (origin: Mumbai, destination: Pune)
7. Click **"Book Now"**
8. Check your **"My Bookings"** page

## 📊 API Testing with cURL

### Health Check
```bash
curl http://localhost:3001/health
```

### Send OTP
```bash
curl -X POST http://localhost:3001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890"}'
```

### Verify OTP and Login
```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"1234567890",
    "otp":"123456",
    "name":"John Doe",
    "role":"DRIVER"
  }'
```

### Search Trips
```bash
curl 'http://localhost:3001/api/trips/search?origin=Mumbai&destination=Pune'
```

### Create Booking (with token)
```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"tripId":"trip_id_here","seatsBooked":2}'
```

## 🐛 Troubleshooting

### "Port 3001 already in use"
```bash
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### "Port 3000 already in use"
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Error: connect ECONNREFUSED 127.0.0.1:5432"
PostgreSQL is not running. Start it:
```bash
# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Windows - should auto-start, check Services
```

### "Database does not exist"
```bash
createdb carpool_db
npm run prisma:migrate
```

### "Module not found" errors
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Cannot read property 'user' of undefined
Make sure you're logged in. Token might have expired:
1. Clear browser localStorage: `localStorage.clear()`
2. Refresh page
3. Login again

## 📝 Key Credentials for Testing

### Test Phone Numbers
- Driver: `1234567890`
- Rider: `9876543210`
- Another Rider: `5555555555`

### OTP
- Check backend console output for mock OTP
- Format: 6-digit number
- Expires in 5 minutes

## 🎯 Next Steps

1. **Explore the app**:
   - Create multiple trips as different drivers
   - Book rides as a rider
   - See real-time updates

2. **Check the code**:
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
   - Database: `backend/prisma/schema.prisma`

3. **Modify and experiment**:
   - Change UI colors in `frontend/tailwind.config.js`
   - Add new API endpoints in `backend/src/routes/`
   - Add new components in `frontend/src/components/`

4. **Deploy**:
   - Follow deployment guide in README.md

## 💡 Useful Commands

```bash
# Backend
npm run dev              # Start dev server
npm run build           # Build for production
npm run prisma:studio   # View database GUI
npm run prisma:migrate  # Create migrations

# Frontend
npm run dev             # Start dev server
npm run build          # Build for production
npm run lint           # Check for errors
```

## 🆘 Need Help?

- Check console logs (browser DevTools for frontend, terminal for backend)
- Verify all environment variables are set
- Make sure PostgreSQL is running
- Check if ports 3000 and 3001 are available
- Read the main README.md for more details

Happy coding! 🚗✨
