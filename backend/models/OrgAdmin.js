const mongoose = require('mongoose');

const OrgAdminSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',   // 🔥 VERY IMPORTANT
    required: true,
  },
  username: String,
  email: String,
  password: String,
  phoneNo: String,
  location: String,
  role: {
    type: String,
    enum: ['admin', 'headadmin'],
  },
});

module.exports = mongoose.model('org_admins', OrgAdminSchema);
