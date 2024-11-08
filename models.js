import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

const postSchema = new mongoose.Schema({
  url: { type: String, required: true },
  description: { type: String, required: true },
  created_date: { type: Date, default: Date.now }  // Automatically sets the creation date
});

const Post = mongoose.model('Post', postSchema);

export const models = { Post };
