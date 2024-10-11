import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  country: string;
  role: 'seeker' | 'provider' | 'admin';
  skills: mongoose.Types.ObjectId[];
  skill_exchanges: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 150,
      match: [/.+\@.+\..+/, 'Please enter a valid email'],
    },
    country: {
      type: String,
      required: true,
      maxlength: 50,
    },
    role: {
      type: String,
      enum: ['seeker', 'provider', 'admin'],
      default: 'seeker',
    },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    skill_exchanges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SkillExchange' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Export the model
export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
