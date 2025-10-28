"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenuItem = exports.updateMenuItem = exports.addMenuItem = exports.deleteRestaurant = exports.updateRestaurant = exports.createRestaurant = exports.getRestaurantBySlug = exports.getRestaurantById = exports.getAllRestaurants = void 0;
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const getAllRestaurants = async (req, res) => {
    try {
        const { city, cuisine, search, isOpen, isFeatured } = req.query;
        const query = {};
        if (city)
            query.city = city;
        if (typeof isOpen !== 'undefined')
            query.isOpen = isOpen === 'true';
        if (typeof isFeatured !== 'undefined')
            query.isFeatured = isFeatured === 'true';
        if (cuisine)
            query.cuisine = { $in: String(cuisine).split(',').map((x) => x.trim()) };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { cuisine: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }
        const restaurants = await Restaurant_1.default.find(query).sort({ isFeatured: -1, rating: -1, createdAt: -1 });
        res.json(restaurants);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAllRestaurants = getAllRestaurants;
const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant_1.default.findById(req.params.id);
        if (!restaurant)
            return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getRestaurantById = getRestaurantById;
const getRestaurantBySlug = async (req, res) => {
    try {
        const restaurant = await Restaurant_1.default.findOne({ slug: req.params.slug });
        if (!restaurant)
            return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getRestaurantBySlug = getRestaurantBySlug;
const createRestaurant = async (req, res) => {
    try {
        const restaurant = new Restaurant_1.default(req.body);
        await restaurant.save();
        res.status(201).json(restaurant);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createRestaurant = createRestaurant;
const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!restaurant)
            return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateRestaurant = updateRestaurant;
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant_1.default.findByIdAndDelete(req.params.id);
        if (!restaurant)
            return res.status(404).json({ message: 'Restaurant not found' });
        res.json({ message: 'Restaurant deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteRestaurant = deleteRestaurant;
const addMenuItem = async (req, res) => {
    try {
        const restaurant = await Restaurant_1.default.findById(req.params.id);
        if (!restaurant)
            return res.status(404).json({ message: 'Restaurant not found' });
        restaurant.menu.push(req.body);
        await restaurant.save();
        const newItem = restaurant.menu[restaurant.menu.length - 1];
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.addMenuItem = addMenuItem;
const updateMenuItem = async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const restaurant = await Restaurant_1.default.findById(id);
        if (!restaurant)
            return res.status(404).json({ message: 'Restaurant not found' });
        const item = restaurant.menu.id(itemId);
        if (!item)
            return res.status(404).json({ message: 'Menu item not found' });
        Object.assign(item, req.body);
        await restaurant.save();
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateMenuItem = updateMenuItem;
const deleteMenuItem = async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const restaurant = await Restaurant_1.default.findById(id);
        if (!restaurant)
            return res.status(404).json({ message: 'Restaurant not found' });
        const item = restaurant.menu.id(itemId);
        if (!item)
            return res.status(404).json({ message: 'Menu item not found' });
        item.deleteOne();
        await restaurant.save();
        res.json({ message: 'Menu item deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteMenuItem = deleteMenuItem;
