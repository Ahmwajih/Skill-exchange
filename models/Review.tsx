import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  rating: number;
  comments: string;
  user: mongoose.Types.ObjectId;
  skill: mongoose.Types.ObjectId;
  reviewedBy: mongoose.Types.String;
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
      ref: "User",
      required: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", reviewSchema);
