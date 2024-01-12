    import React, { useState, useEffect } from 'react';
    import { useParams } from 'react-router-dom';
    import { getById, updateById } from '../../services/foodService';
    import classes from './editFoodPage.module.css'; // Import CSS module


    const EditFood = () => {
    const { foodId } = useParams();
    const [food, setFood] = useState(null);
    const [editedFoodData, setEditedFoodData] = useState({});

    useEffect(() => {
        const fetchFood = async () => {
        try {
            const fetchedFood = await getById(foodId);
            setFood(fetchedFood);
            setEditedFoodData({ ...fetchedFood });
        } catch (error) {
            console.error('Error fetching food:', error.message);
        }
        };

        fetchFood();
    }, [foodId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
    
        if (name === 'description' || name === 'vegetarian' || name === 'stars' || name === 'tags') {
            if (name === 'tags') {
                // Split the entered string into an array using commas
                const tagsArray = fieldValue.split(',').map(tag => tag.trim());
                setEditedFoodData((prevData) => ({
                    ...prevData,
                    [name]: tagsArray,
                }));
            } else {
                setEditedFoodData((prevData) => ({
                    ...prevData,
                    [name]: fieldValue,
                }));
            }
        } else {
            setEditedFoodData({
                ...editedFoodData,
                [name]: fieldValue,
            });
        }
    };
    

    // const handleInputChange = (e) => {
    //         const { name, value, type, checked, number } = e.target;
        
    //         // For checkboxes, handle checked state directly
    //         const fieldValue = type === 'checkbox' ? checked : value;
        
    //         if (name === 'description') {
    //         setEditedFoodData((prevData) => ({
    //             ...prevData,
    //             [name]: fieldValue,
    //         }));
    //         } 
    //         else {
    //         setEditedFoodData({
    //             ...editedFoodData,
    //             [name]: fieldValue,
    //         });
    //         }
    //     };
        
        

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
        const updatedData = {
            name: editedFoodData.name,
            price: editedFoodData.price,
            tags: editedFoodData.tags || [], 
            favorite: editedFoodData.favorite || false,
            description: editedFoodData.description || '',
            vegetarian: editedFoodData.vegetarian || false, // Include the vegetarian field
            stars: editedFoodData.stars,
            // Include other fields needed for update
        };

        const response = await updateById(foodId, updatedData);

        if (response && response.success) {
            console.log('Food updated successfully!');
            // Optionally update local state with the new data if needed
        } else {
            console.error('Failed to update food:', response.message || 'Unknown error');
        }
        } catch (error) {
        console.error('Error updating food:', error.message);
        }
    };

    if (!food) {
        return <div>Loading...</div>;
    }

    return (
            <div className={classes.container}>
                <div className={classes.details}>
                <h2>Edit Food: {food.name}</h2>
                <form onSubmit={handleUpdate}>
                <label>
                    Food Name:
                    <input type="text" name="name" value={editedFoodData.name || ''} onChange={handleInputChange} className={classes.addFoodPageinput}/>
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={editedFoodData.price || ''} onChange={handleInputChange} className={classes.addFoodPageinput}/>
                </label>
                <label>
                    Tags (separated by commas):
                    <input type="text" name="tags" value={editedFoodData.tags ? editedFoodData.tags.join(', ') : ''} onChange={handleInputChange} className={classes.addFoodPageinput}/>
                </label>
                <label className={classes.favorite}>
                    Favorite:
                    <input type="checkbox" name="favorite" checked={editedFoodData.favorite || false} onChange={handleInputChange} className={classes.addFoodPageinput}/>
                </label>
                <label>
                    Vegetarian:
                    <input type="text" name="vegetarian" value={editedFoodData.vegetarian || ''} onChange={handleInputChange} className={classes.addFoodPageinput}/>
                </label>

                <label>
                Stars:
                <input type="number" name="stars" value={editedFoodData.stars || 0} onChange={handleInputChange} className={classes.addFoodPageinput}/>
                </label>

                <label>
                    Description:
                    <textarea name="description" value={editedFoodData.description || ''} onChange={handleInputChange}  className={classes.addFoodPageinput}/>

                </label>
                {/* Include additional fields for other properties */}
                <button type="submit" className={classes.button}>Update</button>
            </form>
            </div>
        </div>
    );
    };

    export default EditFood;
