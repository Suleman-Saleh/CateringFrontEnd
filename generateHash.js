// generateHash.js
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is installed: npm install bcryptjs

const passwordToHash = "admin"; // The plaintext password you want to hash
const saltRounds = 10; // The same salt rounds you use in RegisterScreen

const hashedPassword = bcrypt.hashSync(passwordToHash, saltRounds);
console.log("-----------------------------------------");
console.log("COPY THIS HASH:");
console.log(hashedPassword);
console.log("-----------------------------------------");