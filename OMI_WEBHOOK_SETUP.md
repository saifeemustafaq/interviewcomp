# OMI Webhook Integration Setup

## Overview

This application is configured to receive real-time transcriptions from your OMI device via webhooks. When you turn on your OMI device, transcriptions will automatically appear in the Transcriptions section.

**Based on Official OMI Documentation**: https://docs.omi.me/doc/developer/apps/Integrations

## 🚀 Quick Start (You're Already Deployed!)

**Your Webhook URL:**
```
https://intercmp.netlify.app/api/omi/webhook
```

**To Configure OMI:**
1. Open OMI app → Settings → Developer Mode → Developer Settings
2. Find "Real-Time Transcript Webhook" field
3. Paste: `https://intercmp.netlify.app/api/omi/webhook`
4. Save and start speaking!

**Your App URL:**
- View transcriptions: https://intercmp.netlify.app/transcriptions
- Dashboard: https://intercmp.netlify.app

## Setup Instructions

### ✅ **You're Already Deployed!**

Your app is deployed at: **https://intercmp.netlify.app**

You can skip the local development setup below and go directly to **Step 1: Configure OMI Device**.

Your webhook URL is: **https://intercmp.netlify.app/api/omi/webhook**

---

### 0. Local Development Setup (Only if Testing Locally)

⚠️ **Note**: Since you're already deployed to Netlify, you only need this section if you want to test changes locally before deploying.

Since OMI needs a publicly accessible HTTPS URL, you'll need to expose your local server. Here are the best options:

#### Option A: Using ngrok (Recommended)

1. **Install ngrok:**
   ```bash
   # macOS
   brew install ngrok/ngrok/ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Sign up and get your authtoken:**
   - Go to https://dashboard.ngrok.com/get-started/your-authtoken
   - Copy your authtoken

3. **Configure ngrok:**
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

4. **Start your Next.js server:**
   ```bash
   npm run dev
   ```
   (Your server should be running on `http://localhost:3000`)

5. **In a new terminal, start ngrok:**
   ```bash
   ngrok http 3000
   ```

6. **Copy the HTTPS URL:**
   - ngrok will display something like: `https://abc123.ngrok-free.app`
   - Copy this URL

7. **Your webhook URL will be:**
   ```
   https://abc123.ngrok-free.app/api/omi/webhook
   ```
   ⚠️ **Note**: The ngrok URL changes each time you restart ngrok (unless you have a paid plan with a static domain)

#### Option B: Using localtunnel (Free, No Signup)

1. **Install localtunnel:**
   ```bash
   npm install -g localtunnel
   ```

2. **Start your Next.js server:**
   ```bash
   npm run dev
   ```

3. **In a new terminal, start localtunnel:**
   ```bash
   lt --port 3000
   ```

4. **Copy the HTTPS URL provided** (e.g., `https://random-name.loca.lt`)

5. **Your webhook URL will be:**
   ```
   https://random-name.loca.lt/api/omi/webhook
   ```

#### Option C: Using Cloudflare Tunnel (Free, More Stable)

1. **Install cloudflared:**
   ```bash
   # macOS
   brew install cloudflare/cloudflare/cloudflared
   ```

2. **Start your Next.js server:**
   ```bash
   npm run dev
   ```

3. **In a new terminal, start the tunnel:**
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

4. **Copy the HTTPS URL provided**

### 1. Configure OMI Device

1. Open the OMI app on your device
2. Navigate to **Settings** → **Developer Mode**
3. Go to **Developer Settings**
4. Find **"Real-Time Transcript Webhook"** field
5. Enter your webhook URL:

   **✅ For Netlify Deployment (Your Current Setup):**
   ```
   https://intercmp.netlify.app/api/omi/webhook
   ```
   This is your permanent webhook URL. It won't change, so you only need to configure it once in OMI.

   **For local development (only if testing locally):**
   - Use the ngrok/localtunnel URL from Step 0 + `/api/omi/webhook`
     ```
     https://abc123.ngrok-free.app/api/omi/webhook
     ```
   - ⚠️ Note: ngrok URLs change each time you restart, so you'll need to update OMI settings each time

   **For custom domain (optional):**
   - If you add a custom domain to Netlify, use that instead
     ```
     https://yourdomain.com/api/omi/webhook
     ```

### 2. How It Works

