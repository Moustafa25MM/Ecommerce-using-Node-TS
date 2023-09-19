import mongoose, { Schema, Document } from 'mongoose';

interface Category extends Document {
  name: string;
}

const categorySchema = new Schema<Category>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
});

const Category = mongoose.model('category', categorySchema);
export default Category;
