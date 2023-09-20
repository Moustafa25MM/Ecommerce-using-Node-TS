import mongoose, { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

interface ADDRESS extends Document {
  unitNumber: string;
  streetNumber: string;
  addressLine: string;
  city: string;
  region: string;
  postalCode: string;
  userId: Types.ObjectId;
}

const addressSchema: Schema = new Schema<ADDRESS>(
  {
    unitNumber: {
      type: String,
      required: true,
    },
    streetNumber: {
      type: String,
      required: true,
    },
    addressLine: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model('address', addressSchema);
export default Address;
