"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStoreItem = exports.updateStoreItem = exports.addStoreItem = exports.deleteStore = exports.updateStore = exports.createStore = exports.getStoreBySlug = exports.getStoreById = exports.getAllStores = void 0;
const Store_1 = __importDefault(require("../models/Store"));
const getAllStores = async (req, res) => {
    try {
        const { city = 'Yaoundé', category, search, isOpen, isFeatured } = req.query;
        const query = {};
        if (city)
            query.city = city;
        if (typeof isOpen !== 'undefined')
            query.isOpen = String(isOpen) === 'true';
        if (typeof isFeatured !== 'undefined')
            query.isFeatured = String(isFeatured) === 'true';
        if (category)
            query.categories = { $in: String(category).split(',').map((x) => x.trim()) };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { categories: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }
        const stores = await Store_1.default.find(query).sort({ isFeatured: -1, rating: -1, createdAt: -1 });
        res.json(stores);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAllStores = getAllStores;
const getStoreById = async (req, res) => {
    try {
        const store = await Store_1.default.findById(req.params.id);
        if (!store)
            return res.status(404).json({ message: 'Store not found' });
        res.json(store);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getStoreById = getStoreById;
const getStoreBySlug = async (req, res) => {
    try {
        const store = await Store_1.default.findOne({ slug: req.params.slug });
        if (!store)
            return res.status(404).json({ message: 'Store not found' });
        res.json(store);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getStoreBySlug = getStoreBySlug;
const createStore = async (req, res) => {
    try {
        const store = new Store_1.default(req.body);
        await store.save();
        res.status(201).json(store);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createStore = createStore;
const updateStore = async (req, res) => {
    try {
        const store = await Store_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!store)
            return res.status(404).json({ message: 'Store not found' });
        res.json(store);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateStore = updateStore;
const deleteStore = async (req, res) => {
    try {
        const store = await Store_1.default.findByIdAndDelete(req.params.id);
        if (!store)
            return res.status(404).json({ message: 'Store not found' });
        res.json({ message: 'Store deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteStore = deleteStore;
const addStoreItem = async (req, res) => {
    try {
        const store = await Store_1.default.findById(req.params.id);
        if (!store)
            return res.status(404).json({ message: 'Store not found' });
        store.menu.push(req.body);
        await store.save();
        const newItem = store.menu[store.menu.length - 1];
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.addStoreItem = addStoreItem;
const updateStoreItem = async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const store = await Store_1.default.findById(id);
        if (!store)
            return res.status(404).json({ message: 'Store not found' });
        const item = store.menu.id(itemId);
        if (!item)
            return res.status(404).json({ message: 'Item not found' });
        Object.assign(item, req.body);
        await store.save();
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateStoreItem = updateStoreItem;
const deleteStoreItem = async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const store = await Store_1.default.findById(id);
        if (!store)
            return res.status(404).json({ message: 'Store not found' });
        const item = store.menu.id(itemId);
        if (!item)
            return res.status(404).json({ message: 'Item not found' });
        item.deleteOne();
        await store.save();
        res.json({ message: 'Item deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteStoreItem = deleteStoreItem;
