import { execSync, spawn } from "child_process";
import dotenv from "dotenv";
import chokidar from "chokidar";
import { resolve } from "path";

// Load environment variables
dotenv.config();

const essaysDir = process.env.ESSAYS_DIR;
if (!essaysDir) {
  console.error("ERROR: ESSAYS_DIR environment variable is not set.");
  console.error("Please create a .env file with: ESSAYS_DIR=/path/to/essays");
  process.exit(1);
}

// Resolve the full path (important for iCloud paths)
const resolvedEssaysDir = resolve(essaysDir);
console.log(`Watching essays directory: ${resolvedEssaysDir}`);

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

viteProcess.on("error", (error) => {
  console.error(`Failed to start vite: ${error.message}`);
  process.exit(1);
});

// Watch essays directory with chokidar (better for iCloud)
let isProcessing = false;
let pendingReload = false;

const processChanges = () => {
  if (isProcessing) {
    pendingReload = true;
    return;
  }

  isProcessing = true;
  console.log("\n📝 Essays changed, copying files...");

  try {
    execSync("node scripts/copy-essays-to-static.mjs", { stdio: "inherit" });
    console.log("✅ Essays copied successfully\n");
  } catch (error) {
    console.error("❌ Failed to copy essays:", error.message);
  }

  isProcessing = false;

  if (pendingReload) {
    pendingReload = false;
    setTimeout(processChanges, 100);
  }
};

const watcher = chokidar.watch(resolvedEssaysDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
  usePolling: true, // Essential for iCloud
  interval: 1000, // Poll every 1 second
  binaryInterval: 2000,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 500,
  },
});

watcher
  .on("add", (path) => {
    console.log(`File added: ${path}`);
    processChanges();
  })
  .on("change", (path) => {
    console.log(`File changed: ${path}`);
    processChanges();
  })
  .on("unlink", (path) => {
    console.log(`File removed: ${path}`);
    processChanges();
  })
  .on("error", (error) => {
    console.error(`Watcher error: ${error}`);
  })
  .on("ready", () => {
    console.log("✅ Watching for essay changes...\n");
  });

// Handle cleanup on process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...");
  watcher.close();
  viteProcess.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  watcher.close();
  viteProcess.kill();
  process.exit(0);
});
