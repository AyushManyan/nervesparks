import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log(' MongoDB connected', uri))
  .catch(err => { console.error(' MongoDB connect error', err); process.exit(1); });
