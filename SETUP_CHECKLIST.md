# Setup Verification Checklist

Let's verify your Convex connection is set up correctly.

## ✅ Local Setup Check

### 1. Convex Project Linked
```bash
# Check if convex.json exists
ls -la convex.json
```

**Status**: ❌ Need to run `npx convex dev` to create this

### 2. Environment Variables (Local)
Your `.env.local` has:
- ✅ `NEXT_PUBLIC_CONVEX_URL=https://shiny-spoonbill-523.convex.cloud`

### 3. Convex Functions Deployed
```bash
# Check if functions are deployed
npx convex deploy
```

**Status**: ⏳ Need to deploy

## ✅ Code Setup Check

### 1. Convex Schema
- ✅ `convex/schema.ts` exists and defines `transcriptions` table

### 2. Convex Functions
- ✅ `convex/transcriptions.ts` has mutations and queries
- ✅ `convex/http.ts` has HTTP action for webhook

### 3. Frontend Integration
- ✅ `app/convex-provider.tsx` wraps app with Convex provider
- ✅ `app/layout.tsx` includes ConvexClientProvider
- ✅ `app/transcriptions/page.tsx` uses Convex queries

### 4. Webhook Integration
- ✅ `app/api/omi/webhook/route.ts` forwards to Convex

## ⚠️ Netlify Setup (CRITICAL)

### 1. Environment Variable in Netlify
**Action Required:**
1. Go to: https://app.netlify.com/sites/intercmp/settings/env
2. Add environment variable:
   - **Key**: `NEXT_PUBLIC_CONVEX_URL`
   - **Value**: `https://shiny-spoonbill-523.convex.cloud`
3. Click **Save**
4. **Redeploy your site** (important!)

**Status**: ❓ Need to verify in Netlify dashboard

## 🚀 Next Steps

### Step 1: Deploy Convex Functions
```bash
npx convex deploy
```

This will:
- Deploy your schema to Convex
- Deploy your functions
- Make everything available

### Step 2: Add Netlify Environment Variable
1. Netlify Dashboard → Site Settings → Environment Variables
2. Add: `NEXT_PUBLIC_CONVEX_URL` = `https://shiny-spoonbill-523.convex.cloud`
3. Redeploy site

### Step 3: Test Connection
1. Visit: https://intercmp.netlify.app/transcriptions
2. Open browser console (F12)
3. Should see Convex connection (no errors)
4. Start speaking to OMI
5. Check Convex dashboard: https://dashboard.convex.dev/t/mustafa-saifee/interviewconvex/data
6. Should see transcriptions appearing!

## 🔍 Verification Commands

Run these to check your setup:

```bash
# 1. Check Convex project is linked
cat convex.json

# 2. Check environment variable
cat .env.local | grep CONVEX

# 3. Deploy Convex functions
npx convex deploy

# 4. Check if functions are deployed (in Convex dashboard)
# Go to: https://dashboard.convex.dev/t/mustafa-saifee/interviewconvex/functions
```

## ❌ Common Issues

### Issue: "Convex not connected" in browser console
**Fix**: Add `NEXT_PUBLIC_CONVEX_URL` to Netlify and redeploy

### Issue: Webhook receives data but transcriptions don't appear
**Fix**: 
1. Check Convex dashboard for data
2. Check browser console for errors
3. Verify environment variable is set in Netlify

### Issue: Functions not found
**Fix**: Run `npx convex deploy` to deploy functions

## ✅ Success Indicators

You'll know it's working when:
1. ✅ Convex dashboard shows `transcriptions` table
2. ✅ Browser console shows "Connected to Convex"
3. ✅ Transcriptions appear in real-time on your site
4. ✅ Data persists after page refresh
5. ✅ Stop button saves transcriptions

