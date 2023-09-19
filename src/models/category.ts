import mongoose, { Schema, Document } from 'mongoose';

interface Category extends Document {
  name: string;
  description: string;
}

const categorySchema = new Schema<Category>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Category = mongoose.model('category', categorySchema);
export default Category;
