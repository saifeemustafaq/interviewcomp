# Debug Checklist: Transcriptions Not Showing

Since webhook is receiving data (you see it in Netlify logs), let's verify each step:

## ✅ Step 1: Verify Webhook is Storing Data

**Test the API endpoint directly:**
1. Open: https://intercmp.netlify.app/api/transcriptions
2. You should see JSON like:
   ```json
   {
     "success": true,
     "transcriptions": [
       {
         "id": "transcription-...",
         "sessionId": "88gwdZ02cwMbHjaZfOodS8Co2Ep2",
         "title": "OMI Transcription ...",
         "transcript": "then I think you'll understand....",
         "status": "active",
         ...
       }
     ]
   }
   ```

**If you see transcriptions here:**
✅ Webhook is storing data correctly!
❌ Problem is in frontend polling/sync

**If you see empty array `[]`:**
❌ Webhook isn't storing data (check webhook code)

## ✅ Step 2: Check Browser Console

1. Open your app: https://intercmp.netlify.app/transcriptions
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Look for:
   - `📥 Received transcriptions from API: X` (should show number > 0)
   - Any error messages
   - Network errors

**What to look for:**
- If you see "Received transcriptions from API: 1" → Polling is working!
- If you see errors → Check the error message
- If you see nothing → Polling might not be running

## ✅ Step 3: Check Network Tab

1. Open Browser DevTools (F12)
2. Go to **Network** tab
3. Filter by "transcriptions"
4. Look for requests to `/api/transcriptions`
5. Click on one → Check **Response** tab

**What to check:**
- Status should be `200`
- Response should contain transcriptions array
- Requests should happen every 2 seconds

## ✅ Step 4: Verify Polling is Active

The frontend polls every 2 seconds. To verify:
1. Open Console
2. You should see periodic logs: `📥 Received transcriptions from API: X`
3. If no logs → Polling might be disabled or there's an error

## Common Issues & Fixes

### Issue: API returns data but frontend doesn't show it
**Cause:** ID/sessionId matching issue
**Fix:** Already fixed in latest code - deploy and test

### Issue: No data in `/api/transcriptions`
**Cause:** In-memory store reset (Netlify cold start)
**Solution:** 
- Wait for webhook to receive new data
- Or use Convex/database for persistence

### Issue: Polling not working
**Cause:** JavaScript error or network issue
**Check:** Browser console for errors

## Quick Test

After deploying the fix:

1. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Open**: https://intercmp.netlify.app/transcriptions
3. **Open Console** (F12)
4. **Speak to OMI device**
5. **Wait 2-4 seconds**
6. **Check Console** for: `📥 Received transcriptions from API: 1`
7. **Check page** - transcription should appear!

If still not working, share:
- What you see in `/api/transcriptions` endpoint
- What you see in browser console
- Any error messages

