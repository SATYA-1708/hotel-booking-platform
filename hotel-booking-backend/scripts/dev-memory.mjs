import { spawn } from "node:child_process";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri("hotel-booking");
console.log(`[dev-memory] In-memory MongoDB ready: ${uri}`);

const env = { ...process.env, MONGODB_CONNECTION_STRING: uri };

const shutdown = () => { mongod.stop().finally(() => process.exit(0)); };
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const seed = spawn("npm run seed", { stdio: "inherit", shell: true, env });
seed.on("exit", (code) => {
  if (code !== 0) console.log("[dev-memory] Seed failed/skipped — starting server anyway");
  const dev = spawn("npm run dev", { stdio: "inherit", shell: true, env });
  dev.on("exit", () => shutdown());
});
