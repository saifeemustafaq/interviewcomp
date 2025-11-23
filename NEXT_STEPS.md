# ✅ Convex Setup Complete - Next Steps

Great! Your Convex functions are ready. Now let's deploy to production and connect to Netlify.

## ✅ Step 1: Deploy Convex to Production

Run this command:

```bash
npx convex deploy
```

This will:
- Deploy your schema to production
- Deploy your functions
- Make everything available for your live site

**Expected output**: You'll see deployment confirmation and URLs.

## ✅ Step 2: Add Environment Variable to Netlify

**CRITICAL**: This is required for your live site to connect to Convex!

1. Go to: https://app.netlify.com/sites/intercmp/settings/env
2. Click **"Add variable"** button
3. Add:
   - **Key**: `NEXT_PUBLIC_CONVEX_URL`
   - **Value**: `https://shiny-spoonbill-523.convex.cloud`
4. Click **"Save"**

## ✅ Step 3: Redeploy Netlify Site

After adding the environment variable:

1. Go to **Deploys** tab in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete

**Important**: Environment variables only take effect after redeploy!

## ✅ Step 4: Verify Connection

### Test 1: Check Browser Console
1. Visit: https://intercmp.netlify.app/transcriptions
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Should see: "Connected to Convex" (no errors)

### Test 2: Check Convex Dashboard
1. Go to: https://dashboard.convex.dev/t/mustafa-saifee/interviewconvex/data
2. Click on **"transcriptions"** table
3. Should see empty table (ready for data)

### Test 3: Test with OMI
1. Start speaking to your OMI device
2. Check Convex dashboard - transcriptions should appear!
3. Check your site - transcriptions should appear in real-time!

## ✅ Success Checklist

You'll know everything is working when:
- ✅ `npx convex deploy` completes successfully
- ✅ Environment variable added to Netlify
- ✅ Netlify site redeployed
- ✅ Browser console shows Convex connection
- ✅ Transcriptions appear in Convex dashboard
- ✅ Transcriptions appear on your live site
- ✅ Stop button saves transcriptions
- ✅ Data persists after refresh

## 🚨 If Something Doesn't Work

### Issue: "Convex not connected" in browser
- Check Netlify environment variable is set
- Verify you redeployed after adding it
- Check browser console for specific errors

### Issue: Webhook receives data but nothing appears
- Check Convex dashboard for data
- Verify environment variable in Netlify
- Check Netlify function logs

### Issue: Functions not found
- Run `npx convex deploy` again
- Check Convex dashboard → Functions tab

## 📝 Quick Reference

**Your Convex URLs:**
- Dashboard: https://dashboard.convex.dev/t/mustafa-saifee/interviewconvex
- Deployment: `https://shiny-spoonbill-523.convex.cloud`
- HTTP Action: `https://shiny-spoonbill-523.convex.site/api/http/omiWebhook`

**Your Netlify URLs:**
- Site: https://intercmp.netlify.app
- Webhook: https://intercmp.netlify.app/api/omi/webhook

**OMI Webhook URL** (keep this):
- `https://intercmp.netlify.app/api/omi/webhook`

