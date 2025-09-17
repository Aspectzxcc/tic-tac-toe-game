const axios = require("axios");

const GATEWAY_URL = "http://localhost:3001";

async function notifyGateway(event, data) {
  try {
    console.log(`Notifying gateway with event '${event}'`);
    await axios.post(
      `${GATEWAY_URL}/api/internal/broadcast`,
      { event, data },
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