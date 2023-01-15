import mongoose from "mongoose";

const date = new Date();

const PurchaseSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
  },
  market: {
    type: String,
    required: true
  },
  date: {
    type: String,
  }
});

export default mongoose.model('Purchase', PurchaseSchema);