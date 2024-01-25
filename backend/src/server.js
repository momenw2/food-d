// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import foodRouter from './routers/food.router.js';
// import userRouter from './routers/user.router.js';
// import orderRouter from './routers/order.router.js';
// import { dbconnect } from './config/database.config.js';



// dbconnect();

// const app = express();
// app.use(express.json());

// app.use(
//     cors({
//         credentials: true,
//         origin: ['http://localhost:3000'],
//         })
//     );

//     app.use('/api/foods', foodRouter);
//     app.use('/api/users', userRouter);
//     app.use('/api/orders', orderRouter);


//     const PORT = 5001;
//     app.listen(PORT, () => {
//         console.log('listening on port ' + PORT);
//         });




import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import cartRouter from './routers/cart.router.js';

import { dbconnect } from './config/database.config.js';
dbconnect();

const app = express();
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
    })
);

app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);

app.use('/api/dish', foodRouter);
app.use('/api/account', userRouter);
// app.use('/api/orders', orderRouter);
app.use('/api/basket', cartRouter);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});







// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import foodRouter from './routers/food.router.js';
// import userRouter from './routers/user.router.js';
// import orderRouter from './routers/order.router.js';
// import { dbconnect } from './config/database.config.js';
// // import swagger from './swagger.js';



// const app = express(); // Create the app instance first

// app.use(express.json());

// app.use(
//     cors({
//         credentials: true,
//         origin: ['http://localhost:3000'],
//     })
// );

// app.use('/api/foods', foodRouter);
// app.use('/api/users', userRouter);
// app.use('/api/orders', orderRouter);


// // swagger(app); // Call swaggerConfig after creating app instance


// dbconnect();

// const PORT = 5001;
// app.listen(PORT, () => {
//     console.log('listening on port ' + PORT);
// });

