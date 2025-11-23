# Convex Setup Guide

## Why Convex?

- ✅ **Persistent Storage**: Data survives serverless cold starts
- ✅ **Real-time Updates**: No polling needed - instant updates
- ✅ **Free Tier**: Generous free tier for development
- ✅ **Perfect for Next.js**: Built-in integration

## Quick Setup

### 1. Install Convex

```bash
npm install convex
npx convex dev
```

This will:
- Create a `convex/` directory
- Set up your Convex project
- Give you a deployment URL

### 2. Get Your Convex Credentials

After running `npx convex dev`, you'll get:
- A deployment URL (like `https://your-project.convex.cloud`)
- Instructions to add environment variables

### 3. Add Environment Variables

Create `.env.local`:
```
CONVEX_URL=https://your-project.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

### 4. Deploy

```bash
npx convex deploy
```

## What We'll Build

1. **Schema**: Define transcription data structure
2. **Mutations**: Functions to create/update transcriptions
3. **Queries**: Functions to read transcriptions
4. **HTTP Action**: Webhook endpoint in Convex
5. **Frontend**: Real-time subscriptions

## Next Steps

After setup, we'll:
- Replace in-memory store with Convex
- Update webhook to use Convex HTTP action
- Update frontend to use real-time subscriptions
- All transcriptions will persist permanently!

