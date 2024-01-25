    import express from 'express';
    import CartItem from '../models/cart.model.js';
    import jwt from 'jsonwebtoken';

    const cartRouter = express.Router();

    // Get all cart items
    cartRouter.get('/', async (req, res) => {
    try {

        


        // Check if Authorization header is present
        if (!req.headers.access_token) {
            return res.status(UNAUTHORIZED).send('Access token missing');
        }

        const token = req.headers.access_token;
        //res.json("user");
        // res.json(token);

        // Extract and verify the token
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id;
        //res.json({ message: userId});




        const cartItems = await CartItem.findOne({userid: userId});
        if (cartItems) {
            res.json(cartItems);
        }
        else {
            res.json("No cart found!");
        }
        
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

// Add item to cart
cartRouter.post('/add', async (req, res) => {
    try {
        const { foodId, foodQuantity } = req.body;

        // Check if Authorization header is present
        if (!req.headers.access_token) {
            return res.status(401).send('Access token missing');
        }

        const token = req.headers.access_token;

        // Extract and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if the user already has a cart
        const existingCart = await CartItem.findOne({ userid: userId });

        if (existingCart) {
            // Check if the dish already exists in the cart
            const existingDish = existingCart.dishes.find(dish => dish.foodid === foodId);

            if (existingDish) {
                // Increase the quantity of the existing dish
                existingDish.quantity += foodQuantity;
            } else {
                // Add the new item to the existing cart
                existingCart.dishes.push({ foodid: foodId, quantity: foodQuantity });
            }

            await existingCart.save();
        } else {
            // Create a new cart with the user id and add the new item
            const newCart = new CartItem({ userid: userId, dishes: [{ foodid: foodId, quantity: foodQuantity }] });
            await newCart.save();
        }

        res.json({ message: 'Item added to cart successfully' });
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
