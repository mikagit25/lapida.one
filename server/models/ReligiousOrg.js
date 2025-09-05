import mongoose from 'mongoose';

const ReligiousOrgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.models.ReligiousOrg || mongoose.model('ReligiousOrg', ReligiousOrgSchema);