# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token_from_login>
```

---

## Endpoints

### Authentication

#### Send OTP
- **Endpoint**: `POST /auth/send-otp`
- **Auth**: None
- **Body**:
  ```json
  {
    "phone": "1234567890"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully",
    "mockOTP": "123456"
  }
  ```

#### Verify OTP
- **Endpoint**: `POST /auth/verify-otp`
- **Auth**: None
- **Body**:
  ```json
  {
    "phone": "1234567890",
    "otp": "123456",
    "name": "John Doe",
    "role": "DRIVER"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJ...",
    "user": {
      "id": "user_123",
      "phone": "1234567890",
      "name": "John Doe",
      "role": "DRIVER"
    }
  }
  ```

#### Get Profile
- **Endpoint**: `GET /auth/profile`
- **Auth**: Required
- **Response**: User object with all details

#### Update Profile
- **Endpoint**: `PUT /auth/profile`
- **Auth**: Required
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "avatar": "https://example.com/avatar.jpg"
  }
  ```
- **Response**: Updated user object

---

### Trips

#### Create Trip
- **Endpoint**: `POST /trips`
- **Auth**: Required (Driver only)
- **Body**:
  ```json
  {
    "origin": "Mumbai",
    "destination": "Pune",
    "originLat": 19.0760,
    "originLng": 72.8777,
    "destLat": 18.5204,
    "destLng": 73.8567,
    "departureTime": "2024-03-25T08:00:00Z",
    "seatsAvailable": 4,
    "pricePerSeat": 500,
    "description": "AC, Non-smoking"
  }
  ```
- **Response**:
  ```json
  {
    "id": "trip_123",
    "driverId": "user_123",
    "driver": { /* user object */ },
    "origin": "Mumbai",
    "destination": "Pune",
    "departureTime": "2024-03-25T08:00:00Z",
    "seatsAvailable": 4,
    "seatsBooked": 0,
    "pricePerSeat": 500,
    "status": "ACTIVE"
  }
  ```

#### Search Trips
- **Endpoint**: `GET /trips/search`
- **Auth**: None
- **Query Parameters**:
  - `origin` (optional): string
  - `destination` (optional): string
  - `date` (optional): YYYY-MM-DD
  - `minPrice` (optional): number
  - `maxPrice` (optional): number
- **Example**: `GET /trips/search?origin=Mumbai&destination=Pune&date=2024-03-25`
- **Response**: Array of trip objects

#### Get Trip Details
- **Endpoint**: `GET /trips/:tripId`
- **Auth**: None
- **Response**: Single trip object with driver and bookings

#### Get My Trips
- **Endpoint**: `GET /trips/my-trips`
- **Auth**: Required
- **Response**: Array of trips created by the user

#### Cancel Trip
- **Endpoint**: `DELETE /trips/:tripId`
- **Auth**: Required
- **Response**: Updated trip with status CANCELLED

---

### Bookings

#### Create Booking
- **Endpoint**: `POST /bookings`
- **Auth**: Required (Rider)
- **Body**:
  ```json
  {
    "tripId": "trip_123",
    "seatsBooked": 2
  }
  ```
- **Response**:
  ```json
  {
    "id": "booking_123",
    "tripId": "trip_123",
    "riderId": "user_456",
    "seatsBooked": 2,
    "status": "PENDING",
    "totalPrice": 1000,
    "paymentStatus": "PENDING"
  }
  ```

#### Get My Bookings
- **Endpoint**: `GET /bookings/my-bookings`
- **Auth**: Required
- **Response**: Array of booking objects with trip and driver details

#### Get Booking Details
- **Endpoint**: `GET /bookings/:bookingId`
- **Auth**: None
- **Response**: Single booking object

#### Get Trip Bookings (Driver)
- **Endpoint**: `GET /bookings/trip/:tripId`
- **Auth**: Required
- **Response**: Array of bookings for the trip

#### Confirm Booking
- **Endpoint**: `PATCH /bookings/:bookingId/confirm`
- **Auth**: Required (Driver only)
- **Response**: Updated booking with status CONFIRMED

#### Cancel Booking
- **Endpoint**: `PATCH /bookings/:bookingId/cancel`
- **Auth**: Required
- **Body**:
  ```json
  {
    "userRole": "RIDER"
  }
  ```
- **Response**: Updated booking with status CANCELLED

#### Complete Booking
- **Endpoint**: `PATCH /bookings/:bookingId/complete`
- **Auth**: Required (Driver only)
- **Response**: Updated booking with status COMPLETED

#### Process Payment
- **Endpoint**: `POST /bookings/:bookingId/payment`
- **Auth**: Required
- **Response**:
  ```json
  {
    "id": "booking_123",
    "paymentStatus": "COMPLETED"
  }
  ```

---

### Reviews

#### Create Review
- **Endpoint**: `POST /reviews`
- **Auth**: Required
- **Body**:
  ```json
  {
    "bookingId": "booking_123",
    "rating": 5,
    "comment": "Great ride, friendly driver!"
  }
  ```
- **Response**:
  ```json
  {
    "id": "review_123",
    "bookingId": "booking_123",
    "reviewerId": "user_456",
    "revieweeId": "user_123",
    "rating": 5,
    "comment": "Great ride, friendly driver!",
    "createdAt": "2024-03-25T10:00:00Z"
  }
  ```

#### Get Reviews for User
- **Endpoint**: `GET /reviews/user/:userId`
- **Auth**: None
- **Response**: Array of review objects

#### Get Review Details
- **Endpoint**: `GET /reviews/:reviewId`
- **Auth**: None
- **Response**: Single review object

---

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (permission denied)
- **404**: Not Found
- **500**: Server Error

## Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

## Rate Limits

Currently no rate limiting is implemented. For production, implement:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## WebSocket Events

### Connection
```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Join User Room
```javascript
socket.emit('join-user-room', userId);
```

### Join Trip Room
```javascript
socket.emit('join-trip-room', tripId);
```

### Listen for Seat Updates
```javascript
socket.on('seats-updated', (data) => {
  // { tripId, seatsBooked, seatsAvailable, seatsRemaining }
});
```

### Listen for Booking Status Changes
```javascript
socket.on('booking-status-changed', (data) => {
  // { bookingId, tripId, status, seatsBooked }
});
```

### Listen for Notifications
```javascript
socket.on('notification', (notification) => {
  // Handle notification
});
```

---

## Example Usage

### Complete Flow - Book a Ride

**1. Send OTP**
```bash
curl -X POST http://localhost:3001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'
```

**2. Verify OTP**
```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"9876543210",
    "otp":"123456",
    "name":"Jane Doe",
    "role":"RIDER"
  }'
```
Response includes `token` - save this for authenticated requests.

**3. Search Trips**
```bash
curl 'http://localhost:3001/api/trips/search?origin=Mumbai&destination=Pune'
```

**4. Get Trip Details**
```bash
curl http://localhost:3001/api/trips/TRIP_ID_FROM_SEARCH
```

**5. Book a Seat**
```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tripId":"TRIP_ID",
    "seatsBooked":1
  }'
```

**6. View Your Bookings**
```bash
curl http://localhost:3001/api/bookings/my-bookings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing Notes

- Test phone numbers can be any 10 digits
- OTP is logged in backend console (6 digits)
- Coordinates are randomly generated
- Payment success rate is 95%
- All timestamps are in ISO 8601 format

---

## Version
- API Version: 1.0.0
- Last Updated: March 2024
