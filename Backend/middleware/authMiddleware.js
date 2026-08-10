const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// This middleware throws an error if the user is not authenticated
const requireAuth = ClerkExpressRequireAuth({
  // options can be passed here if needed
});

module.exports = { requireAuth };
