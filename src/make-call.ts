import { CallAutomationClient, CallInvite } from "@azure/communication-call-automation";
import * as readline from "readline";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Load configuration from environment variables
const connectionString = process.env.ACS_CONNECTION_STRING;
const toPhoneNumber = process.env.TO_PHONE_NUMBER;
const fromPhoneNumber = process.env.FROM_PHONE_NUMBER;

if (!connectionString || !toPhoneNumber || !fromPhoneNumber) {
  console.error("❌ Missing required environment variables!");
  console.error("Please create a .env file with:");
  console.error("  ACS_CONNECTION_STRING");
  console.error("  TO_PHONE_NUMBER");
  console.error("  FROM_PHONE_NUMBER");
  process.exit(1);
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    console.log("\n" + "=".repeat(80));
    console.log("📞 AZURE COMMUNICATION SERVICES - MAKE PHONE CALL");
    console.log("=".repeat(80) + "\n");
    
    // Get callback URL from user
    console.log("ℹ️  You need a public webhook URL to receive call events.");
    console.log("   Run 'npm run webhook' in another terminal to start the webhook server.\n");
    
    const callbackUri = await question("Enter your webhook callback URL: ");
    
    if (!callbackUri || !callbackUri.startsWith("http")) {
      console.error("❌ Invalid callback URL. It must start with http:// or https://");
      rl.close();
      process.exit(1);
    }
    
    console.log("\n📋 Call Configuration:");
    console.log(`   From: ${fromPhoneNumber}`);
    console.log(`   To: ${toPhoneNumber}`);
    console.log(`   Callback: ${callbackUri}`);
    
    const confirm = await question("\n❓ Proceed with the call? (yes/no): ");
    
    if (confirm.toLowerCase() !== "yes" && confirm.toLowerCase() !== "y") {
      console.log("❌ Call cancelled.");
      rl.close();
      process.exit(0);
    }
    
    console.log("\n🔄 Initializing Call Automation client...");
    const client = new CallAutomationClient(connectionString!);

    console.log(`📞 Placing call from ${fromPhoneNumber} to ${toPhoneNumber}...`);
    
    const callInvite: CallInvite = {
      targetParticipant: { phoneNumber: toPhoneNumber! },
      sourceCallIdNumber: { phoneNumber: fromPhoneNumber! }
    };

    // Create the call
    const result = await client.createCall(
      callInvite,
      callbackUri
    );

    console.log("\n" + "=".repeat(80));
    console.log("✅ CALL SUCCESSFULLY INITIATED!");
    console.log("=".repeat(80));
    console.log(`\n📋 Call Details:`);
    console.log(`   Call Connection ID: ${result.callConnectionProperties.callConnectionId}`);
    console.log(`   Call State: ${result.callConnectionProperties.callConnectionState}`);
    console.log(`   Server Call ID: ${result.callConnectionProperties.serverCallId || 'N/A'}`);
    console.log(`   Callback URL: ${result.callConnectionProperties.callbackUrl}`);
    console.log("\n" + "=".repeat(80));
    console.log("\n✅ Call initiated! Check your webhook server for events.");
    console.log("📞 The phone should start ringing shortly...\n");
    
    rl.close();
    
  } catch (error: any) {
    console.error("\n" + "=".repeat(80));
    console.error("❌ ERROR PLACING CALL");
    console.error("=".repeat(80));
    console.error("\nMessage:", error.message);
    if (error.statusCode) {
      console.error("Status Code:", error.statusCode);
    }
    if (error.code) {
      console.error("Error Code:", error.code);
    }
    if (error.details) {
      console.error("Details:", JSON.stringify(error.details, null, 2));
    }
    console.error("\n" + "=".repeat(80) + "\n");
    rl.close();
    process.exit(1);
  }
}

main();
