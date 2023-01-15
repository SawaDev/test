import mongoose, { SchemaTypes } from "mongoose";

const CurrentCardSchema = new mongoose.Schema({
  cardId: {
    type: SchemaTypes.ObjectId,
    ref: 'Card',
    required: true
  },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  documentCode: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    // required: true
  }
}, { timestamps: true }
);

export default mongoose.model("CurrentCard", CurrentCardSchema);