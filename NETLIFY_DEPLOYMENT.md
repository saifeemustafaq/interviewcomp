# Deploying to Netlify (Free)

Yes! You can absolutely host this on Netlify for free and it will work perfectly for OMI webhooks. Netlify's free plan includes:

- ✅ HTTPS URLs automatically
- ✅ Serverless functions (125,000 invocations/month)
- ✅ Custom domains
- ✅ Continuous deployment from Git
- ✅ 100GB bandwidth/month

## Quick Deploy Steps

### Option 1: Deploy via Netlify UI (Easiest)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Netlify:**
   - Visit https://app.netlify.com
   - Sign up/login (free)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure build settings:**
   - **Build command**: `npm run build`
   - **Publish directory**: Leave default (Netlify auto-detects Next.js)
   - Netlify will automatically use the `@netlify/plugin-nextjs` plugin

4. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete (~2-3 minutes)

5. **Get your webhook URL:**
   - Netlify will give you a URL like: `https://your-app-name.netlify.app`
   - Your webhook URL will be: `https://your-app-name.netlify.app/api/omi/webhook`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Initialize and deploy:**
   ```bash
   netlify init
   # Follow prompts:
   # - Create & configure a new site
   # - Build command: npm run build
   # - Directory to deploy: .next (or default)
   
   netlify deploy --prod
   ```

## Configuration File

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

## Important Notes

### ✅ What Works Out of the Box

- Next.js API routes in `app/api/` work automatically
- Your webhook at `/api/omi/webhook` will work
- HTTPS is automatic
- Free custom domain (`.netlify.app`)

### ⚠️ Considerations

1. **Serverless Function Timeout:**
   - Free tier: 10 seconds max execution time
   - Your webhook should respond quickly (OMI requires <2 seconds) ✅

2. **Cold Starts:**
   - First request after inactivity may be slower (~1-2 seconds)
   - Subsequent requests are fast
   - OMI may retry if timeout occurs

3. **State Management:**
   - Serverless functions are stateless
   - You'll need Convex or another database for persistent storage
   - Client-side state (TranscriptionContext) won't persist across deployments

## Testing Your Deployment

1. **Check webhook endpoint:**
   ```
   https://your-app-name.netlify.app/api/omi/webhook
   ```
   Should return: `{"message":"OMI Webhook endpoint is active"}`

2. **Test with curl:**
   ```bash
   curl -X POST "https://your-app-name.netlify.app/api/omi/webhook?session_id=test123&uid=user456" \
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

3. **Configure OMI:**
   - Use: `https://your-app-name.netlify.app/api/omi/webhook`
   - This URL is permanent (won't change like ngrok)

## Custom Domain (Optional)

1. In Netlify dashboard → Site settings → Domain management
2. Add your custom domain
3. Update OMI webhook URL to use your custom domain

## Next Steps

Once deployed, you'll need to:

1. **Set up Convex** for database storage (webhook data needs to persist)
2. **Connect webhook to frontend** via Convex real-time subscriptions
3. **Update OMI settings** with your Netlify URL

## Comparison: Netlify vs Local Development

| Feature | Netlify (Free) | Local + ngrok |
|---------|---------------|---------------|
| URL Stability | ✅ Permanent | ❌ Changes each restart |
| HTTPS | ✅ Automatic | ✅ Automatic |
| Setup Time | ~5 minutes | ~2 minutes |
| Cost | Free | Free |
| Best For | Production/Testing | Quick local tests |

**Recommendation**: Use Netlify for a stable, permanent webhook URL! 🚀

