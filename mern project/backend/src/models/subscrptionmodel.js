import Mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // one who is subscribing
      ref: "user",
    },
    channel: {
      type: Schema.Types.ObjectId, // one to whom subscribing the channel
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = Mongoose.model("Subscription", subscriptionSchema);
