const admin = require('firebase-admin');
const serviceAccount = require('./path-to-firebase-service-account-key.json'); // Firebase console se download karein

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware function jo token check karega
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // User ki details (uid, phone_number) request me save ho jayengi
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyFirebaseToken;