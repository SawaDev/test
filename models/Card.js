import mongoose, { SchemaTypes } from "mongoose";

const CardSchema = new mongoose.Schema({
  number: {
    type: Number,
    unique: true,
    required: true,
    min: 16,
  },
  title: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    default: 0,
    min: 0,
  },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  
  purchases: [{
    type: SchemaTypes.ObjectId,
    ref: 'Purchase',
    default: []
  }]
},
  { timestamps: true }
)

export default mongoose.model("Card", CardSchema);