# Developer Checklist

## 📋 Pre-Development Setup

- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Postman or similar API testing tool

## 🔧 Backend Setup

### Installation
- [ ] Navigate to backend folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Update DATABASE_URL with your PostgreSQL credentials
- [ ] Create database: `createdb carpool_db`
- [ ] Run migrations: `npm run prisma:migrate`
- [ ] Generate Prisma types: `npm run prisma:generate`
- [ ] Verify server starts: `npm run dev`

### Verification
- [ ] Backend runs on http://localhost:3001
- [ ] Health check works: `curl http://localhost:3001/health`
- [ ] No console errors

## 🎨 Frontend Setup

### Installation
- [ ] Navigate to frontend folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Verify API URLs point to backend
- [ ] Start dev server: `npm run dev`

### Verification
- [ ] Frontend runs on http://localhost:3000
- [ ] Page loads without errors
- [ ] Redirected to /login

## 🧪 Testing - Core Flows

### Authentication
- [ ] Send OTP works (check console for code)
- [ ] OTP validation works
- [ ] New user creation works
- [ ] Login with existing user works
- [ ] Token persists in localStorage
- [ ] Logout clears token

### Driver Flow
- [ ] Can create trip
- [ ] Trip appears in "My Trips"
- [ ] Can view trip details
- [ ] Can see bookings for trip
- [ ] Can confirm booking
- [ ] Can complete booking

### Rider Flow
- [ ] Can search trips
- [ ] Search filters work (origin, destination, date)
- [ ] Trip list displays correctly
- [ ] Can view trip details
- [ ] Can book seat
- [ ] Booking appears in "My Bookings"
- [ ] Can cancel booking
- [ ] Seat count decreases when booking

### Real-time Features
- [ ] Open two browser windows
- [ ] Book in one window
- [ ] Verify seat count updates in other window (may need refresh)
- [ ] Verify no console errors

### UI/UX
- [ ] Responsive on mobile
- [ ] Loading states show
- [ ] Error messages display
- [ ] Buttons disabled when loading
- [ ] Navigation works
- [ ] Header shows correct user info

## 📊 Database Verification

- [ ] Database created successfully
- [ ] Tables exist:
  - [ ] `user`
  - [ ] `trip`
  - [ ] `booking`
  - [ ] `review`
- [ ] Relationships defined
- [ ] Constraints working
- [ ] Indexes created

## 🔐 Security Review

- [ ] OTP expires in 5 minutes
- [ ] Tokens expire after 30 days
- [ ] CORS configured
- [ ] Sensitive data not logged
- [ ] Input validation working
- [ ] Error messages don't leak info
- [ ] No hardcoded secrets

## 📱 Mobile Testing

- [ ] Test on iPhone
- [ ] Test on Android
- [ ] Responsive layout works
- [ ] Touch interactions responsive
- [ ] Readability on small screens
- [ ] No horizontal scroll

## ⚡ Performance Checks

- [ ] Page loads < 3 seconds
- [ ] Search results < 1 second
- [ ] No memory leaks
- [ ] No console warnings
- [ ] Images optimized
- [ ] CSS and JS minified (production)

## 📖 Documentation

- [ ] README.md reviewed
- [ ] QUICK_START.md verified
- [ ] API_DOCUMENTATION.md complete
- [ ] PROJECT_SUMMARY.md accurate
- [ ] Code comments added
- [ ] Complex functions documented
- [ ] API responses documented
- [ ] Error codes documented

## 🐛 Debugging & Testing

### Backend
- [ ] Test all API endpoints with Postman/cURL
- [ ] Verify status codes
- [ ] Check error messages
- [ ] Validate request/response formats
- [ ] Test with invalid inputs
- [ ] Test authentication (with/without token)
- [ ] Check database queries
- [ ] Verify transactions

### Frontend
- [ ] Browser DevTools console clean
- [ ] Network requests successful
- [ ] State management working
- [ ] No warnings about DOM
- [ ] LocalStorage working
- [ ] No broken links

