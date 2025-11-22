# Local Development Guide

## Quick Start for Local Webhook Testing

Since OMI requires a publicly accessible HTTPS URL, you need to expose your local server. Here's the fastest way:

## Method 1: ngrok (Easiest)

### Step 1: Install ngrok
```bash
# macOS
brew install ngrok/ngrok/ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Get your authtoken
1. Sign up at https://ngrok.com (free)
2. Go to https://dashboard.ngrok.com/get-started/your-authtoken
3. Copy your authtoken

### Step 3: Configure ngrok
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Step 4: Start your app
```bash
# Terminal 1: Start Next.js
npm run dev
```

### Step 5: Start ngrok tunnel
```bash
# Terminal 2: Start ngrok
ngrok http 3000
```

### Step 6: Get your webhook URL
ngrok will show you a URL like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

Your webhook URL for OMI will be:
```
https://abc123.ngrok-free.app/api/omi/webhook
```

### Step 7: Configure OMI
1. Open OMI app → Settings → Developer Mode → Developer Settings
2. Paste: `https://abc123.ngrok-free.app/api/omi/webhook`
3. Start speaking!

## Method 2: localtunnel (No Signup Required)

### Step 1: Install localtunnel
```bash
npm install -g localtunnel
```

### Step 2: Start your app
```bash
# Terminal 1
npm run dev
```

### Step 3: Start tunnel
```bash
# Terminal 2
lt --port 3000
```

### Step 4: Use the URL provided
localtunnel will give you a URL like `https://random-name.loca.lt`

Your webhook URL: `https://random-name.loca.lt/api/omi/webhook`

## Method 3: Cloudflare Tunnel (Most Stable)

### Step 1: Install cloudflared
```bash
brew install cloudflare/cloudflare/cloudflared
```

### Step 2: Start your app
```bash
npm run dev
```

### Step 3: Start tunnel
```bash
cloudflared tunnel --url http://localhost:3000
```

### Step 4: Use the HTTPS URL provided

## Testing Your Setup

### Test 1: Check if webhook is accessible
Visit in browser: `https://YOUR_TUNNEL_URL/api/omi/webhook`

You should see: `{"message":"OMI Webhook endpoint is active"}`

### Test 2: Send a test webhook
```bash
curl -X POST "https://YOUR_TUNNEL_URL/api/omi/webhook?session_id=test123&uid=user456" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test123",
    "segments": [
      {
        "text": "Hello, this is a test",
        "speaker": "user",
        "is_user": true
      }
    ]
  }'
```

### Test 3: Check your app
1. Open `http://localhost:3000/transcriptions`
2. You should see the test transcription appear

## Important Notes

⚠️ **ngrok URL Changes**: Free ngrok URLs change every time you restart. You'll need to update OMI settings each time.

💡 **Tip**: For ngrok, you can get a static domain with a paid plan, or use localtunnel which sometimes provides more stable URLs.

🔒 **Security**: These tunnels expose your local server to the internet. Only use for development!

## Troubleshooting

### "Connection refused"
- Make sure your Next.js server is running on port 3000
- Check that ngrok/localtunnel is pointing to the correct port

### "Webhook not receiving data"
- Verify the webhook URL in OMI settings matches exactly (including `/api/omi/webhook`)
- Check your Next.js server logs for incoming requests
- Make sure the tunnel is still running

### "HTTPS required"
- All tunneling tools provide HTTPS URLs automatically
- Make sure you're using the HTTPS URL, not HTTP

