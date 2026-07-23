#!/usr/bin/env node
import { execSync, spawn } from "node:child_process";
import { rmSync } from "node:fs";

function killPort(port) {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: "ignore" });
  } catch {
    // nothing listening
  }
}

killPort(3000);
killPort(3001);

rmSync(".next", { recursive: true, force: true });

console.log("Building production site...");
execSync("npm run build", { stdio: "inherit" });

console.log("Starting production server at http://localhost:3000");
const child = spawn("npx", ["next", "start", "-p", "3000"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
