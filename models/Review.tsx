import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  rating: number;
  comments: string;
  user: mongoose.Types.ObjectId;
  skill: mongoose.Types.ObjectId;
  exchange: mongoose.Types.ObjectId;
  review_date: Date;
}

const reviewSchema: Schema<IReview> = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
      maxlength: 500,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    exchange: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillExchange',
      required: true,
    },
    review_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
