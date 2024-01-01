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




    export default router;