# Convex Quick Start - Connect Your Existing Project

You already have a Convex project! Let's connect it to this codebase.

## Step 1: Get Your Convex Deployment URL

From your dashboard: https://dashboard.convex.dev/t/mustafa-saifee/int1/animated-pig-74

1. Go to your Convex dashboard
2. Look for your **Deployment URL** (should be something like: `https://animated-pig-74.convex.cloud`)
3. Copy that URL

## Step 2: Link Your Project

Run this command in your terminal:

```bash
npx convex dev
```

When prompted:
- Choose "Use an existing project"
- Select your project: `mustafa-saifee/int1/animated-pig-74`
- This will create `convex.json` and link your project

## Step 3: Add Environment Variable

Create `.env.local` file in your project root:

```bash
NEXT_PUBLIC_CONVEX_URL=https://animated-pig-74.convex.cloud
```

Replace `animated-pig-74` with your actual deployment name from Step 1.

## Step 4: Add to Netlify

1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Add: `NEXT_PUBLIC_CONVEX_URL` = `https://your-deployment.convex.cloud`
3. Redeploy your site

## Step 5: Deploy Convex Functions

```bash
npx convex deploy
```

This will deploy your schema and functions to Convex.

## Step 6: Update OMI Webhook (Optional)

You can either:

**Option A: Use Convex HTTP Action directly**
- Get your HTTP action URL from Convex dashboard
- Update OMI webhook to: `https://your-deployment.convex.site/api/http/omiWebhook`

**Option B: Keep using Next.js webhook**
- Keep: `https://intercmp.netlify.app/api/omi/webhook`
- It will forward to Convex automatically

## Step 7: Test!

1. Visit: https://intercmp.netlify.app/transcriptions
2. Start speaking to OMI
3. Transcriptions should appear in real-time
4. Check Convex dashboard - you should see data in the `transcriptions` table!

## ✅ What You'll Get

- ✅ Persistent storage (no data loss)
- ✅ Real-time updates (no polling)
- ✅ All transcriptions saved permanently
- ✅ Stop button works correctly
- ✅ Data visible in Convex dashboard

