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

2. **Create a `.env` file** from the example template:
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file** with your Azure credentials:
   ```env
   ACS_CONNECTION_STRING=endpoint=https://your-acs-resource.communication.azure.com/;accesskey=your_access_key
   TO_PHONE_NUMBER=+1234567890
   FROM_PHONE_NUMBER=+1987654321
   CALLBACK_URI=https://your-webhook-url.com/api/callbacks
   ```
   
   - `ACS_CONNECTION_STRING`: Get this from Azure Portal → Communication Services → Keys
   - `FROM_PHONE_NUMBER`: Your ACS phone number (must be purchased through Azure)
   - `TO_PHONE_NUMBER`: Destination phone number (E.164 format)
   - `CALLBACK_URI`: Your public webhook URL (will be generated in Step 1)

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

**Copy the callback URL** and update your `.env` file:
```env
CALLBACK_URI=https://abc123.ngrok.io/api/callbacks
```

### Step 2: Make the Call

In a **second terminal**, run:

```bash
npm run call
```

This will read your configuration from `.env` and initiate the call using your callback URL.

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

**Missing Environment Variables**
- Ensure `.env` file exists and contains all required variables
- Never commit the `.env` file to git (it's in `.gitignore`)
- Use `.env.example` as a template

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
