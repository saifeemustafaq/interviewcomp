# Troubleshooting: Webhook Not Showing Transcriptions

## Issue
Webhook URL is configured in OMI, but transcriptions don't appear on the screen.

## Root Cause
The webhook receives data on the server, but the frontend (TranscriptionContext) is client-side only and doesn't know about incoming webhook data. They're not connected.

## Step-by-Step Troubleshooting

### Step 1: Verify Webhook is Receiving Data

**Check Netlify Logs:**
1. Go to https://app.netlify.com
2. Select your site: `intercmp`
3. Go to **Functions** → **View logs**
4. Look for entries with `/api/omi/webhook`
5. You should see logs like: `"OMI Webhook received: {...}"`

**If you see logs:**
✅ Webhook is working! OMI is sending data.
❌ Problem: Data isn't reaching the frontend.

**If you DON'T see logs:**
❌ Webhook isn't receiving data. Check:
- OMI webhook URL is correct: `https://intercmp.netlify.app/api/omi/webhook`
- OMI device is turned on and speaking
- OMI Developer Mode is enabled

### Step 2: Test Webhook Manually

Test if the webhook endpoint works:

```bash
curl -X POST "https://intercmp.netlify.app/api/omi/webhook?session_id=test123&uid=user456" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test123",
    "segments": [
      {
        "text": "This is a test transcription",
        "speaker": "user",
        "is_user": true
      }
    ]
  }'
```

Expected response: `{"success":true,"message":"Transcription received",...}`

### Step 3: The Real Problem

**Current Architecture:**
```
OMI Device → Webhook (Server) → [NOTHING] → Frontend (Client)
```

The webhook processes data but doesn't update the frontend because:
- Webhook runs on Netlify server (serverless function)
- Frontend runs in browser (client-side React state)
- No connection between them

**Solution Needed:**
We need to connect server → client. Options:
1. **Polling**: Frontend checks for new data every few seconds
2. **Database**: Store transcriptions in database, frontend subscribes
3. **Server-Sent Events**: Real-time push from server to client

## ✅ Solution Implemented

I've implemented a polling solution that connects the webhook to the frontend:

1. **Webhook stores transcriptions** in a shared in-memory store
2. **Frontend polls** `/api/transcriptions` every 2 seconds
3. **Transcriptions sync** from API to frontend automatically

### How It Works Now:

```
OMI Device → Webhook → Shared Store → API Endpoint → Frontend (polls every 2s)
```

### Testing the Fix:

1. **Deploy the updated code** to Netlify
2. **Open your app**: https://intercmp.netlify.app/transcriptions
3. **Start speaking** to your OMI device
4. **Wait 2-4 seconds** - transcriptions should appear!

### If Still Not Working:

1. **Check Netlify Function Logs**:
   - Go to Netlify dashboard → Functions → View logs
   - Look for "OMI Webhook received" messages
   - If you see them, webhook is working ✅

2. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for errors or "Error fetching transcriptions" messages

3. **Test API Directly**:
   - Visit: https://intercmp.netlify.app/api/transcriptions
   - Should return JSON with transcriptions array
   - If empty `[]`, webhook hasn't received data yet

4. **Test Webhook Manually**:
   ```bash
   curl -X POST "https://intercmp.netlify.app/api/omi/webhook?session_id=test123&uid=user456" \
     -H "Content-Type: application/json" \
     -d '{
       "session_id": "test123",
       "segments": [
         {
           "text": "Test transcription",
           "speaker": "user",
           "is_user": true
         }
       ]
     }'
   ```
   Then check: https://intercmp.netlify.app/api/transcriptions
   Should show the test transcription.

## Long-term Solution

For production, integrate with Convex:
1. Webhook stores transcriptions in Convex database
2. Frontend subscribes to Convex real-time updates
3. Transcriptions appear instantly (no polling needed)

