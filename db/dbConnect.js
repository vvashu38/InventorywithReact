const mongoose = require("mongoose");

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL, clientOptions);
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  }
}

module.exports = dbConnect;
