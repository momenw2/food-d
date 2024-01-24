import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    foodId: String,
    quantity: Number,
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;
