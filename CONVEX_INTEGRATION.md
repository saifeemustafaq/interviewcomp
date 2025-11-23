# Convex Integration - Complete Setup

## ✅ What's Been Set Up

1. **Convex Schema** (`convex/schema.ts`) - Defines transcription data structure
2. **Convex Functions** (`convex/transcriptions.ts`) - Mutations and queries
3. **Convex HTTP Action** (`convex/http.ts`) - Webhook endpoint for OMI
4. **Frontend Integration** - Real-time subscriptions instead of polling

## 🚀 Setup Steps

### Step 1: Initialize Convex

```bash
npx convex dev
```

This will:
- Create your Convex project
- Generate types
- Start the dev server
- Give you a deployment URL

### Step 2: Get Your Convex URL

After running `npx convex dev`, you'll see:
```
Dashboard: https://dashboard.convex.dev
Deployment: https://your-project.convex.cloud
```

### Step 3: Add Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

**For Netlify:**
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add: `NEXT_PUBLIC_CONVEX_URL` = `https://your-project.convex.cloud`

### Step 4: Update OMI Webhook URL

You have two options:

#### Option A: Use Convex HTTP Action Directly (Recommended)
1. Get your Convex HTTP action URL from the dashboard
2. Update OMI webhook to: `https://your-project.convex.site/api/http/omiWebhook`

#### Option B: Keep Next.js Webhook (Current)
- The Next.js webhook will forward to Convex
- Keep using: `https://intercmp.netlify.app/api/omi/webhook`

### Step 5: Deploy

```bash
# Deploy Convex
npx convex deploy

# Deploy Next.js (if needed)
git push  # Netlify will auto-deploy
```

## 🎯 What This Fixes

✅ **Persistent Storage**: Transcriptions saved permanently in Convex database
✅ **No Data Loss**: Survives serverless cold starts
✅ **Real-time Updates**: Instant updates, no polling needed
✅ **Stop Button Works**: Properly saves and completes transcriptions
✅ **All Transcriptions Saved**: Both active and completed are persisted

## 📝 Next Steps

1. Run `npx convex dev` to set up your project
2. Add the environment variable
3. Deploy both Convex and Next.js
4. Update OMI webhook URL (if using Option A)
5. Test - transcriptions should now persist!

## 🔍 Testing

1. **Check Convex Dashboard**: https://dashboard.convex.dev
   - You should see your transcriptions table
   - Data should appear in real-time

2. **Test Webhook**:
   ```bash
   curl -X POST "https://intercmp.netlify.app/api/omi/webhook?session_id=test123&uid=user456" \
     -H "Content-Type: application/json" \
     -d '{
       "session_id": "test123",
       "segments": [{"text": "Test", "speaker": "user", "is_user": true}]
     }'
   ```

3. **Check Frontend**: 
   - Visit: https://intercmp.netlify.app/transcriptions
   - Transcriptions should appear instantly
   - Click "Stop" - should save and move to completed section

## ⚠️ Important Notes

- **Convex Free Tier**: 1M function calls/month - plenty for development
- **Data Persistence**: All data is stored permanently
- **Real-time**: Changes appear instantly across all clients
- **No Polling**: Much more efficient than the old polling system

