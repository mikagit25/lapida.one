import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  memorials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Memorial' }],
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }],
  companies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  recommendedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  religiousOrgs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrg' }],
  recommendedReligiousOrgs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrg' }]
});

export default mongoose.model('User', UserSchema);