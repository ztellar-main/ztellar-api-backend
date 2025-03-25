import mongoose from 'mongoose';

const movieSubscriptionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
  },
  expiry: Date,
  
});

const MovieSubscription = mongoose.model(
  'MovieSubscription',
  movieSubscriptionSchema
);

export default MovieSubscription;
