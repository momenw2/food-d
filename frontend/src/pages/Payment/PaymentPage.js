    import React, { useState, useEffect } from 'react';
    import classes from './paymentPage.module.css';
    import { getNewOrderForCurrentUser, createOrder } from '../../services/orderService'; // Import the createOrder function
    import Title from '../../components/Title/Title';
    import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
    import Map from '../../components/Map/Map';
    import PaypalButtons from '../../components/PaypalButtons/PaypalButtons';
    import { useCart } from '../../hooks/useCart'; // Import the useCart hook
    import { Link } from 'react-router-dom';
    import { useNavigate } from 'react-router-dom';



    export default function PaymentPage() {
    const [order, setOrder] = useState();
    const { cart, clearCart  } = useCart(); // Access the cart object from useCart hook
    const navigate = useNavigate(); // Access the navigate function from React Router


    // useEffect(() => {
    //     getNewOrderForCurrentUser().then(data => setOrder(data));
    // }, []);
    useEffect(() => {
        getNewOrderForCurrentUser().then(data => setOrder(data));
        // Access cart items from the cart context
        const cartItems = cart.items;
        console.log('Cart Items:', cartItems);
        // Further logic using cart items...
        }, [order, cart]);


    const handleCreateOrder = async () => {
        try {
        // Call the createOrder function when the button is clicked
        const newOrder = await createOrder(order); // Assuming order object is available
        // Redirect the user to the orders page (you need to define the redirect logic)
        // For example:
        order.push('/orders');
        } catch (error) {
        // Handle error if order creation fails
        // console.error('Error creating order:', error);
        }
    
        clearCart();
        navigate(`/orders`)
    };

    if (!order) return null; // Return null or a loading indicator

    return (
        <>
        <div className={classes.container}>
            <div className={classes.content}>
            <Title title="Order Form" fontSize="1.6rem" />
            <div className={classes.summary}>
                <div>
                <h3>Name:</h3>
                <span>{order.name}</span>
                </div>
                <div>
                <h3>Address:</h3>
                <span>{order.address}</span>
                </div>
            </div>
            {/* <OrderItemsList order={order} /> */}
            <table className={classes.table}>
        <tbody>
            <tr>
            <td colSpan="5">
                <h3>Order Items:</h3>
            </td>
            </tr>
            {cart.items.map(item => (
            <tr key={item.food._id.$oid}>
                <td>
                <Link to={`/food/${item.food.id}`}>
                    <img src={item.food.imageUrl} />
                </Link>
                </td>
                <td>{item.food.name}</td>
                <td>
                <p>Price: ${item.price}</p>
                </td>
                <td>{item.quantity}</td>
            </tr>
            ))}

            <tr>
            <td colSpan="3"></td>
            <td>
                {/* <Price price={cart.totalPrice} /> */}
                <p><strong>Total Price:</strong> ${cart.totalPrice}</p>
            </td>
            </tr>
        </tbody>
        </table>
            </div>
            <div className={classes.map}>
            <Title title="Your Location" fontSize="1.6rem" />
            <Map readonly={true} location={order.addressLatLng} />
            </div>
            <div className={classes.buttons_container}>
            <div className={classes.buttons}>
                {/* <PaypalButtons order={order} /> */}
                {/* Add a button to create the order */}
                <button onClick={handleCreateOrder} className={classes.createOrderButtons}>Create Order</button>
            </div>
            </div>
        </div>
        </>
    );
    }







    // <table className={classes.table}>
    //     <tbody>
    //         <tr>
    //         <td colSpan="5">
    //             <h3>Order Items:</h3>
    //         </td>
    //         </tr>
    //         {order.items.map(item => (
    //         <tr key={item.food._id.$oid}>
    //             <td>
    //             <Link to={`/food/${item.food.id}`}>
    //                 <img src={item.food.imageUrl} />
    //             </Link>
    //             </td>
    //             <td>{item.food.name}</td>
    //             <td>
    //             <p>Price: ${item.price}</p>
    //             </td>
    //             <td>{item.quantity}</td>
    //             {/* <td>
    //             <Price price={item.price} />
    //             </td> */}
    //         </tr>
    //         ))}

    //         <tr>
    //         <td colSpan="3"></td>
    //         <td>
    //             <strong>Total :</strong>
    //         </td>
    //         <td>
    //             {/* <Price price={cart.totalPrice} /> */}
    //             <p>Total Price: ${cart.totalPrice}</p>
    //         </td>
    //         </tr>
    //     </tbody>
    //     </table>








//     <div className={classes.data}>
//     <h1>Order Form</h1>
//     {cart.items.map(item => (
//         <div key={item.food._id.$oid}>
//             <Link to={`/food/${item.food.id}`}>
//                 <img src={item.food.imageUrl} className={classes.image}/>
//             </Link>
//         <p>{item.food.name}</p>
//         <p>Price: ${item.price}</p>
//         <p>Quantity: {item.quantity}</p>
//         {/* Add other details of the item */}
//         </div>
        
//     ))
//     }
//     <p>Total Price: ${cart.totalPrice}</p>
//   {/* Other order form elements */}
// </div>