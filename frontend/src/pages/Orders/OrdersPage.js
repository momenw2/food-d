    import React, { useEffect, useReducer } from 'react';
    import { Link, useParams } from 'react-router-dom';
    import { getAll, getAllStatus, updateOrderStatus } from '../../services/orderService';
    import classes from './ordersPage.module.css';
    import Title from '../../components/Title/Title';
    import DateTime from '../../components/DateTime/DateTime';
    import Price from '../../components/Price/Price';
    import NotFound from '../../components/NotFound/NotFound';
    import { payOrder } from '../../services/orderService';
    import { shipOrder } from '../../services/orderService'; // Import the 'shipOrder' function
    // import { shipOrder } from '../../services/orderService';


    const initialState = {};
    const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'ALL_STATUS_FETCHED':
        return { ...state, allStatus: payload };
        case 'ORDERS_FETCHED':
        return { ...state, orders: payload };
        default:
        return state;
    }
    };

    export default function OrdersPage() {
    const [{ allStatus, orders }, dispatch] = useReducer(reducer, initialState);

    const { filter } = useParams();

    useEffect(() => {
        getAllStatus().then(status => {
        dispatch({ type: 'ALL_STATUS_FETCHED', payload: status });
        });
        getAll(filter).then(orders => {
        dispatch({ type: 'ORDERS_FETCHED', payload: orders });
        });
    }, [filter]);



    
    const confirmOrder = async orderId => {
        try {
            // Update the order status to 'SHIPPED' using the payOrder function
            await updateOrderStatus(orderId, 'CONFIRMED'); // Assume you have a function to update the order status
            
            // Fetch updated orders after status change
            const updatedOrders = await getAll(filter);
            dispatch({ type: 'ORDERS_FETCHED', payload: updatedOrders });
        } catch (error) {
            console.error('Error confirming order:', error);
            // Handle error cases here
        }
    };
    
    
    

        const fetchOrders = async () => {
            try {
                const statusData = await getAllStatus();
                dispatch({ type: 'ALL_STATUS_FETCHED', payload: statusData });
    
                const ordersData = await getAll(filter);
                dispatch({ type: 'ORDERS_FETCHED', payload: ordersData });
            } catch (error) {
                // console.error('Error fetching orders:', error);
            }
        };
    
        useEffect(() => {
            fetchOrders();
        }, [filter]);
    

        const handleConfirmOrder = async (orderId) => {
            try {
                await confirmOrder(orderId); // Call the service to update order status
                // After successfully updating, update the orders list accordingly
                const updatedOrders = orders.map(order => {
                    if (order.id === orderId) {
                        return { ...order, status: 'PAYED' }; // Update the order status locally
                    }
                    return order;
                });
                dispatch({ type: 'ORDERS_FETCHED', payload: updatedOrders });
            } catch (error) {
                console.error('Error confirming order:', error);
            }
        };


        const handleShipOrder = async (orderId) => {
            try {
                await shipOrder(orderId); // Call the service to update order status
        
                // Update the order status in the local state
                const updatedOrders = orders.map(order => {
                    if (order.id === orderId) {
                        return { ...order, status: 'SHIPPED' }; // Update the order status locally
                    }
                    return order;
                });
        
                // Update the state with the new order status
                dispatch({ type: 'ORDERS_FETCHED', payload: updatedOrders });
            } catch (error) {
                console.error('Error shipping order:', error);
                // Handle the error
            }
        };
        
        



    return (
        <div className={classes.container}>
        <Title title="Orders" margin="1.5rem 0 0 .2rem" fontSize="1.9rem" />

        {allStatus && (
            <div className={classes.all_status}>
            <Link to="/orders" className={!filter ? classes.selected : ''}>
                All
            </Link>
            {allStatus.map(state => (
                <Link
                key={state}
                className={state == filter ? classes.selected : ''}
                to={`/orders/${state}`}
                >
                {state}
                </Link>
            ))}
            </div>
        )}

        {orders?.length === 0 && (
            <NotFound
            linkRoute={filter ? '/orders' : '/'}
            linkText={filter ? 'Show All' : 'Go To Home Page'}
            />
        )}

        {orders &&
            orders.map(order => (
            <div key={order.id} className={classes.order_summary}>
                <div className={classes.header}>
                <span>{order.id}</span>
                <span>
                    <DateTime date={order.createdAt} />
                </span>
                <span>{order.status}</span>
                </div>
                <div className={classes.items}>
                {order.items.map(item => (
                    <Link key={item.food.id} to={`/food/${item.food.id}`}>
                    <img src={item.food.imageUrl} alt={item.food.name} />
                    </Link>
                ))}
                </div>
                <div className={classes.footer}>
                <div>
                    <Link to={`/track/${order.id}`}>Show Order</Link>
                    {order.status === 'NEW' && (
    <button onClick={() => handleShipOrder(order.id)} className={classes.confirmOrderButton} >Confirm Order</button>
)}
                </div>
                <div>
                    <span className={classes.price}>
                    <Price price={order.totalPrice} />
                    </span>
                </div>
                </div>
            </div>
            ))}
        </div>
    );
    }