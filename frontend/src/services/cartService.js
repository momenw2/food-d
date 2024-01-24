import CartItem from './cart.model.js';

export const getCartItems = async () => {
    try {
        return await CartItem.find();
    } catch (error) {
        throw new Error('Error retrieving cart items');
    }
};

// Other functions for adding, removing, updating, and clearing cart items...
