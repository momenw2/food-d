// import mongoose from 'mongoose';

// const cartItemSchema = new mongoose.Schema({
//     dishes: [
//         {
//             foodid: String,
//             quantity: Number
//         }
//     ],
//     userid: String
// });

// const CartItem = mongoose.model('CartItem', cartItemSchema);

// export default CartItem;


import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    dishes: [
        {
            foodid: String,
            quantity: Number
        }
    ],
    userid: String
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;
