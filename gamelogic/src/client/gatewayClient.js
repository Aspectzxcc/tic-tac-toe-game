const axios = require("axios");

const GATEWAY_URL = "http://localhost:3001";

async function notifyGateway(events) {
  try {
    console.log(`Notifying gateway with events:`, events.map((e) => e.event));
    await axios.post(
      `${GATEWAY_URL}/api/internal/broadcast`,
      { events },
      {
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": "your-super-secret-key",
        },
      }
    );
  } catch (error) {
    console.error(`Error notifying gateway: ${error.message}`);
  }
}

module.exports = notifyGateway;