import mongoose from 'mongoose';

const TimelineEventSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  text: { type: String, required: true },
  media: { type: String } // ссылка на фото/видео (опционально)
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  gallery: [{ type: String }], // массив ссылок на фото
  videos: [{ type: String }],  // массив ссылок на видео
  timeline: [TimelineEventSchema], // события жизни
  flowers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  candles: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  memorials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Memorial' }],
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }],
  companies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  recommendedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  religiousOrgs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrg' }],
  recommendedReligiousOrgs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrg' }],
  privacy: { type: String, enum: ['public', 'friends', 'private'], default: 'public' }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);