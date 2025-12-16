import { execSync, spawn } from "child_process";
import dotenv from "dotenv";
import chokidar from "chokidar";
import { resolve, basename, relative } from "path";
import { WebSocketServer } from "ws";

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

// Track which essays are currently open in browser tabs
// Map of WebSocket client -> Set of essay slugs they're viewing
const clientEssays = new Map();

// Get all unique essays currently being viewed
function getOpenEssays() {
  const allEssays = new Set();
  for (const essays of clientEssays.values()) {
    for (const slug of essays) {
      allEssays.add(slug);
    }
  }
  return allEssays;
}

// Extract essay slug from a changed file path
function getEssaySlugFromPath(changedPath) {
  const relativePath = relative(resolvedEssaysDir, changedPath);
  
  // If it's a markdown file at the root level (e.g., "meritocracy.md")
  if (relativePath.endsWith(".md") && !relativePath.includes("/")) {
    return basename(relativePath, ".md");
  }
  
  // If it's in the assets directory (e.g., "assets/meritocracy/images/page0.jpeg")
  if (relativePath.startsWith("assets/")) {
    const parts = relativePath.split("/");
    if (parts.length >= 2) {
      return parts[1]; // The essay slug is the first folder inside assets
    }
  }
  
  return null;
}

// Create WebSocket server for essay tracking
const WS_PORT = 3001;
const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", (ws) => {
  // Initialize this client's essay set
  clientEssays.set(ws, new Set());
  
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === "view") {
        const essays = clientEssays.get(ws);
        if (essays) {
          essays.add(message.slug);
        }
      } else if (message.type === "unview") {
        const essays = clientEssays.get(ws);
        if (essays) {
          essays.delete(message.slug);
        }
      }
    } catch (e) {
      // Silent fail for parse errors
    }
  });
  
  ws.on("close", () => {
    clientEssays.delete(ws);
  });
  
  ws.on("error", () => {
    clientEssays.delete(ws);
  });
});

console.log(`📡 Essay tracker WebSocket server running on ws://localhost:${WS_PORT}`);

// Copy files initially
console.log("Syncing essays to src/content/essays...");
try {
  execSync("node scripts/sync-essays.mjs", { stdio: "inherit" });
} catch (error) {
  console.error("Failed to sync essays:", error);
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
let pendingChanges = new Set(); // Track which essays have pending changes

const processChanges = () => {
  if (isProcessing) {
    return;
  }

  // Get essays that have changes and are currently open
  const openEssays = getOpenEssays();
  const essaysToReload = [...pendingChanges].filter(slug => 
    slug === null || openEssays.has(slug)
  );
  
  if (essaysToReload.length === 0) {
    if (pendingChanges.size > 0) {
      console.log(`⏭️  Skipped reload: ${[...pendingChanges].join(", ")} (not open in browser)`);
    }
    pendingChanges.clear();
    return;
  }

  isProcessing = true;
  pendingChanges.clear();
  
  console.log(`🔄 Reloading: ${essaysToReload.join(", ")}`);

  try {
    // Pass the slugs to the sync script so it knows which essays to reload
    execSync(`node scripts/sync-essays.mjs --changed-slugs=${essaysToReload.join(",")}`, { 
      stdio: "pipe" 
    });
  } catch (error) {
    console.error("❌ Failed to copy essays:", error.message);
  }

  isProcessing = false;

  // If more changes came in while processing, handle them
  if (pendingChanges.size > 0) {
    setTimeout(processChanges, 100);
  }
};

// Debounce changes - wait for 500ms of quiet before processing
let changeTimeout = null;
const scheduleProcessing = (slug) => {
  if (slug) {
    pendingChanges.add(slug);
  }
  
  if (changeTimeout) {
    clearTimeout(changeTimeout);
  }
  
  changeTimeout = setTimeout(processChanges, 500);
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
  .on("add", (path) => scheduleProcessing(getEssaySlugFromPath(path)))
  .on("change", (path) => scheduleProcessing(getEssaySlugFromPath(path)))
  .on("unlink", (path) => scheduleProcessing(getEssaySlugFromPath(path)))
  .on("error", (error) => console.error(`Watcher error: ${error}`))
  .on("ready", () => console.log("✅ Watching for essay changes...\n"));

// Handle cleanup on process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...");
  watcher.close();
  wss.close();
  viteProcess.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  watcher.close();
  wss.close();
  viteProcess.kill();
  process.exit(0);
});
