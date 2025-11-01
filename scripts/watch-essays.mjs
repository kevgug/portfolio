import { spawn } from "child_process";
import dotenv from "dotenv";
import { execSync } from "child_process";

// Load environment variables
dotenv.config();

const essaysDir = process.env.ESSAYS_DIR;
if (!essaysDir) {
  console.error("ERROR: ESSAYS_DIR environment variable is not set.");
  console.error("Please create a .env file with: ESSAYS_DIR=/path/to/essays");
  process.exit(1);
}

console.log(`Watching essays directory: ${essaysDir}`);

// Copy files initially
console.log("Copying essays to static/essays...");
try {
  execSync("node scripts/copy-essays-to-static.mjs", { stdio: "inherit" });
} catch (error) {
  console.error("Failed to copy essays:", error);
  process.exit(1);
}

// Start vite dev server in background
console.log("Starting Vite dev server...");
const viteProcess = spawn("npm", ["run", "dev:vite"], {
  stdio: "inherit",
  shell: true,
  detached: false,
});

// Spawn nodemon with the essays directory to watch
// On change, copy files and regenerate index
const nodemon = spawn("nodemon", [
  "--watch",
  essaysDir,
  "-e",
  "md,jpg,jpeg,png,gif,webp,svg,mp3,wav,mp4,webm",
  "--exec",
  "node scripts/copy-essays-to-static.mjs && node scripts/generate-essay-index.mjs",
], {
  stdio: "inherit",
  shell: true,
});

viteProcess.on("error", (error) => {
  console.error(`Failed to start vite: ${error.message}`);
  process.exit(1);
});

nodemon.on("error", (error) => {
  console.error(`Failed to start nodemon: ${error.message}`);
  viteProcess.kill();
  process.exit(1);
});

nodemon.on("exit", (code) => {
  viteProcess.kill();
  process.exit(code || 0);
});

// Handle cleanup on process termination
process.on("SIGINT", () => {
  viteProcess.kill();
  nodemon.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  viteProcess.kill();
  nodemon.kill();
  process.exit(0);
});
