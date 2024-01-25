    import { Router } from 'express';
    import handler from 'express-async-handler';
    import auth from '../middleware/auth.mid.js';
    import { BAD_REQUEST } from '../constants/httpStatus.js';
    import { OrderModel } from '../models/order.model.js';
    import { OrderStatus } from '../constants/orderStatus.js';
    import { UserModel } from '../models/user.model.js';
    import jwt from 'jsonwebtoken';
    import CartItem from '../models/cart.model.js';

    const router = Router();
    router.use(auth);

    router.post('/create', handler(async (req, res) => {
        try {
            // Check if Authorization header is present
            if (!req.headers.access_token) {
                return res.status(401).send('Access token missing');
            }
    
            const token = req.headers.access_token;

            
            //res.json({ message: token});
            // Extract and verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //res.json({ message: decoded});
            const userId = decoded.id;
    
            //res.json({ message: token});
            // Check if the user has a cart
            //res.json({ message: userId});
            const existingCart = await CartItem.findOne({userid: userId});
            
            
    
            if (!existingCart || existingCart.dishes.length === 0) {
                return res.status(400).json({ error: 'Cart is empty. Cannot create an order.' });
            }
            
    
            // Create a new order
            const newOrder = new OrderModel({
                dishes: existingCart.dishes,
                status: OrderStatus.NEW,
                user: userId,
            });
            
    
            // Save the new order
            await newOrder.save();
            
    
            // Clear the user's cart after creating the order
            //await existingCart.remove();
            //res.json({ message: userId});
    
            res.json({ message: 'Order created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })); 

    // router.post(
    // '/create',
    // handler(async (req, res) => {
    //     const order = req.body;

    //     if (order.items.length <= 0) res.status(BAD_REQUEST).send('Cart Is Empty!');

    //     // await OrderModel.deleteOne({
    //     // user: req.user.id,
    //     // status: OrderStatus.NEW,
    //     // });

    //     const newOrder = new OrderModel({ ...order, user: req.user.id });
    //     await newOrder.save();
    //     res.send(newOrder);
    // })
    // );

    // router.post(
    //     '/create',
    //     handler(async (req, res) => {
    //         const order = req.body;
        
    //         if (order.items.length <= 0) {
    //             return res.status(BAD_REQUEST).send('Cart Is Empty!');
    //         }
            
        
    //         const newOrder = new OrderModel({ ...order, user: req.user.id });
    //         await newOrder.save();
    //         res.send(newOrder);
    //         })
    //     );
        

    // router.put(
    //     '/pay',
    //     handler(async (req, res) => {
    //         const { paymentId } = req.body;
    //         const order = await getNewOrderForCurrentUser(req);
    //         if (!order) {
    //             res.status(BAD_REQUEST).send('Order Not Found!');
    //             return;
    //         }
        
    //         order.paymentId = paymentId;
    //         order.status = OrderStatus.PAYED;
    //         await order.save();
        
    //         res.send(order._id);
    //         })
    //     );

    router.put(
        '/pay',
        handler(async (req, res) => {
            const order = await getNewOrderForCurrentUser(req);
            if (!order) {
                res.status(BAD_REQUEST).send('Order Not Found!');
                return;
            }
    
            // Assuming the status change here is without any additional parameter like paymentId
            order.status = OrderStatus.PAYED; // Update the status directly
            
            try {
                await order.save(); // Save the updated order
                res.send(order._id);
            } catch (error) {
                console.error('Error updating order status:', error);
                res.status(500).send('Internal Server Error');
            }
        })
    );
    

    router.put('/pay/:orderId', handler(async (req, res) => {
        const { orderId } = req.params;
    
        try {
            const order = await OrderModel.findOneAndUpdate(
                { _id: orderId, user: req.user.id, status: 'NEW' }, // Conditions to find the order
                { $set: { status: 'PAYED' } }, // Set the status to PAYED
                { new: true } // To get the updated order
            );
    
            if (!order) {
                return res.status(BAD_REQUEST).send('Order Not Found or Already Paid!');
            }
    
            res.send(order);
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).send('Internal Server Error');
        }
    }));
    
    router.put('/ship/:orderId', handler(async (req, res) => {
        const { orderId } = req.params;
    
        try {
            const order = await OrderModel.findOneAndUpdate(
                { _id: orderId, user: req.user.id, status: 'NEW' }, // Conditions to find the order
                { $set: { status: 'CONFIRMED' } }, // Set the status to SHIPPED
                { new: true } // To get the updated order
            );
    
            if (!order) {
                return res.status(BAD_REQUEST).send('Order Not Found or Already Shipped!');
            }
    
            res.send(order);
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).send('Internal Server Error');
        }
    }));
    

    
            
            router.put(
                '/updateStatus/:orderId', // Adjusted endpoint to update the status
                handler(async (req, res) => {
                    const { orderId } = req.params;
                    try {
                        const order = await OrderModel.findOneAndUpdate(
                            { _id: orderId, user: req.user.id, status: 'NEW' }, // Conditions to find the order
                            { $set: { status: 'PAYED' } }, // Set the status to PAYED
                            { new: true } // To get the updated order
                        );
            
                        if (!order) {
                            return res.status(BAD_REQUEST).send('Order Not Found or Already Paid!');
                        }
            
                        res.send(order);
                    } catch (error) {
                        console.error('Error updating order status:', error);
                        res.status(500).send('Internal Server Error');
                    }
                })
            );
            
        

        router.get(
            '/track/:orderId',
            handler(async (req, res) => {
                const { orderId } = req.params;
                const user = await UserModel.findById(req.user.id);
            
                const filter = {
                    _id: orderId,
                };
            
                if (!user.isAdmin) {
                    filter.user = user._id;
                }
            
                const order = await OrderModel.findOne(filter);
            
                if (!order) return res.send(UNAUTHORIZED);
            
                return res.send(order);
                })
            );


            router.get(
                '/:orderId',
                handler(async (req, res) => {
                    const { orderId } = req.params;
                    const user = await UserModel.findById(req.user.id);
            
                    const filter = {
                        _id: orderId,
                    };
            
                    if (!user.isAdmin) {
                        filter.user = user._id;
                    }
            
                    const order = await OrderModel.findOne(filter);
            
                    if (!order) return res.send(UNAUTHORIZED);
            
                    const simplifiedOrder = {
                        id: order._id,
                        deliveryTime: order.deliveryTime,
                        orderTime: order.orderTime,
                        status: order.status,
                        price: order.totalPrice,
                    };
            
                    return res.send([simplifiedOrder]);
                })
            );
            
            
                
        router.get(
            '/newOrderForCurrentUser',
            handler(async (req, res) => {
            const order = await getNewOrderForCurrentUser(req);
            if (order) res.send(order);
            else res.status(BAD_REQUEST).send();
            })
        );

        router.get('/allstatus', (req, res) => {
            const allStatus = Object.values(OrderStatus);
            res.send(allStatus);
            });
            
            // router.get(
            //     '/:status?',
            //     handler(async (req, res) => {
            //     const status = req.params.status;
            //     const user = await UserModel.findById(req.user.id);
            //     const filter = {};
            
            //     if (!user.isAdmin) filter.user = user._id;
            //     if (status) filter.status = status;
            
            //     const orders = await OrderModel.find(filter).sort('-createdAt');
            //     res.send(orders);
            //     })
            // );
            router.get('/:status?', handler(async (req, res) => {
                try {
                    const status = req.params.status;
                    const userId = req.user.id;
                    const filter = {};
            
                    if (status) filter.status = status;
            
                    // Filter by user id
                    filter.user = userId;
            
                    const orders = await OrderModel.find(filter).sort('-createdAt');
                    res.send(orders);
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }));
            
        
        const getNewOrderForCurrentUser = async req =>
            await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW });

    export default router;