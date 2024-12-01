const admin = require('firebase-admin');
require('dotenv').config();

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Error parsing Firebase configuration: ", error);
  process.exit(1);
}

module.exports = admin;
