import { Router } from 'express';
import { FoodModel } from '../models/food.model.js';
import handler from 'express-async-handler';
import { sample_tags } from '../data.js';
const router = Router();

router.get(
    '/',
    handler(async (req, res) => {
        const foods = await FoodModel.find({});
        res.send(foods);
        })
    );

    router.get(
        '/tags',
        handler(async (req, res) => {
            const tags = await FoodModel.aggregate([
                {
                $unwind: '$tags',
                },
                {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 },
                },
                },
                {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: '$count',
                },
                },
            ]).sort({ count: -1 });
            const all ={
                name:'All',
                count: await FoodModel.countDocuments(),
            };
            tags.unshift(all);

            res.send(tags);
        })
    );

    router.get(
        '/search/:searchTerm',
        handler(async (req, res) => {
            const { searchTerm } = req.params;
            const searchRegex = new RegExp(searchTerm, 'i');
            const foods = await FoodModel.find({ name: { $regex: searchRegex } });
            res.send(foods);
        })
        );

        router.get(
            '/tag/:tag',
            handler(async (req, res) => {
                const { tag } = req.params;
                const foods = await FoodModel.find({ tags: tag });
                res.send(foods);
            })
            );

            router.get(
                '/:foodId',
                handler(async (req, res) => {
                    const { foodId } = req.params;
                    const food = await FoodModel.findById(foodId);
                    res.send(food);
                })
                );



                router.post(
                    '/add',
                    handler(async (req, res) => {
                        console.log(req.body);
                        const {
                            name,
                            price,
                            tags,
                            favorite,
                            stars,
                            imageUrl,
                            vegetarian,
                            description,
                        } = req.body;
                
                        try {
                            if (!name || !price || !tags) {
                                return res.status(400).send({ message: 'Name, price, and tags are required.' });
                            }
                
                            const newFood = new FoodModel({
                                name,
                                price,
                                tags: tags.split(',').map(tag => tag.trim()), // Split tags by comma and remove whitespace
                                favorite,
                                stars,
                                imageUrl,
                                vegetarian,
                                description,
                            });
                
                            const savedFood = await newFood.save();
                            res.status(201).send(savedFood); // Respond with the newly added food item
                        } catch (error) {
                            console.error('Error adding food:', error);
                            res.status(500).send({ message: 'Failed to add food' });
                        }
                    })
                );

                router.delete(
                    '/:foodId',
                    handler(async (req, res) => {
                        const { foodId } = req.params;
                        try {
                            const deletedFood = await FoodModel.findByIdAndDelete(foodId);
                            if (!deletedFood) {
                                return res.status(404).send({ message: 'Food not found' });
                            }
                            res.send({ message: 'Food deleted successfully', deletedFood });
                        } catch (error) {
                            console.error('Error deleting food:', error);
                            res.status(500).send({ message: 'Failed to delete food' });
                        }
                    })
                );
                

               // ... (code for other routes)
                router.put(
                    '/update/:foodId',
                    handler(async (req, res) => {
                    const { foodId } = req.params;
                    const updateFields = {}; // Object to store fields to update
                    
                    const {
                        name,
                        price,
                        tags,
                        favorite,
                        stars,
                        imageUrl,
                        vegetarian,
                        description,
                    } = req.body;
                
                    // Update only the fields that are present in the request body
                    if (name) updateFields.name = name;
                    if (price) updateFields.price = price;
                    if (tags) {
                        if (typeof tags === 'string') {
                        updateFields.tags = tags.split(',').map((tag) => tag.trim());
                        } else if (Array.isArray(tags)) {
                        updateFields.tags = tags.map((tag) => tag.trim());
                        }
                    }
                    if (favorite !== undefined) updateFields.favorite = favorite;
                    if (stars) updateFields.stars = stars;
                    if (imageUrl) updateFields.imageUrl = imageUrl;
                    if (vegetarian !== undefined) updateFields.vegetarian = vegetarian;
                    if (description) updateFields.description = description;
                
                    try {
                        const updatedFood = await FoodModel.findByIdAndUpdate(
                        foodId,
                        updateFields,
                        { new: true } // To return the updated document
                        );
                
                        if (!updatedFood) {
                        return res.status(404).send({ message: 'Food not found' });
                        }
                
                        res.send(updatedFood); // Respond with the updated food item
                    } catch (error) {
                        console.error('Error updating food:', error);
                        res.status(500).send({ message: 'Failed to update food' });
                    }
                    })
                );
                
    
                    
                


    export default router;