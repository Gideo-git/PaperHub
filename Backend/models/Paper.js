import mongoose from 'mongoose';

  const paperSchema = new mongoose.Schema({
    title: String,
    semester: String,
    subject: String,
    year: Number,
    examType: String,
    file: {
      data: Buffer,
      contentType: String,
      originalName: String,
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }, { timestamps: true });

export default mongoose.model('Paper', paperSchema);