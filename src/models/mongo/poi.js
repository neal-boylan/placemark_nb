import Mongoose from "mongoose";

const { Schema } = Mongoose;

const poiSchema = new Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  categoryid: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
});

export const Poi = Mongoose.model("Poi", poiSchema);