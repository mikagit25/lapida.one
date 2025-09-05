import mongoose from 'mongoose';


const DeceasedSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    deathDate: { type: Date, required: true },
    epitaph: { type: String, default: '' },
    slug: { type: String, required: true, unique: true },
    gallery: [String],
    timeline: [
      {
        date: Date,
        text: String,
        media: String,
      },
    ],
    flowers: [
      {
        date: Date,
      },
    ],
    candles: [
      {
        date: Date,
      },
    ],
    comments: [
      {
        text: String,
        date: Date,
      },
    ],
    privacy: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
  },
  { timestamps: true },
);

export default mongoose.model('Deceased', DeceasedSchema);
