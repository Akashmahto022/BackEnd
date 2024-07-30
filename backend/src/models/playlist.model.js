import mongoose, { Schema } from "mongoose";

const playListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: [
      {
        type: Schema.Types.ObjectId,
        ref: "VideoSchema",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Platlist = mongoose.model("Platlist", playListSchema);