- **Automatic Transcription Creation**: When you turn on your OMI device, it will start sending transcription data to the webhook endpoint
- **Active Transcription**: A new transcription card will automatically appear at the top of the Transcriptions page with a glowing green indicator
- **Real-time Updates**: As you speak, the transcript will update in real-time on the portal
- **Stopping Transcription**: 
  - **Option 1**: Turn off your OMI device (transcription will be automatically saved)
  - **Option 2**: Click the "Stop" button on the active transcription card in the portal

### 3. Webhook Endpoint

The webhook endpoint is located at: `/api/omi/webhook`

**OMI Real-Time Transcript Processor Payload Structure:**

OMI sends POST requests with query parameters and a JSON body:

```
POST /api/omi/webhook?session_id={session_id}&uid={user_id}
Content-Type: application/json

{
  "session_id": "abc123",
  "segments": [
    {
      "text": "Hello, how can I help you?",
      "speaker": "assistant",
      "is_user": false
    },
    {
      "text": "I need help with my interview preparation",
      "speaker": "user",
      "is_user": true
    }
  ]
}
```

**Key Points:**
- `session_id` and `uid` are sent as **query parameters** (not in body)
- `segments` is an array of transcript segments
- Each segment has `text`, `speaker`, and `is_user` fields
- The webhook processes user segments (`is_user: true`) by default
- Response must be HTTP 200 within 2 seconds

### 4. Next Steps (Convex Integration)

Currently, transcriptions are stored in client-side state. For production, you'll need to:

1. **Store in Convex Database**: Update the webhook handler to store transcriptions in Convex
2. **Real-time Sync**: Use Convex real-time subscriptions to sync transcriptions across clients
3. **Webhook Authentication**: Add authentication/verification for webhook requests from OMI
4. **Connect Webhook to Frontend**: The webhook currently processes data but needs to be connected to the TranscriptionContext via Convex or Server-Sent Events

### 5. Testing

#### Test 1: Verify Webhook Endpoint is Live

Visit in your browser:
```
https://intercmp.netlify.app/api/omi/webhook
```

You should see: `{"message":"OMI Webhook endpoint is active"}`

#### Test 2: Send a Test Webhook Request

Test your deployed webhook with curl:

```bash
curl -X POST "https://intercmp.netlify.app/api/omi/webhook?session_id=test123&uid=user456" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test123",
    "segments": [
      {
        "text": "This is a test transcription from OMI",
        "speaker": "user",
        "is_user": true
      }
    ]
  }'
```

Expected response: `{"success":true,"message":"Transcription received",...}`

#### Test 3: Test with OMI Device

1. **Configure OMI**: 
   - Open OMI app → Settings → Developer Mode → Developer Settings
   - Set "Real-Time Transcript Webhook" to: `https://intercmp.netlify.app/api/omi/webhook`

2. **Start Speaking**: 
   - Turn on your OMI device
   - Start speaking
   - OMI will send transcription data to your webhook

3. **Check Results**:
   - Visit: `https://intercmp.netlify.app/transcriptions`
   - You should see transcriptions appearing in real-time

4. **Monitor Webhooks**:
   - Check Netlify Functions logs in your Netlify dashboard
   - Go to: Site → Functions → View logs
   - You'll see incoming webhook requests logged there

#### Testing Locally (Optional)

If you want to test changes locally before deploying:

1. Start your Next.js server: `npm run dev`
2. Start ngrok: `ngrok http 3000`
3. Use the ngrok URL in OMI settings temporarily
4. Test your changes
5. Deploy to Netlify when ready
6. Update OMI settings back to: `https://intercmp.netlify.app/api/omi/webhook`

### 6. Important Requirements

- ✅ **HTTPS Required**: Webhook must be publicly accessible via HTTPS (not HTTP)
- ✅ **Fast Response**: Must return HTTP 200 within 2 seconds
- ✅ **POST Method**: OMI sends POST requests only
- ✅ **Query Parameters**: `session_id` and `uid` are in query string, not body

## UI Features

- **Active Transcription Card**: Shows at the top with a glowing green dot indicator
- **Stop Button**: Manually stop an active transcription
- **Saved Transcriptions**: All completed transcriptions are displayed as cards below
- **Delete Functionality**: Remove saved transcriptions with the delete button
- **Duration Tracking**: Shows how long each transcription lasted
- **Timestamp Display**: Shows when transcriptions started and completed

