const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connect to the specific database 'Virtual-Garden' (user mentioned they consolidated here or will consolidate)
      // Mongoose automatically handles multiple connections if we specify the dbName
      dbName: 'Virtual-Garden', 
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
