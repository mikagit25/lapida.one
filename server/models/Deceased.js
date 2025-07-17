import mongoose from 'mongoose';

const DeceasedSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    deathDate: { type: Date, required: true },
    epitaph: { type: String, default: '' },
    slug: { type: String, required: true, unique: true },
    gallery: [String], // массив URL картинок
  },
  { timestamps: true },
);

export default mongoose.model('Deceased', DeceasedSchema);
