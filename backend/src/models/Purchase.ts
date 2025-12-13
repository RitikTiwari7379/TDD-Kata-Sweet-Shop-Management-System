import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  user: mongoose.Types.ObjectId;
  sweet: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  purchaseDate: Date;
}

const purchaseSchema = new Schema<IPurchase>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sweet: {
    type: Schema.Types.ObjectId,
    ref: 'Sweet',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price cannot be negative']
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IPurchase>('Purchase', purchaseSchema);
