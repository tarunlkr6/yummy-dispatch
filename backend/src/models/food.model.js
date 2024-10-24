import mongoose, { Schema } from "mongoose";


const reviewSchema = new Schema(
    {
        name: {type: String, required: true },
        rating: {type: Number, required: true },
        comment: {type: String, required: false },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        } 
    }
);

const foodSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: { 
    type: String, 
    required: true
 },
  description: { 
    type: String, required: true
 },
  price: { 
    type: String, required: true
 },
  image: { 
    type: String, required: true
 },
  category: { 
    type: String, required: true
 },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: false,
    default: 0
  },
  numReviews: {
    type: Number,
    required: false,
    default: 0
  },

},
{
timestamps: true,
}
);

// using || -> if the model is there then it will be used if not then it will create a new model
export const FoodItem = mongoose.models.food || mongoose.model('FoodItem',foodSchema)


