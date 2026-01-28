# Webhook Setup Complete! ✅

Your webhook server is now running on **http://localhost:3000**

## 🌐 Getting a Public URL (Required for Azure Callbacks)

Azure Communication Services needs a **public HTTPS URL** to send call events. Here are your options:

### Option 1: Use ngrok (Recommended for Testing)

1. **Download ngrok**: https://ngrok.com/download
2. **Extract and run**:
   ```bash
   ngrok http 3000
   ```
3. **Copy the HTTPS URL** shown (e.g., `https://abc123.ngrok.io`)
4. **Your callback URL** will be: `https://abc123.ngrok.io/api/callbacks`

### Option 2: Use Your Own Public Server

Deploy the webhook server to:
- Azure Functions
- Azure App Service
- Any public server with HTTPS

## 📞 Making a Test Call

Once you have a public URL:

### In a NEW terminal window:

```bash
cd C:\Users\vinodsoni\acs-phone-calling
npm run call
```

When prompted, paste your callback URL (e.g., `https://abc123.ngrok.io/api/callbacks`)

## 📊 Monitoring Events

Watch this terminal for real-time call events:
- ✅ CallConnected - Phone was answered
- 📴 CallDisconnected - Call ended
- 👥 ParticipantsUpdated - Someone joined/left

## 🔍 Testing Webhook Locally

To verify your webhook is working, test it with curl:

```bash
curl -X POST http://localhost:3000/api/callbacks -H "Content-Type: application/json" -d "{\"type\": \"test\"}"
```

---

**Current Status:**
- ✅ Webhook server: Running on port 3000
- ⏳ Public URL: Waiting (use ngrok or another method)
- 📞 Ready to receive calls once public URL is configured

Press Ctrl+C in this terminal to stop the webhook server.
