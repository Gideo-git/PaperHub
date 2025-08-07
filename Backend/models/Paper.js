import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    examType: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    file: {
        data: {
            type: Buffer,       // Stores the file as binary data
            required: true
        },
        contentType: {
            type: String,       // Stores the MIME type (e.g., 'application/pdf')
            required: true
        },
        originalName: {
            type: String,       // Stores the original filename
            required: true
        }
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Paper = mongoose.model('Paper', paperSchema);

export default Paper;