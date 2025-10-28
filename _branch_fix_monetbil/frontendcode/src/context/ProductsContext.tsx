import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '../types';
import { productsApi } from '../services/api';

interface ProductsContextType {
	products: Product[];
	addProduct: (p: Omit<Product, 'id'>) => Promise<Product>;
	updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
	removeProduct: (id: string) => Promise<void>;
	reload: () => void;
	loading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [list, setList] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	const load = async () => {
		try {
			setLoading(true);
			const data = await productsApi.getAll();
			setList(data.map((p: any) => ({
				id: p._id,
				name: p.name,
				price: p.price,
				priceRange: p.priceRange,
				image: p.image,
				rating: p.rating,
				category: p.category,
				type: p.type,
				description: p.description,
				stock: p.stock
			})));
		} catch (error) {
			console.error('Failed to load products:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { load(); }, []);

	const addProduct = async (p: Omit<Product, 'id'>): Promise<Product> => {
		const newProduct = await productsApi.create(p);
		const product: Product = {
			id: newProduct._id,
			...newProduct
		};
		setList(prev => [product, ...prev]);
		return product;
	};

	const updateProduct = async (id: string, patch: Partial<Product>) => {
		await productsApi.update(id, patch);
		setList(prev => prev.map(x => (x.id === id ? { ...x, ...patch, id: x.id } : x)));
	};

	const removeProduct = async (id: string) => {
		await productsApi.delete(id);
		setList(prev => prev.filter(x => x.id !== id));
	};

	const reload = () => { load(); };

	const value = useMemo(() => ({ products: list, addProduct, updateProduct, removeProduct, reload, loading }), [list, loading]);
	return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export function useProducts(): ProductsContextType {
	const ctx = useContext(ProductsContext);
	if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
	return ctx;
}
