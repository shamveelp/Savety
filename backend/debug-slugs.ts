import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Upload = mongoose.connection.collection('uploads');
    const uploads = await Upload.find().limit(10).toArray();
    console.log(JSON.stringify(uploads.map(u => ({ id: u._id, title: u.title, slug: u.slug })), null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

debug();
