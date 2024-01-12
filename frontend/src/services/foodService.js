    import axios from 'axios';

    export const getAll = async () => {
    const { data } = await axios.get('/api/foods');
    return data;
    };

    export const search = async searchTerm => {
    const { data } = await axios.get('/api/foods/search/' + searchTerm);
    return data;
    };

    export const getAllTags = async () => {
    const { data } = await axios.get('/api/foods/tags');
    return data;
    };

    export const getAllByTag = async tag => {
    if (tag === 'All') return getAll();
    const { data } = await axios.get('/api/foods/tag/' + tag);
    return data;
    };

    export const getById = async foodId => {
    const { data } = await axios.get('/api/foods/' + foodId);
    return data;
    };

    export async function deleteById(foodId) {
    await axios.delete('/api/foods/' + foodId);
}

export const updateById = async (foodId, updatedData) => {
    try {
        const { data } = await axios.put(`/api/foods/update/${foodId}`, updatedData);
        return data;
    } catch (error) {
        console.error('Error updating food by ID:', error.response.data); // Log the specific error response from the server
        throw new Error('Error updating food by ID');
    }
};


    
    