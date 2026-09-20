import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set in Backend/.env');

  try {
    await mongoose.connect(uri, {
      dbName: 'aether_press',
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('\n❌ MongoDB connection failed!\n');
    if (err.message?.includes('whitelist') || err.name === 'MongooseServerSelectionError') {
      console.error('Reason: Your IP is NOT allowed in MongoDB Atlas.');
      console.error('\nFix (2 minutes):');
      console.error('  1. Open https://cloud.mongodb.com');
      console.error('  2. Go to Network Access → Add IP Address');
      console.error('  3. Click "Allow Access from Anywhere" (0.0.0.0/0) for dev');
      console.error('  4. Wait 1-2 min, then run: npm start\n');
    } else {
      console.error(err.message);
    }
    throw err;
  }
}
