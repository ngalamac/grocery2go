import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const { city, cuisine, search, isOpen, isFeatured } = req.query;
    const query: any = {};

    if (city) query.city = city;
    if (typeof isOpen !== 'undefined') query.isOpen = isOpen === 'true';
    if (typeof isFeatured !== 'undefined') query.isFeatured = isFeatured === 'true';
    if (cuisine) query.cuisine = { $in: String(cuisine).split(',').map((x) => x.trim()) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const restaurants = await Restaurant.find(query).sort({ isFeatured: -1, rating: -1, createdAt: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getRestaurantBySlug = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addMenuItem = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    restaurant.menu.push(req.body);
    await restaurant.save();
    const newItem = restaurant.menu[restaurant.menu.length - 1];
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params as { id: string; itemId: string };
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    const item = restaurant.menu.id(itemId as any);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    Object.assign(item, req.body);
    await restaurant.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params as { id: string; itemId: string };
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    const item = restaurant.menu.id(itemId as any);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    item.deleteOne();
    await restaurant.save();
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
