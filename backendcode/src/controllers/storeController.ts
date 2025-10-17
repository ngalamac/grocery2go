import { Request, Response } from 'express';
import Store from '../models/Store';

export const getAllStores = async (req: Request, res: Response) => {
  try {
    const { city = 'Yaoundé', category, search, isOpen, isFeatured } = req.query as any;
    const query: any = {};

    if (city) query.city = city;
    if (typeof isOpen !== 'undefined') query.isOpen = String(isOpen) === 'true';
    if (typeof isFeatured !== 'undefined') query.isFeatured = String(isFeatured) === 'true';
    if (category) query.categories = { $in: String(category).split(',').map((x) => x.trim()) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { categories: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const stores = await Store.find(query).sort({ isFeatured: -1, rating: -1, createdAt: -1 });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getStoreById = async (req: Request, res: Response) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getStoreBySlug = async (req: Request, res: Response) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createStore = async (req: Request, res: Response) => {
  try {
    const store = new Store(req.body);
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateStore = async (req: Request, res: Response) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json({ message: 'Store deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addStoreItem = async (req: Request, res: Response) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    store.menu.push(req.body);
    await store.save();
    const newItem = store.menu[store.menu.length - 1];
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateStoreItem = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params as any;
    const store = await Store.findById(id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const item = store.menu.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    Object.assign(item, req.body);
    await store.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteStoreItem = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params as any;
    const store = await Store.findById(id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const item = store.menu.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.deleteOne();
    await store.save();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
