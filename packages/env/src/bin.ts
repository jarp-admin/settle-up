#!/usr/bin/env node

import check from "./check";

console.log("Checking Environment Variables....\n");

try {
  check();
  console.log("[✅] Environment variables OK");
} catch (e) {
  console.log("[❌] Environment Variable check failed");
}
