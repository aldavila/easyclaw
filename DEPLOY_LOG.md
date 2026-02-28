# EasyClaw Deploy Log

## Latest Deployment: 2026-02-28

### ✅ Deployed Successfully
- **URL:** https://deploy-eight-jet.vercel.app
- **Status:** LIVE
- **Auth:** Email/Password credentials (working without Google OAuth)
- **Model:** BYOK (Bring Your Own Key) - $8/$18/$38 pricing

### What's Working
1. ✅ Landing page with BYOK pricing ($8/$18/$38)
2. ✅ Login/Signup page at `/login`
3. ✅ Email + Password authentication
4. ✅ NextAuth JWT sessions
5. ✅ Dashboard page at `/dashboard`
6. ✅ Stripe checkout integration (env vars configured)

### ⚠️ Database Status
**Currently using mock database** - data doesn't persist across deployments.

The app builds and runs, but to persist user data, need to:

1. **Create Neon Database** (free tier):
   - Go to https://console.neon.tech
   - Create new project "easyclaw"
   - Get the connection string

2. **Add DATABASE_URL to Vercel**:
   ```bash
   VERCEL_TOKEN=$(cat ~/.secrets/vercel_token)
   PROJECT_ID="prj_xuMMiXx6gr7BXyz1m5HKcBZ3yKKn"
   
   curl -X POST "https://api.vercel.com/v10/projects/$PROJECT_ID/env" \
     -H "Authorization: Bearer $VERCEL_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"key":"DATABASE_URL","value":"<YOUR_NEON_URL>","type":"encrypted","target":["production","preview"]}'
   ```

3. **Run migrations**:
   ```bash
   cd ~/clawd/ventures/alberto/saas/easyclaw/deploy
   DATABASE_URL="<url>" npx drizzle-kit push
   ```

4. **Redeploy**:
   ```bash
   npx vercel --token "$(cat ~/.secrets/vercel_token)" deploy --prod --yes
   ```

### Files Modified (2026-02-28)
- `src/lib/db/schema.ts` - Added `passwordHash` field to users table
- `src/lib/db/index.ts` - Added mock DB fallback for builds without DATABASE_URL
- `src/lib/auth.ts` - Added Credentials provider for email/password auth
- `src/app/login/page.tsx` - New login/signup page with dark theme

### Environment Variables (Vercel)
- ✅ NEXTAUTH_SECRET
- ✅ NEXTAUTH_URL
- ✅ NEXT_PUBLIC_APP_URL
- ✅ STRIPE_SECRET_KEY
- ✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- ✅ STRIPE_STARTER_PRICE_ID
- ✅ STRIPE_PRO_PRICE_ID
- ✅ STRIPE_BUSINESS_PRICE_ID
- ✅ DO_API_TOKEN
- ⚠️ DATABASE_URL - **MISSING** (using mock DB)
- ⚠️ GOOGLE_CLIENT_ID - **MISSING** (email/password auth works instead)
- ⚠️ GOOGLE_CLIENT_SECRET - **MISSING** (email/password auth works instead)

### Next Steps
1. Create Neon database and add DATABASE_URL
2. Run DB migrations
3. Test signup/login flow with real persistence
4. Optional: Add Google OAuth when ready

### Git History
```
1d67bd1 feat: add email/password auth, login page, BYOK model ready
```
