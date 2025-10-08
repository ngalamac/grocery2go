import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '../types';
import { products as mockProducts } from '../data/mockData';

interface ProductsContextType {
	products: Product[];
	addProduct: (p: Omit<Product, 'id'>) => Product;
	updateProduct: (id: string, patch: Partial<Product>) => void;
	removeProduct: (id: string) => void;
	reload: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const STORAGE_KEY = 'g2g_products';

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [list, setList] = useState<Product[]>([]);

	const load = () => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				setList(JSON.parse(raw));
				return;
			}
			setList(mockProducts);
		} catch {
			setList(mockProducts);
		}
	};

	useEffect(() => { load(); }, []);

	useEffect(() => {
		try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
	}, [list]);

	const addProduct = (p: Omit<Product, 'id'>): Product => {
		const id = Math.random().toString(36).slice(2, 8);
		const np: Product = { id, ...p } as Product;
		setList(prev => [np, ...prev]);
		return np;
	};

	const updateProduct = (id: string, patch: Partial<Product>) => {
		setList(prev => prev.map(x => (x.id === id ? { ...x, ...patch, id: x.id } : x)));
	};

	const removeProduct = (id: string) => {
		setList(prev => prev.filter(x => x.id !== id));
	};

	const reload = () => load();

	const value = useMemo(() => ({ products: list, addProduct, updateProduct, removeProduct, reload }), [list]);
	return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export function useProducts(): ProductsContextType {
	const ctx = useContext(ProductsContext);
	if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
	return ctx;
}