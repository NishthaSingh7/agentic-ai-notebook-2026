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

const child = spawn("npx", ["next", "dev", "--turbo"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
