import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  title: string;
  description: string;
  category: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema: Schema<ISkill> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      maxlength: 50,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', skillSchema);
