import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  memorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Memorial' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);