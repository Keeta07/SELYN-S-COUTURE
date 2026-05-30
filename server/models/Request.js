import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['custom-order', 'training-application', 'uniform-bulk-order']
    },
    name: { type: String, required: true },
    email: String,
    phone: { type: String, required: true },
    details: { type: String, required: true },
    budget: String,
    eventDate: String,
    schoolName: String,
    studentCount: Number,
    course: String,
    experience: String,
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'approved', 'completed', 'closed'],
      default: 'new'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Request || mongoose.model('Request', requestSchema);
