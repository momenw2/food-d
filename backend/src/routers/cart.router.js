    // cart.router.js
    import express from 'express';
    import CartItem from '../models/cart.model.js';

    const cartRouter = express.Router();

    // Get all cart items
    cartRouter.get('/', async (req, res) => {
    try {
        const cartItems = await CartItem.find();
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

    // Add item to cart
    cartRouter.post('/add', async (req, res) => {
    const { foodId, quantity } = req.body;

    try {
        const cartItem = new CartItem({ foodId, quantity });
        await cartItem.save();
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

    // Remove item from cart
    cartRouter.delete('/remove/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        await CartItem.findByIdAndRemove(itemId);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

    // Update quantity of an item in cart
    cartRouter.put('/update/:id', async (req, res) => {
    const itemId = req.params.id;
    const { quantity } = req.body;

    try {
        const updatedCartItem = await CartItem.findByIdAndUpdate(
        itemId,
        { quantity },
        { new: true } // Return the updated document
        );
        res.json(updatedCartItem);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

    export default cartRouter;
