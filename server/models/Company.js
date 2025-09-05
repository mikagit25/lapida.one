import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: String,
  photo: String, // url аватара
  gallery: [String], // массив url изображений
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  services: [
    {
      name: { type: String, required: true },
      description: String,
      price: Number,
      image: String // url изображения услуги
    }
  ],
});

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);