# Azure Communication Services Phone Calling

This project demonstrates how to make phone calls using Azure Communication Services Call Automation SDK.

## Prerequisites

1. **Azure Communication Services resource** with phone calling enabled
2. **A phone number purchased** through your ACS resource
3. **Node.js** installed (v18 or higher recommended)

## Important Notes

⚠️ **Phone Number Requirements:**
- `fromPhoneNumber`: Must be a phone number you've purchased through your Azure Communication Services resource
- `toPhoneNumber`: The destination phone number (must be in E.164 format, e.g., +1234567890)
- Format: No dashes, spaces, or parentheses - just `+` and digits

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Phone numbers are already configured in the code:
   - From: `+18774439094` (your ACS number)
   - To: `+15022990641` (destination)

## How to Make a Call

### Step 1: Start the Webhook Server

In the first terminal, start the webhook server to receive call events:

```bash
npm run webhook
```

This will:
- Start a local Express server on port 3000
- Automatically connect to ngrok to get a public URL
- Display the public webhook URL you need to use

You'll see output like:
```
🌍 Public URL: https://abc123.ngrok.io
🔗 Callback URL: https://abc123.ngrok.io/api/callbacks
```

**Copy the callback URL!**

### Step 2: Make the Call

In a **second terminal**, run:

```bash
npm run call
```

When prompted:
1. Paste the callback URL from the webhook server
2. Confirm to proceed with the call

### Step 3: Monitor Events

Watch the webhook server terminal for real-time call events:
- ✅ `CallConnected` - Call was answered
- 📴 `CallDisconnected` - Call ended
- 👥 `ParticipantsUpdated` - Participants joined/left
- And more...

## Available Scripts

- `npm run webhook` - Start the webhook server with ngrok
- `npm run call` - Make a phone call (interactive)
- `npm run dev` - Run the original simple example
- `npm run build` - Compile TypeScript

## Webhook Events

The webhook server handles these Azure Communication Services events:

| Event | Description |
|-------|-------------|
| `CallConnected` | Call successfully connected |
| `CallDisconnected` | Call ended |
| `ParticipantsUpdated` | Participants changed |
| `PlayCompleted` | Audio playback finished |
| `RecordingStateChanged` | Recording started/stopped |
| `RecognizeCompleted` | DTMF/Speech recognition done |

## Troubleshooting

**Ngrok Authentication (Optional)**
- Free ngrok works without auth but has limits
- For more stability, sign up at https://ngrok.com and set:
  ```bash
  set NGROK_AUTH_TOKEN=your_token_here
  ```

**Phone Call Fails**
- Verify your ACS resource has PSTN calling enabled
- Check that the phone number is properly provisioned
- Ensure the callback URL is publicly accessible
- Verify phone numbers are in E.164 format

**Webhook Not Receiving Events**
- Make sure the webhook server is running
- Verify the ngrok tunnel is active
- Check firewall settings
