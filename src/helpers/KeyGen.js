const crypto = require("crypto");

// Generate a 64-character random key
const envKey = crypto.randomBytes(32).toString("hex"); // 32 bytes -> 64 hex characters
console.log(`Your generated key: ${envKey}`);
