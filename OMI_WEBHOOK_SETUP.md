# OMI Webhook Integration Setup

## Overview

This application is configured to receive real-time transcriptions from your OMI device via webhooks. When you turn on your OMI device, transcriptions will automatically appear in the Transcriptions section.

**Based on Official OMI Documentation**: https://docs.omi.me/doc/developer/apps/Integrations

## Setup Instructions

### 0. Local Development Setup (If Running Locally)

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
   - **For local development**: Use the ngrok/localtunnel URL from above + `/api/omi/webhook`
     ```
     https://abc123.ngrok-free.app/api/omi/webhook
     ```
   - **For Netlify (Recommended - Free & Permanent)**: 
     ```
     https://your-app-name.netlify.app/api/omi/webhook
     ```
     See `NETLIFY_DEPLOYMENT.md` for deployment instructions.
   - **For production**: Use your deployed domain
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

To test the webhook integration:

1. Start your Next.js development server: `npm run dev`
2. Use a tool like `curl` or Postman to send a POST request matching OMI's format
3. Check the Transcriptions page to see if the transcription appears

**Example test request (matching OMI format):**
```bash
curl -X POST "http://localhost:3000/api/omi/webhook?session_id=test123&uid=user456" \
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

**Testing with OMI Device (Local Development):**
1. Start your Next.js server: `npm run dev`
2. Start ngrok (or your chosen tunneling tool) pointing to port 3000
3. Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok-free.app`)
4. Configure the webhook URL in OMI Developer Settings: `https://abc123.ngrok-free.app/api/omi/webhook`
5. Start speaking to your OMI device
6. Check your Next.js server logs to see incoming webhook requests
7. Verify transcriptions appear in the portal at `http://localhost:3000/transcriptions`

**Quick Test Without OMI Device:**
You can test the webhook locally using curl (replace the ngrok URL with your actual tunnel URL):
```bash
curl -X POST "https://YOUR_NGROK_URL.ngrok-free.app/api/omi/webhook?session_id=test123&uid=user456" \
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

