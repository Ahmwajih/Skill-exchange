import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the interface for TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Add password to the interface
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
    password: {
      type: String,
      required: true, // Password field (will be hashed)
      minlength: 6,
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

// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
  const user = this as IUser;

  // Only hash the password if it's been modified (or is new)
  if (!user.isModified('password')) return next();

  // Hash the password with a salt
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Export the model
export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
