import { sample_foods, sample_tags } from "../data";
export const getAll = async () => sample_foods;

export const search = async (searchTerm) => 
sample_foods.filter(item => 
    item.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
);

export const getAllTags = async () => sample_tags;

export const getAllByTag = async tag => {
    if (tag === 'All') return getAll();
    return sample_foods.filter(item => item.tags?.includes(tag));
    };

    // export const getById = async foodId => {
    //     const { data } = await axios.get('/api/foods/' + foodId);
    //     return data;
    // };

    // export const getById = async foodId => {
    //     sample_foods.find(item => item.id === foodId)
    // }

        export const getById = async (foodId) => {
            const food = sample_foods.find((item) => item.id === foodId);
            if (!food) {
            throw new Error(`Food with ID ${foodId} not found`);
            }
            return food;
        };
