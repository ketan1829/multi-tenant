import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    
    isSystem: {
      type: Boolean,
      default: false, // prevent deletion of system roles if needed
    },
  },

  {
    timestamps: true,
  }
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
