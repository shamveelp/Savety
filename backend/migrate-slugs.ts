import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const UploadSchema = new mongoose.Schema({
  title: String,
  userId: mongoose.Schema.Types.ObjectId,
  slug: String
}, { strict: false });

const Upload = mongoose.model('Upload', UploadSchema);

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to DB for migration');

    const uploads = await Upload.find({ $or: [{ slug: { $exists: false } }, { slug: '' }] });
    console.log(`Found ${uploads.length} uploads to migrate.`);

    for (const upload of uploads) {
      let slug = (upload as any).title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!slug) slug = 'memory-' + upload._id.toString().slice(-4);
      
      // Ensure it doesn't duplicate for this user (simple check)
      const existing = await Upload.findOne({ userId: upload.userId, slug, _id: { $ne: upload._id } });
      if (existing) {
          slug = `${slug}-${Math.random().toString(36).slice(-3)}`;
      }

      await Upload.updateOne({ _id: upload._id }, { $set: { slug } });
      console.log(`Updated [${upload.title}] to slug: ${slug}`);
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
