    import axios from 'axios';

    export const createOrder = async order => {
    try {
        const { data } = axios.post('/api/orders/create', order);
        return data;
    } catch (error) {}
    };

    export const getNewOrderForCurrentUser = async () => {
        const { data } = await axios.get('/api/orders/newOrderForCurrentUser');
        return data;
        };
        
    export const pay = async paymentId => {
        try {
            const { data } = await axios.put('/api/orders/pay', { paymentId });
            return data;
        } catch (error) {}
    };
    export const trackOrderById = async orderId => {
        const { data } = await axios.get('/api/orders/track/' + orderId);
        return data;
    };

    export const getAll = async state => {
        const { data } = await axios.get(`/api/orders/${state ?? ''}`);
        return data;
    };

    export const getAllStatus = async () => {
        const { data } = await axios.get(`/api/orders/allstatus`);
        return data;
    };



    export const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/pay/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
    
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    };
    export const payOrder = async orderId => {
        try {
            const response = await fetch(`/api/orders/pay/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'PAYED' }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
    
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    };

    export const shipOrder = async orderId => {
        try {
            const { data } = await axios.put(`/api/orders/ship/${orderId}`);
            return data;
        } catch (error) {
            // Handle error
            throw new Error('Failed to update order status');
        }
    };
    
    
        
    
    
    