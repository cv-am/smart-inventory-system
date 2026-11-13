import app from "./src/app.js";
import { config } from "./src/config/env.js";

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`Smart Inventory Server running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
});
