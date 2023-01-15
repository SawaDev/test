import mongoose, { SchemaTypes } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  lastname: {
    type: String,
    required: true,
  },
  documentCode: {
    type: String,
    unique: true,
    required: true,
  },
  documentDate: {
    type: String,
    required: true,
  },
  currentCard: {
    type: SchemaTypes.ObjectId,
    ref: 'CurrentCard',
    default: null,
  },
}, { timestamps: true }
);

export default mongoose.model("User", UserSchema);