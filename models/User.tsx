import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  country: string;
  role: 'seeker' | 'provider' | 'admin';
  isAdmin: boolean;
  isActive: boolean;
  skills: mongoose.Types.ObjectId[];
  skill_exchanges: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
}

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
      required: true, 
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
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
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

userSchema.pre('save', async function (next) {
  const user = this as IUser;

  if (!user.isModified('password')) return next();

  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
