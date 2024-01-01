import React, { useState } from 'react';
import classes from './addFoodPage.module.css'; // Import CSS module

const AddFoodPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        tags: '',
        favorite: false,
        stars: 3,
        imageUrl: '',
        vegetarian: '',
        description: '',
    });
    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        Object.entries(formData).forEach(([key, value]) => {
            if ((value === '' || value === null || value === undefined) && key !== 'favorite') {
                errors[key] = `${key} is required`;
            }
        });
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();

        if (isValid) {
            try {
                const response = await fetch('http://localhost:5001/api/foods/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    // Food added successfully
                    window.location.href = '/admin/foods'; // Redirect after successful addition
                } else {
                    // Handle error if the request fails
                    console.error('Failed to add food');
                }
            } catch (error) {
                console.error('Error adding food:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    return (
        <div className={classes.container}>
            <div className={classes.details}>
                <h1>Add New Food</h1>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Food Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={classes.addFoodPageinput}
                    />
                    <span className={classes.error}>{formErrors.name}</span>
        
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={classes.addFoodPageinput}
                    />
                    <span className={classes.error}>{formErrors.price}</span>
        
                    <input
                        type="text"
                        name="tags"
                        placeholder="Tags (comma-separated)"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className={classes.addFoodPageinput}
                    />
                    <span className={classes.error}>{formErrors.tags}</span>
        
                    <input
                        type="text"
                        name="imageUrl"
                        placeholder="Image URL"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className={classes.addFoodPageinput}
                    />
                    <span className={classes.error}>{formErrors.imageUrl}</span>
        
                    <input
                        type="text"
                        name="vegetarian"
                        placeholder="Vegetarian (yes/no)"
                        value={formData.vegetarian}
                        onChange={handleInputChange}
                        className={classes.addFoodPageinput}
                    />
                    <span className={classes.error}>{formErrors.vegetarian}</span>
        
                    <input
                        type="number"
                        name="stars"
                        placeholder="Stars (1-5)"
                        value={formData.stars}
                        onChange={handleInputChange}
                        className={classes.addFoodPageinput}
                    />
                    <span className={classes.error}>{formErrors.stars}</span>
        
                    <label className={classes.favorite}>
                        Favorite:
                        <input
                            type="checkbox"
                            name="favorite"
                            checked={formData.favorite}
                            onChange={handleInputChange}
                            className={classes.addFoodPageinput}
                        />
                    </label>
        
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={classes.addFoodPageinput}
                    />
                    <span className={classes.error}>{formErrors.description}</span>

                    <div className={classes.addFoodButton}>
                    <button type="submit" className={classes.button}>Add Food</button>
                    </div>
                </form>
            </div>
        </div>
    );
    
};

export default AddFoodPage;
