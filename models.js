import mongoose from 'mongoose';

let models = {};

async function connectToDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    
    // Local MongoDB connection
    await mongoose.connect('mongodb://localhost:27017/qwerty');

    // MongoDB Atlas connection
    // await mongoose.connect('mongodb+srv://qwerty:0dVJRllT7Tp7GT5W@cluster0.00e82.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

    console.log("Successfully connected to MongoDB!");

    // Define the schema
    const userSchema = new mongoose.Schema({
      url: String,
      description: String,
      created_date: { type: Date, default: Date.now }
    });

    // Create the User model
    models.User = mongoose.model('User', userSchema);
    console.log("Mongoose models created");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();

export default models;
