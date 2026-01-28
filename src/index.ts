import { CallAutomationClient, CallInvite } from "@azure/communication-call-automation";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Load configuration from environment variables
const connectionString = process.env.ACS_CONNECTION_STRING;
const toPhoneNumber = process.env.TO_PHONE_NUMBER;
const fromPhoneNumber = process.env.FROM_PHONE_NUMBER;
const callbackUri = process.env.CALLBACK_URI;

if (!connectionString || !toPhoneNumber || !fromPhoneNumber || !callbackUri) {
  console.error("❌ Missing required environment variables!");
  console.error("Please create a .env file with:");
  console.error("  ACS_CONNECTION_STRING");
  console.error("  TO_PHONE_NUMBER");
  console.error("  FROM_PHONE_NUMBER");
  console.error("  CALLBACK_URI");
  process.exit(1);
}

async function main() {
  try {
    console.log("Initializing Call Automation client...");
    const client = new CallAutomationClient(connectionString);

    console.log(`Placing call from ${fromPhoneNumber} to ${toPhoneNumber}...`);
    
    const callInvite: CallInvite = {
      targetParticipant: { phoneNumber: toPhoneNumber },
      sourceCallIdNumber: { phoneNumber: fromPhoneNumber }
    };

    // Create the call
    const result = await client.createCall(
      callInvite,
      callbackUri
    );

    console.log("✅ Call successfully initiated!");
    console.log("Call Connection ID:", result.callConnectionProperties.callConnectionId);
    console.log("Call State:", result.callConnectionProperties.callConnectionState);
    console.log("\nNote: You need to set up a webhook endpoint to receive call events.");
    console.log("Callback URL:", callbackUri);
    
    // The call will continue in the background
    // Events will be sent to your callback URL
    
  } catch (error: any) {
    console.error("❌ Error placing call:");
    console.error("Message:", error.message);
    if (error.statusCode) {
      console.error("Status Code:", error.statusCode);
    }
    if (error.code) {
      console.error("Error Code:", error.code);
    }
    process.exit(1);
  }
}

main();
