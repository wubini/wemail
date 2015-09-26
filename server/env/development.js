module.exports = {
  "DATABASE_URI": "mongodb://localhost:27017/gmail-app",
  "SESSION_SECRET": "Optimus Prime is my real dad",
  "TWITTER": {
    "consumerKey": "NPVkmbDdm117LP5m6o1LYZ7RI",
    "consumerSecret": "uQmw9ay6WedgnvZJameORKBuxEE0XRVg8J3TdE2A9Dt2hLAAGx",
    "callbackUrl": "http://127.0.0.1:1337/auth/twitter/callback"
  },
  "FACEBOOK": {
    "clientID": "1481547792146697",
    "clientSecret": "f5ba9b43dca2fac3b25a4ecc432909ea",
    "callbackURL": "http://127.0.0.1:1337/auth/facebook/callback"
  },
  "GOOGLE": {
    "clientID": "18279746287-4dp0je90cdqtjlqqj9m3o3hmi2m52i6g.apps.googleusercontent.com",
    "clientSecret": "vexQ7YK4XEuU8qOCyDsSCIJw",
    "callbackURL": "http://127.0.0.1:1337/auth/google/callback"
  }
};
