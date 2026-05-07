# Movemate Operations Runbook

Complete guide for developers, QA, and DevOps teams to operate and maintain the Movemate platform. This covers local development, testing, deployment, and incident response.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Running Tests](#running-tests)
3. [Deployment Procedures](#deployment-procedures)
4. [Rollback Procedures](#rollback-procedures)
5. [On-Call Incident Runbook](#on-call-incident-runbook)
6. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

- Node.js 20 LTS
- Docker & Docker Compose
- Expo CLI (`npm install -g expo-cli`)
- AWS CLI v2 with credentials configured
- PostgreSQL 15 (local or via Docker)

### Full Stack Startup (Docker + Services)

```bash
# Clone all repos
git clone <backend-repo> movemate-backend
git clone <app-repo> movemate-app
git clone <infra-repo> movemate-infra

# 1. Start database and cache layer
cd movemate-backend
docker-compose up -d postgres redis

# 2. Run migrations
npm run prisma:migrate

# 3. Seed sample data (optional)
npm run prisma:seed

# 4. Start backend services
npm run dev

# Backend will be available at:
# - auth-service: http://localhost:3001
# - user-service: http://localhost:3002

# 5. In another terminal, start the mobile app
cd ../movemate-app
npm install
expo start

# Press 'i' for iOS simulator or 'a' for Android emulator
```

### Local Database Access

```bash
# Connect to local PostgreSQL
psql postgresql://movemate:movemate@localhost:5432/movemate

# View Prisma Studio UI (interactive schema browser)
cd movemate-backend && npx prisma studio
# Opens at http://localhost:5555
```

### Environment Variables

**Backend (.env)**:
```
DATABASE_URL=postgresql://movemate:movemate@localhost:5432/movemate
REDIS_URL=redis://localhost:6379
NODE_ENV=development
JWT_SECRET=dev-secret-key-min-32-chars-long
```

**App (.env.local)**:
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:3000
NODE_ENV=development
```

---

## Running Tests

### Backend

```bash
# Unit tests (fast, no database)
npm run test -- --testPathPattern="unit"

# Integration tests (requires test DB)
npm run test -- --testPathPattern="integration"

# All tests with coverage
npm run test:coverage

# Watch mode (for development)
npm run test:watch

# Coverage threshold check (must pass before merge)
# Enforces 80% statement coverage
npm run test -- --coverage --collectCoverageFrom="src/**/*.ts"
```

### Frontend App

```bash
# Jest unit tests
npm run test -- --watchAll=false

# With coverage
npm run test:coverage

# E2E tests (Detox)
npm run e2e:ios
npm run e2e:android

# Lint check
npm run lint

# Type check
npm run type-check
```

### Security Scanning

```bash
# Backend: npm audit
cd movemate-backend
npm audit --audit-level=high

# Frontend: npm audit
cd movemate-app
npm audit --audit-level=high

# OWASP ZAP baseline scan (local)
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3001
```

---

## Deployment Procedures

### Dev Environment (Manual, No Approval)

```bash
# Prerequisites: AWS credentials configured locally
cd movemate-infra

# View what will change
npm run diff -- --context env=dev

# Deploy (auto-approved)
npm run deploy:dev

# Verify
aws ecs describe-services --cluster movemate-dev --services movemate-auth-service-dev
```

### Staging Environment

**Automated via GitHub Actions**:

1. Merge PR to `main` branch
2. GitHub Actions automatically:
   - Runs full CI pipeline
   - Builds Docker images
   - Deploys to staging
   - Runs health checks
   - Posts deployment to Slack

**Manual deployment** (if needed):

```bash
# Infrastructure
cd movemate-infra
npm run deploy:staging  # Requires manual approval (console prompt)

# Backend services
cd movemate-backend
git push origin main    # Triggers deploy-staging.yml workflow
# Monitor: GitHub Actions tab

# App builds
cd movemate-app
# Trigger via GitHub UI: Actions → App EAS Build → Run workflow
# Profile: preview
```

### Production Environment

**WARNING**: Production deployments require manual approval.

1. Create release PR on `main`
   - Update version in package.json
   - Add release notes (see template below)
2. Get approval from 2+ team members
3. Merge to main
4. **Infra**: GitHub Actions prompts for approval in environment protection rule
5. **Backend**: Automatic deployment (with health checks)
6. **App**: Manual trigger of EAS build with `production` profile

```bash
# Monitor deployment
aws ecs describe-services \
  --cluster movemate-production \
  --services movemate-auth-service-prod
  --region me-south-1

# Check CloudWatch logs
aws logs tail /movemate/production/auth-service --follow --region me-south-1
```

---

## Rollback Procedures

### Automated Rollback (if health checks fail)

The deployment workflow automatically rolls back if:
- Health check fails for 10 minutes
- Error rate > 1% in first 10 minutes post-deploy
- Task fails to start

**Check rollback status**:

```bash
# See active deployment
aws ecs describe-services \
  --cluster movemate-staging \
  --services movemate-auth-service-staging

# Check CloudWatch for errors
aws logs tail /movemate/staging/auth-service --follow
```

### Manual Rollback

If automated rollback didn't trigger or needs manual intervention:

```bash
# Find previous task definition
aws ecs describe-services \
  --cluster movemate-staging \
  --services movemate-auth-service-staging \
  --region me-south-1 | jq '.services[0].deployments'

# Redeploy previous version
aws ecs update-service \
  --cluster movemate-staging \
  --service movemate-auth-service-staging \
  --task-definition movemate-auth-service-staging:N \
  --region me-south-1

# Verify
aws ecs wait services-stable \
  --cluster movemate-staging \
  --services movemate-auth-service-staging
```

### Database Rollback

If migration caused issues:

```bash
# Prisma migrations cannot auto-rollback
# Manual steps:

# 1. Identify the problematic migration
ls movemate-backend/prisma/migrations/ | sort

# 2. Create a new migration to revert changes
cd movemate-backend
npx prisma migrate resolve --rolled-back <migration-timestamp>

# 3. Create corrective migration
npx prisma migrate dev --name "fix_<issue>"

# 4. Deploy corrected migration
npx prisma migrate deploy

# 5. Test on staging first before production
```

---

## On-Call Incident Runbook

### Alert: RDS Connection Pool > 80%

**Symptoms**: Database connection errors, slow API responses

**Investigation**:

```bash
# Check RDS metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name DatabaseConnections \
  --dimensions Name=DBInstanceIdentifier,Value=movemate-staging \
  --start-time 2024-01-10T00:00:00Z \
  --end-time 2024-01-10T01:00:00Z \
  --period 300 \
  --statistics Average

# Check active connections in database
psql $DATABASE_URL -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"

# Check slow queries
psql $DATABASE_URL -c "SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

**Resolution**:

1. Kill idle connections:
   ```sql
   SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
   WHERE datname = 'movemate' AND pid <> pg_backend_pid();
   ```

2. Scale RDS:
   ```bash
   aws rds modify-db-instance \
     --db-instance-identifier movemate-staging \
     --allocated-storage 100 \
     --apply-immediately
   ```

3. Restart services to clear local connection caches:
   ```bash
   aws ecs update-service \
     --cluster movemate-staging \
     --service movemate-auth-service-staging \
     --force-new-deployment
   ```

4. Monitor recovery
5. Create follow-up task to optimize queries / add caching

### Alert: ECS CPU > 80% Sustained

**Symptoms**: Slow response times, timeout errors, high latency

**Investigation**:

```bash
# Get task metrics
aws ecs list-tasks --cluster movemate-staging --service-name movemate-auth-service-staging

# Describe task to see CPU
aws ecs describe-tasks --cluster movemate-staging --tasks <task-arn>

# Check logs for errors
aws logs tail /movemate/staging/auth-service --follow
```

**Resolution**:

1. Immediate: Increase ECS task desired count:
   ```bash
   aws ecs update-service \
     --cluster movemate-staging \
     --service movemate-auth-service-staging \
     --desired-count 3
   ```

2. Monitor: Wait 5 minutes for new tasks to stabilize

3. Root cause: Analyze logs for:
   - N+1 database queries
   - Large dataset processing
   - Memory leaks
   - Stuck requests

4. Fix: Deploy optimized code or adjust task CPU allocation

### Alert: 5xx Errors > 0.5%

**Symptoms**: Customers report app errors, sentry alerts firing

**Investigation**:

```bash
# Get error rate from CloudWatch
aws logs insights query \
  --log-group-name /movemate/staging/auth-service \
  --query 'fields statusCode | stats count() by statusCode'

# Get specific error logs
aws logs tail /movemate/staging/auth-service --follow --filter-pattern "ERROR"

# Check sentry for errors
# https://sentry.io/organizations/movemate/
```

**Resolution**:

1. Immediate actions:
   - Get error details (stack trace, endpoint, user)
   - Check recent deployments
   - Assess customer impact

2. If related to recent deploy:
   ```bash
   # Trigger manual rollback (see section above)
   ```

3. If not deploy-related:
   - Check external dependencies (Stripe, Google Maps, etc.)
   - Verify database connectivity
   - Check for DOS or unusual traffic

4. Permanent fix:
   - Add test case for the error scenario
   - Deploy fix to staging first
   - Test thoroughly before production deployment

### Alert: Payment Processing Failures

**Critical**: This directly impacts revenue

**Investigation**:

```bash
# Check Stripe webhook deliveries
# https://dashboard.stripe.com/webhooks

# Check logs
aws logs tail /movemate/staging/payment-service --filter-pattern "PAYMENT_FAILED"

# Database check
psql $DATABASE_URL -c "SELECT * FROM payments WHERE status = 'failed' ORDER BY created_at DESC LIMIT 20;"
```

**Resolution**:

1. **Immediate**:
   - Alert payment provider (Stripe/Checkout.com)
   - Check status page
   - If service is down, notify customers of temporary disruption

2. **If it's our code**:
   - Check recent changes to payment service
   - Verify webhook signatures
   - Check API credentials in Secrets Manager

3. **Recovery**:
   - Retry failed payments
   - Notify customers of successful processing
   - Document root cause

---

## Troubleshooting

### Local Development Issues

#### "Port 3001 already in use"

```bash
# Find and kill the process
lsof -i :3001
kill -9 <PID>

# Or use different port
PORT=3003 npm run dev
```

#### Database migrations fail

```bash
# Reset database (dev only, loses data)
cd movemate-backend
npx prisma migrate reset

# Or manually:
psql postgresql://movemate:movemate@localhost:5432/movemate -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npx prisma migrate deploy
```

#### Expo app won't connect to local backend

```bash
# Get your machine's local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Update app env:
REACT_APP_API_URL=http://<YOUR_IP>:3001

# Restart Expo
expo start --clear
```

### Deployment Issues

#### Health check timeout

```bash
# Check if service is actually healthy
curl http://<ALB_DNS>:3001/healthz

# Check task logs
aws logs tail /movemate/staging/auth-service --follow --filter-pattern "error"

# Check if port is exposed
docker inspect <container-id> | grep -A5 "ExposedPorts"
```

#### Task keeps restarting

```bash
# Check task definition
aws ecs describe-task-definition \
  --task-definition movemate-auth-service-staging:1

# Check CloudWatch logs
aws logs tail /movemate/staging/auth-service --follow

# Common issues:
# - Missing environment variable
# - Database connection string invalid
# - Port conflict
# - Out of memory (check task CPU/memory allocation)
```

#### Prisma migration hangs

```bash
# Check for active queries blocking migration
psql $DATABASE_URL -c "SELECT pid, query FROM pg_stat_activity WHERE state = 'active';"

# Kill blocking queries (be careful)
psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE query ILIKE '%migration%';"

# Retry migration
npx prisma migrate deploy
```

---

## Release Notes Template

Use this template when creating production releases:

```markdown
# Release v1.0.1 — 2024-01-15

## New Features
- Multi-subscription management for trainers (US-028)
- Real-time availability broadcast via WebSocket (US-009)

## Improvements
- Reduced booking confirmation latency by 40% (optimized DB queries)
- Arabic RTL layout fixes on trainer profile
- Improved error messaging for payment failures

## Bug Fixes
- Fixed cancellation penalty calculation for bookings near midnight (UTC)
- Fixed missing Slack notification on deploy success
- Fixed trainer availability not clearing after session end

## Security Updates
- Updated npm dependencies (2 vulnerabilities fixed)
- Enforce TLS 1.3 on all API endpoints

## Migration Notes
- Database migration: adds `cancellation_reason` column to bookings table (~5 min)
- No API breaking changes
- ECS rolling deploy (5 min expected downtime)

## Testing
- 127 unit tests passed (coverage: 84%)
- 32 integration tests passed
- Regression smoke tests: PASSED
- Production health checks: PASSED

## Deployment
- **Staging**: 2024-01-14 17:30 UTC ✅
- **Production**: Ready for deployment (approval required)
- **Rollback plan**: Previous version on standby (task revision N-1)

## Contributors
- @backend-dev (auth, booking service)
- @frontend-dev (app UI, RTL)
- @devops (CI/CD infrastructure)
```

---

## Quick Reference Commands

```bash
# Logs
aws logs tail /movemate/staging/auth-service --follow

# Metrics
aws cloudwatch get-metric-statistics --namespace AWS/ECS \
  --metric-name CPUUtilization --dimensions Name=ServiceName,Value=movemate-auth-service-staging

# Health check
curl http://movemate-staging-alb.me-south-1.elb.amazonaws.com/healthz

# Restart service
aws ecs update-service --cluster movemate-staging \
  --service movemate-auth-service-staging --force-new-deployment

# View deployments
aws ecs describe-services --cluster movemate-staging --services movemate-auth-service-staging
```

---

## Contact & Escalation

- **DevOps**: Slack #movemate-devops
- **On-Call PagerDuty**: https://movemate.pagerduty.com
- **AWS Support**: https://console.aws.amazon.com/support
- **Stripe Support**: https://support.stripe.com
