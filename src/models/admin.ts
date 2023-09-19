import mongoose, { Schema, Document } from 'mongoose';

interface ADMIN extends Document {
  username: string;
  email: string;
  password: string;
  active: boolean;
}

const adminSchmea: Schema = new Schema<ADMIN>(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 1024,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  }
);

const Admin = mongoose.model('admin', adminSchmea);
export default Admin;
