import { useEffect, useState } from 'react';
import classes from './foodsAdminPage.module.css';
import { Link, useParams } from 'react-router-dom';
import { deleteById, getAll, search } from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import Title from '../../components/Title/Title';
import Search from '../../components/Search/Search';
import Price from '../../components/Price/Price';
import { toast } from 'react-toastify';



export default function FoodsAdminPage() {
const [foods, setFoods] = useState();
const { searchTerm } = useParams();

useEffect(() => {
    loadFoods();
}, [searchTerm]);

const loadFoods = async () => {
    const foods = searchTerm ? await search(searchTerm) : await getAll();
    setFoods(foods);
};

const FoodsNotFound = () => {
    if (foods && foods.length > 0) return;

    return searchTerm ? (
    <NotFound linkRoute="/admin/foods" linkText="Show All" />
    ) : (
    <NotFound linkRoute="/dashboard" linkText="Back to dashboard!" />
    );
};

const deleteFood = async (food) => {
    const confirmed = window.confirm(`Delete Food ${food.name}?`);
    if (!confirmed) return;

    try {
        // Call your API function to delete the food by ID
        await deleteById(food.id);

        // Log to check if the delete operation is successful
        console.log(`Food with ID ${food.id} deleted`);

        // Update the state after successful deletion
        const updatedFoods = foods.filter((f) => f.id !== food.id);

        // Log the updated foods array to check its contents before setting state
        console.log('Updated Foods:', updatedFoods);

        setFoods(updatedFoods);

        toast.success(`"${food.name}" Has Been Removed!`);
    } catch (error) {
        // Log the specific error message
        console.error('Error deleting food:', error.message);
        toast.error(`Error deleting "${food.name}"`);
    }
};


return (
    <div className={classes.container}>
    <div className={classes.list}>
        <Title title="Manage Foods" margin="1rem auto" />
        <Search
        searchRoute="/admin/foods/"
        defaultRoute="/admin/foods"
        margin="1rem 0"
        />
        <Link to="/admin/addFood" className={classes.add_food}>
        Add Food +
        </Link>
        <FoodsNotFound />
        {foods &&
        foods.map(food => (
            <div key={food.id} className={classes.list_item}>
            <img src={food.imageUrl} alt={food.name} />
            <Link to={'/food/' + food.id}>{food.name}</Link>
            <Price price={food.price} />
            <div className={classes.actions}>
                <Link to={`/admin/editFood/${food.id}`}>Edit</Link>
                <Link onClick={() => deleteFood(food)}>Delete</Link>
            </div>
            </div>
        ))}
    </div>
    </div>
);
}