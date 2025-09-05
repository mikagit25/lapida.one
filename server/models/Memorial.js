import mongoose from 'mongoose';

const TimelineEventSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  text: { type: String, required: true },
  media: { type: String }
});

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const MemorialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date },
  deathDate: { type: Date },
  biography: { type: String },
  imageUrl: { type: String },
  location: { type: String },
  shareUrl: { type: String, unique: true },
  privacy: { type: String, enum: ['public', 'private'], default: 'public' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gallery: [{ type: String }],
  videos: [{ type: String }],
  timeline: [TimelineEventSchema],
  flowers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  candles: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  comments: [CommentSchema]
}, { timestamps: true });

export default mongoose.models.Memorial || mongoose.model('Memorial', MemorialSchema);