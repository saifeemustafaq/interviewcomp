# Convex Setup for Netlify Production

This guide will help you connect Convex to your **live Netlify site**.

## Overview

- `npx convex dev` - Links project locally and runs dev server (for local testing)
- `npx convex deploy` - Deploys functions to production (for Netlify)
- Environment variables - Connect your live site to Convex

## Step-by-Step Setup

### Step 1: Link Your Convex Project (One Time)

Run this locally to link your codebase to your Convex project:

```bash
npx convex dev
```

When prompted:
1. Choose "Use an existing project"
2. Select: `mustafa-saifee/int1/animated-pig-74`
3. This creates `convex.json` in your project

**Note:** This step is just to link the project. You can stop the dev server after it starts.

### Step 2: Deploy Convex Functions to Production

```bash
npx convex deploy
```

This deploys your schema and functions to Convex production. You'll see:
- Deployment URL (like: `https://animated-pig-74.convex.cloud`)
- HTTP action URL (like: `https://animated-pig-74.convex.site/api/http/omiWebhook`)

**Copy the deployment URL** - you'll need it for Netlify.

### Step 3: Get Your Convex URLs

After deploying, you'll have:

1. **Deployment URL** (for frontend):
   - Format: `https://your-deployment.convex.cloud`
   - Example: `https://animated-pig-74.convex.cloud`

2. **HTTP Action URL** (for webhook - optional):
   - Format: `https://your-deployment.convex.site/api/http/omiWebhook`
   - Example: `https://animated-pig-74.convex.site/api/http/omiWebhook`

### Step 4: Add Environment Variable to Netlify

1. Go to **Netlify Dashboard**: https://app.netlify.com
2. Select your site: **intercmp**
3. Go to: **Site Settings** → **Environment Variables**
4. Click **Add variable**
5. Add:
   - **Key**: `NEXT_PUBLIC_CONVEX_URL`
   - **Value**: Your deployment URL from Step 3 (e.g., `https://animated-pig-74.convex.cloud`)
6. Click **Save**

### Step 5: Redeploy Your Netlify Site

After adding the environment variable:

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Or push a commit to trigger auto-deploy

**Important:** The environment variable only takes effect after redeploy!

### Step 6: Update OMI Webhook (Choose One)

#### Option A: Use Convex HTTP Action Directly (Recommended)

1. Get your HTTP action URL from Step 3
2. Update OMI webhook URL to: `https://your-deployment.convex.site/api/http/omiWebhook`
3. This bypasses Netlify and goes directly to Convex

#### Option B: Keep Using Netlify Webhook

1. Keep OMI webhook as: `https://intercmp.netlify.app/api/omi/webhook`
2. The Next.js webhook will forward to Convex automatically
3. Requires the environment variable to be set

### Step 7: Verify It's Working

1. **Check Convex Dashboard**:
   - Go to: https://dashboard.convex.dev/t/mustafa-saifee/int1/animated-pig-74
   - Click on **Data** tab
   - You should see the `transcriptions` table

2. **Test Your Live Site**:
   - Visit: https://intercmp.netlify.app/transcriptions
   - Start speaking to OMI
   - Transcriptions should appear in real-time
   - Check Convex dashboard - data should appear there too!

3. **Test Webhook**:
   ```bash
   curl -X POST "https://intercmp.netlify.app/api/omi/webhook?session_id=test123&uid=user456" \
     -H "Content-Type: application/json" \
     -d '{
       "session_id": "test123",
       "segments": [{"text": "Test", "speaker": "user", "is_user": true}]
     }'
   ```
   Then check Convex dashboard - should see the transcription!

## Summary

✅ **Local Setup** (one time):
- `npx convex dev` - Links project
- Creates `convex.json`

✅ **Production Deployment**:
- `npx convex deploy` - Deploys to Convex
- Add `NEXT_PUBLIC_CONVEX_URL` to Netlify env vars
- Redeploy Netlify site

✅ **Result**:
- Your live Netlify site connects to Convex
- All transcriptions saved permanently
- Real-time updates work
- Data visible in Convex dashboard

## Troubleshooting

### Transcriptions not appearing?

1. **Check Netlify Environment Variable**:
   - Make sure `NEXT_PUBLIC_CONVEX_URL` is set
   - Make sure you redeployed after adding it

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for Convex connection errors
   - Should see: "Connected to Convex"

3. **Check Convex Dashboard**:
   - Go to Functions tab
   - Check if functions are deployed
   - Check Data tab for transcriptions

4. **Verify Environment Variable**:
   - In Netlify, go to Deploys → Latest deploy → Build log
   - Check if `NEXT_PUBLIC_CONVEX_URL` is available

### Webhook not working?

1. **If using Option A** (Convex HTTP directly):
   - Verify HTTP action URL is correct
   - Check Convex dashboard → Functions → HTTP actions

2. **If using Option B** (Netlify webhook):
   - Check Netlify function logs
   - Verify environment variable is set
   - Check that webhook forwards to Convex

## Important Notes

- **Environment variables** must be set in Netlify, not just `.env.local`
- **Redeploy required** after adding environment variables
- **Convex functions** must be deployed with `npx convex deploy`
- **Both local and production** can use the same Convex project

