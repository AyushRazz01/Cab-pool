# Production Deployment Guide

## Overview

This guide covers deploying the Carpool MVP to production environments.

---

## Prerequisites

- GitHub repository
- PostgreSQL database (managed service)
- Backend hosting (Render, Railway, or Heroku)
- Frontend hosting (Vercel, Netlify)
- Domain name(s) (optional)

---

## 1. Database Setup

### PostgreSQL on Cloud

#### Option A: Render
1. Go to [render.com](https://render.com)
2. Click "New +" → PostgreSQL
3. Name: `carpool-db`
4. Region: Close to users
5. David Plan or higher recommended
6. Create database
7. Copy connection string

#### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add → PostgreSQL
4. Copy DATABASE_URL from Variables

#### Option C: AWS RDS
1. Go to AWS RDS
2. Create PostgreSQL instance
3. Set security groups
4. Copy endpoint

### Prepare Database
```bash
# From backend directory, set DATABASE_URL to prod database
export DATABASE_URL="postgresql://user:password@host:port/carpool_db"

# Run migrations
npm run prisma:migrate -- --name init

# Generate Prisma client
npm run prisma:generate
```

---

## 2. Backend Deployment

### Option A: Render

**Setup:**
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Runtime: Node
5. Build/Start commands:
   ```
   Build: npm install && npm run prisma:generate && npm run build
   Start: npm start
   ```

**Environment Variables:**
```
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=<generate-strong-secret>
```

**Deploy:**
- Click Deploy
- Wait for build completion

### Option B: Railway

**Setup:**
1. Go to [railway.app](https://railway.app)
2. New project → Deploy from GitHub
3. Select repository
4. Add environment variables:
   ```
   DATABASE_URL=from-postgresql-service
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://yourdomain.com
   JWT_SECRET=<strong-secret>
   ```

**Deploy:**
- Push to main branch
- Railway auto-deploys

### Option C: Heroku (Legacy)

```bash
# Login to Heroku
heroku login

# Create app
heroku create carpool-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://yourdomain.com
heroku config:set JWT_SECRET=<strong-secret>

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate
```

### Building for Production

```bash
cd backend

# Install dependencies
npm install --production

# Build
npm run build

# Test build locally
npm run start
```

---

## 3. Frontend Deployment

### Vercel (Recommended)

**Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Import project from GitHub
3. Framework: Next.js (auto-detected)
4. Build settings (auto-detected)
5. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
   ```

**Deploy:**
1. Click Deploy
2. Wait for build
3. Get deployment URL
4. Optional: Add custom domain

### Netlify

**Setup:**
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
   ```

**Deploy:**
- Trigger deploy
- Setup custom domain

### Manual Deployment

```bash
cd frontend

# Build
npm run build

# Generate static export (optional)
# Add "output: 'export'" to next.config.js

# Upload dist folder to any static host
# (AWS S3 + CloudFront, Azure Static Web Apps, etc.)
```

---

## 4. Database Migrations in Production

```bash
# Run migrations on production database
export DATABASE_URL="production-connection-string"
npm run prisma:migrate -- --name "your-migration-name"

# If something goes wrong, rollback
npm run prisma:migrate resolve --rolled-back
```

---

## 5. Domain Setup

### DNS Configuration

#### For Render Backend
```
Type: CNAME
Name: api
Value: carpool-api.onrender.com
TTL: 3600
```

#### For Vercel Frontend
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

---

## 6. SSL/TLS Certificates

- **Render**: Auto-generated (free)
- **Railway**: Auto-generated (free)
- **Vercel**: Auto-generated (free)
- **Heroku**: Auto-generated (free)

---

## 7. Environment Configuration

### Backend (.env in production)

```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/carpool_db"

# Server
NODE_ENV="production"
PORT="3001"

# Frontend URL (for CORS)
FRONTEND_URL="https://yourdomain.com"

# Authentication
JWT_SECRET="<generate-with: openssl rand -hex 32>"

# Optional: Third-party services
# STRIPE_KEY=""
# TWILIO_ACCOUNT_SID=""
```

### Frontend (.env.production in deployment)

```env
NEXT_PUBLIC_API_URL="https://api.yourdomain.com/api"
NEXT_PUBLIC_SOCKET_URL="https://api.yourdomain.com"
```

---

## 8. Monitoring & Logs

### Render
- Go to service dashboard
- View "Logs" tab
- Set up alerts

### Railway
- View logs in project dashboard
- Set alert notifications

### Vercel
- View deployment logs
- Check Analytics
- Monitor speed insights

### Heroku
```bash
heroku logs --tail
heroku logs --tail -p web
```

---

## 9. Database Backups

### Manual Backup
```bash
# PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Automated Backups
- **Render**: Premium plans include backups
- **Railway**: Point-in-time recovery available
- **AWS RDS**: Automatic daily backups (35 days)

---

## 10. Performance Optimization

### Backend
```bash
# Enable compression
npm install compression

# Use PM2 for process management
npm install -g pm2
pm2 start "npm start"
```

### Frontend
```javascript
// next.config.js
module.exports = {
  compress: true,
  optimizeFonts: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

### Database
```sql
-- Create indexes
CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_bookings_rider_id ON bookings(rider_id);
CREATE INDEX idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
```

---

## 11. Security Checklist

- [ ] Change default passwords/secrets
- [ ] Enable HTTPS (auto-enabled on major hosts)
- [ ] Set CORS properly
- [ ] Validate all inputs
- [ ] Hide sensitive environment variables
- [ ] Enable database backups
- [ ] Set up monitoring/alerting
- [ ] Use strong JWT secret
- [ ] Implement rate limiting
- [ ] Enable CSRF protection

---

## 12. Scaling for Production

### Horizontal Scaling
```bash
# Render: Upgrade plan
# Railway: Add more instances
# Heroku: Add dynos
```

### Caching
```bash
npm install redis
# Add Redis caching layer for frequently accessed data
```

### CDN
- Vercel: Automatic
- Render: Use Cloudflare
- Railway: Use Vercel Edge Functions

### Load Balancing
- Use managed load balancers from cloud provider
- Or implement with Nginx

---

## 13. Continuous Integration/Deployment

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          # Your deployment command
          
      - name: Deploy Frontend
        run: |
          # Your deployment command
```

---

## 14. Rollback Procedures

### If Backend Deployment Fails
```bash
# Render/Railway: Use previous deployment
# Heroku: heroku releases:rollback

heroku releases:rollback -v v<version>
```

### If Database Migration Fails
```bash
npm run prisma:migrate resolve --rolled-back
```

### If Frontend Build Fails
```bash
# Vercel: Auto-rollback to previous    # Netlify: Trigger previous deployment
```

---

## 15. Cost Estimation (Monthly)

### Minimal Setup
- PostgreSQL (Render): ~$20
- Backend (Render): ~$15
- Frontend (Vercel): Free
- **Total: ~$35/month**

### Standard Setup
- PostgreSQL (AWS RDS): ~$50
- Backend (Railway): ~$20
- Frontend (Vercel): Free
- Domain: ~$12
- **Total: ~$82/month**

### Enterprise Setup
- PostgreSQL (AWS RDS): ~$200+
- Backend (Multiple instances): ~$100+
- Frontend + CDN: ~$50+
- Domain: ~$12
- Monitoring: ~$50+
- **Total: ~$412+/month**

---

## 16. Post-Deployment Testing

1. **Test Authentication**
   ```bash
   curl -X POST https://api.yourdomain.com/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phone":"1234567890"}'
   ```

2. **Test Real-time**
   - Open app in 2 browsers
   - Book a seat
   - Verify real-time update

3. **Test Database**
   - Create trip
   - Verify in database
   - Check user ratings

4. **Test Performance**
   - Use Lighthouse (Vercel)
   - Check backend response times
   - Monitor database queries

---

## 17. Maintenance

### Daily
- Monitor logs for errors
- Check database performance

### Weekly
- Review user feedback
- Check server performance
- Update dependencies (non-breaking)

### Monthly
- Run backups
- Review security logs
- Update major dependencies
- Deploy improvements

---

## Useful Commands

```bash
# Check Backend Status
curl https://api.yourdomain.com/health

# View Database
psql $DATABASE_URL

# Check Frontend Performance
lighthouse https://yourdomain.com

# Monitor Logs
heroku logs --tail -t
railway logs -f

# Deploy Again
git push render main
git push heroku main
```

---

## Support & Troubleshooting

### Common Issues

**"502 Bad Gateway"**
- Check backend logs
- Verify DATABASE_URL
- Restart service

**"CORS Error"**
- Update FRONTEND_URL in backend
- Verify headers

**"Database Connection Failed"**
- Check DATABASE_URL
- Verify IP whitelist
- Test connection locally

**"Slow Performance"**
- Add database indexes
- Enable caching
- Check query performance
- Upgrade plan

---

## Next Steps

1. Set up monitoring (Datadog, New Relic)
2. Implement analytics (Google Analytics)
3. Add error tracking (Sentry)
4. Set up CI/CD pipeline
5. Configure load balancing
6. Implement caching layer
7. Add real payment integration
8. Set up email notifications

---

**Congratulations! Your MVP is now in production! 🎉**

Monitor performance and user feedback to plan next iterations.
