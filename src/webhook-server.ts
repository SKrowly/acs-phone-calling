import express, { Request, Response, NextFunction } from "express";
import ngrok from "ngrok";

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log all incoming requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`\n📨 Incoming ${req.method} ${req.path}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  next();
});

// Main webhook endpoint for call events
app.post("/api/callbacks", async (req: Request, res: Response) => {
  try {
    const events = req.body;
    
    console.log("\n" + "=".repeat(80));
    console.log("🔔 CALL EVENT RECEIVED");
    console.log("=".repeat(80));
    
    // Handle array of events or single event
    const eventArray = Array.isArray(events) ? events : [events];
    
    for (const event of eventArray) {
      const eventType = event.type || event.eventType;
      const data = event.data || event;
      
      console.log(`\n📞 Event Type: ${eventType}`);
      console.log(`⏰ Time: ${new Date().toLocaleString()}`);
      
      switch (eventType) {
        case "Microsoft.Communication.CallConnected":
          console.log("✅ CALL CONNECTED!");
          console.log(`   Call Connection ID: ${data.callConnectionId}`);
          console.log(`   Server Call ID: ${data.serverCallId}`);
          console.log(`   Correlation ID: ${data.correlationId}`);
          break;
          
        case "Microsoft.Communication.CallDisconnected":
          console.log("📴 CALL DISCONNECTED");
          console.log(`   Call Connection ID: ${data.callConnectionId}`);
          console.log(`   Server Call ID: ${data.serverCallId}`);
          break;
          
        case "Microsoft.Communication.CallTransferAccepted":
          console.log("🔄 CALL TRANSFER ACCEPTED");
          break;
          
        case "Microsoft.Communication.CallTransferFailed":
          console.log("❌ CALL TRANSFER FAILED");
          break;
          
        case "Microsoft.Communication.ParticipantsUpdated":
          console.log("👥 PARTICIPANTS UPDATED");
          if (data.participants) {
            console.log(`   Participants: ${data.participants.length}`);
          }
          break;
          
        case "Microsoft.Communication.RecordingStateChanged":
          console.log("🎙️  RECORDING STATE CHANGED");
          console.log(`   State: ${data.recordingState}`);
          break;
          
        case "Microsoft.Communication.PlayCompleted":
          console.log("🔊 PLAY COMPLETED");
          break;
          
        case "Microsoft.Communication.PlayFailed":
          console.log("❌ PLAY FAILED");
          if (data.resultInformation) {
            console.log(`   Reason: ${data.resultInformation.message}`);
          }
          break;
          
        case "Microsoft.Communication.RecognizeCompleted":
          console.log("🎤 RECOGNIZE COMPLETED");
          break;
          
        case "Microsoft.Communication.RecognizeFailed":
          console.log("❌ RECOGNIZE FAILED");
          break;
          
        default:
          console.log(`ℹ️  Other Event: ${eventType}`);
      }
      
      // Log full event data
      console.log("\n📋 Full Event Data:");
      console.log(JSON.stringify(data, null, 2));
    }
    
    console.log("\n" + "=".repeat(80) + "\n");
    
    // Respond with 200 OK
    res.status(200).send("Event received");
    
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).send("Error processing event");
  }
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({ 
    message: "Azure Communication Services Webhook Server",
    endpoints: {
      callback: "/api/callbacks",
      health: "/health"
    }
  });
});

// Start server and optionally expose with ngrok
async function startServer() {
  try {
    // Start Express server
    const server = app.listen(PORT, () => {
      console.log("🚀 Webhook server started!");
      console.log(`📍 Local URL: http://localhost:${PORT}`);
      console.log(`📍 Callback endpoint: http://localhost:${PORT}/api/callbacks`);
    });
    
    // Try to connect to ngrok for public URL (optional)
    console.log("\n🌐 Attempting to connect to ngrok for public URL...");
    console.log("   (If this fails, you can use ngrok manually or skip it for local testing)\n");
    
    try {
      // Kill any existing ngrok tunnels first
      await ngrok.kill();
      
      const url = await ngrok.connect({
        addr: PORT,
        authtoken: process.env.NGROK_AUTH_TOKEN // Optional: set NGROK_AUTH_TOKEN env variable
      });
      
      console.log("\n" + "=".repeat(80));
      console.log("✅ PUBLIC WEBHOOK URL READY!");
      console.log("=".repeat(80));
      console.log(`\n🌍 Public URL: ${url}`);
      console.log(`🔗 Callback URL: ${url}/api/callbacks`);
      console.log("\n📝 Use this URL when making calls:");
      console.log(`   const callbackUri = "${url}/api/callbacks";`);
      console.log("\n" + "=".repeat(80));
      
    } catch (ngrokError: any) {
      console.log("\n⚠️  Could not connect to ngrok:", ngrokError.message);
      console.log("\n📝 Alternative options:");
      console.log("   1. Install ngrok separately: https://ngrok.com/download");
      console.log("      Then run: ngrok http 3000");
      console.log("   2. Use a different tunneling service");
      console.log("   3. Deploy to Azure Functions or another public endpoint");
      console.log("\n" + "=".repeat(80));
    }
    
    console.log("\n⏳ Waiting for webhook events... (Press Ctrl+C to stop)\n");
    
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

startServer();