## 🚀 Ready for Deployment

### Pre-deployment Checklist
- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] Code reviewed
- [ ] Comments added
- [ ] Sensitive info removed from code
- [ ] Production build tested locally

### Backend Deployment
- [ ] Build successful: `npm run build`
- [ ] Dependencies listed in package.json
- [ ] tsconfig.json configured
- [ ] .env.example has all variables
- [ ] Database migrations tested
- [ ] API tested on staging

### Frontend Deployment
- [ ] Build successful: `npm run build`
- [ ] Environment variables set in deploy config
- [ ] API URL points to production backend
- [ ] No errors in build logs
- [ ] Performance acceptable

## 📋 Post-Launch

- [ ] Monitor backend logs
- [ ] Monitor database performance
- [ ] Check user feedback
- [ ] Verify all features work
- [ ] Monitor error rates
- [ ] Check page load times
- [ ] Review user sessions
- [ ] Plan next features
- [ ] Set up monitoring alerts
- [ ] Schedule backups

## 🔄 Maintenance Tasks

### Daily
- [ ] Check error logs
- [ ] Verify app is up
- [ ] Test critical flows

### Weekly
- [ ] Review performance metrics
- [ ] Check disk space
- [ ] Review unusual activity
- [ ] Backup database

### Monthly
- [ ] Update dependencies (non-breaking only)
- [ ] Security audit
- [ ] Performance review
- [ ] Plan improvements
- [ ] Review user feedback

## 🎯 Common Tasks

### Adding a New Feature
1. [ ] Create database migration (if needed)
2. [ ] Update Prisma schema
3. [ ] Create API service
4. [ ] Create API controller
5. [ ] Create API routes
6. [ ] Create React component
7. [ ] Create React page
8. [ ] Add to navigation
9. [ ] Update documentation
10. [ ] Test thoroughly

### Fixing a Bug
1. [ ] Reproduce bug
2. [ ] Find root cause
3. [ ] Write fix
4. [ ] Test fix locally
5. [ ] Verify no regression
6. [ ] Update documentation
7. [ ] Deploy fix
8. [ ] Monitor in production

### Optimizing Performance
1. [ ] Identify bottleneck
2. [ ] Add database index (if needed)
3. [ ] Optimize query
4. [ ] Add caching
5. [ ] Test performance
6. [ ] Monitor impact

## ⚠️ Common Mistakes to Avoid

- [ ] ❌ Don't commit .env files
- [ ] ❌ Don't use hardcoded secrets
- [ ] ❌ Don't skip input validation
- [ ] ❌ Don't forget migration tests
- [ ] ❌ Don't ship console.log statements
- [ ] ❌ Don't forget error handling
- [ ] ❌ Don't trust user input
- [ ] ❌ Don't miss CORS configuration
- [ ] ❌ Don't forget to restart services
- [ ] ❌ Don't skip database backups

## 📞 Quick References

### Important Files
- **Backend config**: `backend/.env`, `backend/src/index.ts`
- **Frontend config**: `frontend/.env.local`, `frontend/src/lib/api.ts`
- **Database schema**: `backend/prisma/schema.prisma`
- **API routes**: `backend/src/routes/`
- **Frontend pages**: `frontend/src/app/`

### Commands
```bash
# Install
npm install

# Development
npm run dev

# Database
npm run prisma:migrate
npm run prisma:studio

# Build
npm run build

# Production
npm start
```

### Environment Variables
- **Backend**: DATABASE_URL, NODE_ENV, PORT, JWT_SECRET, FRONTEND_URL
- **Frontend**: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SOCKET_URL

### Default Ports
- Backend: 3001
- Frontend: 3000
- PostgreSQL: 5432

## ✅ Sign Off

- [ ] Developer: _____________ Date: ___/___/______
- [ ] Tested by: _____________ Date: ___/___/______
- [ ] Approved by: _____________ Date: ___/___/______

---

**You're ready to launch! 🚀**

If you encounter any issues, check QUICK_START.md for troubleshooting.
