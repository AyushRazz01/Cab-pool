# Carpool Platform - Production MVP

A complete carpooling platform MVP built with modern web technologies.

## Features

### ✅ Implemented
- **Authentication**: Phone-based OTP login (mock)
- **Driver Features**:
  - Create and manage trips
  - View booking requests
  - Accept/reject bookings
  - Monitor seat availability

- **Rider Features**:
  - Search trips by origin, destination, date
  - View trip details and driver ratings
  - Book seats on available trips
  - View and manage bookings
  - Cancel bookings

- **Booking System**:
  - Real-time seat availability
  - Multiple booking statuses (PENDING, CONFIRMED, COMPLETED, CANCELLED)
  - Payment status tracking

- **Ratings & Reviews**:
  - 1-5 star rating system
  - User reviews and comments
  - Average rating calculation

- **Real-time Updates**:
  - WebSocket integration with Socket.io
  - Live seat availability updates
  - Booking status notifications

## Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Real-time**: Socket.io
- **Validation**: Custom validation utilities
- **Auth**: Mock OTP system

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client

## Project Structure

```
carpooling-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, error handling
│   │   ├── utils/           # Helpers & utilities
│   │   ├── app.ts           # Express app
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js pages
    │   ├── components/      # Reusable React components
    │   ├── hooks/          # Custom React hooks
    │   ├── lib/            # Utilities (API, socket, formatting)
    │   ├── store/          # Zustand state management
    │   └── types/          # TypeScript types
    ├── public/             # Static assets
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    └── .env.example
```

## Database Schema

### Models
- **User**: Profile info, ratings, roles
- **Trip**: Route details, driver info, seat availability
- **Booking**: Trip reservations, status, payment info
- **Review**: Ratings and comments for completed bookings

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Trips
- `POST /api/trips` - Create trip (driver only)
- `GET /api/trips/search` - Search trips
- `GET /api/trips/:tripId` - Get trip details
- `GET /api/trips/my-trips` - Get driver's trips
- `DELETE /api/trips/:tripId` - Cancel trip (driver only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get rider's bookings
- `GET /api/bookings/:bookingId` - Get booking details
- `GET /api/bookings/trip/:tripId` - Get trip bookings (driver only)
- `PATCH /api/bookings/:bookingId/confirm` - Confirm booking (driver only)
- `PATCH /api/bookings/:bookingId/cancel` - Cancel booking
- `PATCH /api/bookings/:bookingId/complete` - Complete booking (driver only)
- `POST /api/bookings/:bookingId/payment` - Process payment

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:reviewId` - Get review
- `GET /api/reviews/user/:userId` - Get user reviews

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 12+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/carpool_db"
   NODE_ENV="development"
   PORT=3001
   JWT_SECRET="your_jwt_secret_here"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Create database and run migrations**
   ```bash
   # Create PostgreSQL database
   createdb carpool_db

   # Run Prisma migrations
   npm run prisma:migrate
   ```

5. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Make sure it matches your backend URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Access
- **Frontend**: `http://localhost:3000`
- **API**: `http://localhost:3001/api`
- **Health Check**: `http://localhost:3001/health`

## Usage Guide

### For Drivers
1. Login with phone → Select "Driver" role → Verify OTP
2. Go to "Create Trip"
3. Fill in origin, destination, departure time, seats, and price
4. Submit to create trip
5. View bookings for your trips in "My Trips"

### For Riders
1. Login with phone → Select "Rider" role → Verify OTP
2. Go to "Search Rides"
3. Enter origin, destination, and date
4. Click "Book Now" on any trip
5. View all bookings in "My Bookings"
6. Cancel or complete bookings as needed

## Testing

### Mock OTP
- In development mode, the OTP is logged to console
- Format: 6-digit number
- Copy the OTP from backend logs for testing

### Sample Data
- Phone: Any 10-digit number
- OTP: Check backend console (development mode only)
- Coordinates: Auto-generated (mock)

## Development Notes

### Mock Implementations
- **OTP**: In-memory storage (5-minute expiry)
- **Coordinates**: Random generation for demonstration
- **Payments**: 95% success rate simulation
- **Ratings**: Calculated from all reviews

### Best Practices Implemented
- TypeScript for type safety
- Modular architecture (services, controllers, routes)
- Error handling middleware
- Input validation
- Environment-based configuration
- Responsive UI with Tailwind CSS
- Real-time updates with Socket.io
- State management with Zustand

## Deployment

### Backend Deployment (Example: Vercel/Railway)
```bash
# Build
npm run build

# Start
npm start
```

### Frontend Deployment (Example: Vercel)
```bash
# Build
npm run build

# Deploy
vercel --prod
```

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure Database exists: `createdb carpool_db`

### Port Already in Use
- Backend (3001): `lsof -ti:3001 | xargs kill -9`
- Frontend (3000): `lsof -ti:3000 | xargs kill -9`

### Module Not Found
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Regenerate Prisma: `npm run prisma:generate`

## Future Enhancements

- [ ] Real Google Maps integration
- [ ] Payment gateway integration (Stripe/UPI)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Referral system
- [ ] Insurance integration
- [ ] Advanced search filters
- [ ] Trip history analytics
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Driver verification
- [ ] Document upload

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## Support

For issues and questions, please create an issue in the repository.
