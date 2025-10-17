export type StoreType = 'store' | 'market' | 'supermarket';

export interface Store {
  id: string;
  name: string;
  type: StoreType;
  area: string; // neighborhood in Yaoundé
  rating: number;
  image: string;
  deliveryFeeCFA: number;
  etaRangeMins: [number, number];
  tags?: string[];
}

export const yaoundeAreas = [
  'Mimboman', 'Biyem-Assi', 'Bastos', 'Etoudi', 'Ngousso', 'Nkolbisson', 'Essos', 'Emana', 'Nsam', 'Mvog-Ada'
];

export const stores: Store[] = [
  {
    id: 'st-1',
    name: 'Dovv Supermarket Mimboman',
    type: 'supermarket',
    area: 'Mimboman',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&cs=tinysrgb&w=800',
    deliveryFeeCFA: 700,
    etaRangeMins: [30, 45],
    tags: ['Groceries', 'Household', 'Snacks']
  },
  {
    id: 'st-2',
    name: 'Mahima Bastos',
    type: 'supermarket',
    area: 'Bastos',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
    deliveryFeeCFA: 800,
    etaRangeMins: [35, 50],
    tags: ['Imported', 'Bakery', 'Beverages']
  },
  {
    id: 'st-3',
    name: 'Marché Mokolo (Stalls)',
    type: 'market',
    area: 'Ngoa-Ekélé',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/1408306/pexels-photo-1408306.jpeg?auto=compress&cs=tinysrgb&w=800',
    deliveryFeeCFA: 500,
    etaRangeMins: [25, 40],
    tags: ['Fresh Produce', 'Butchery']
  },
  {
    id: 'st-4',
    name: 'Santa Lucia Mendong',
    type: 'store',
    area: 'Mendong',
    rating: 4.4,
    image: 'https://images.pexels.com/photos/1346132/pexels-photo-1346132.jpeg?auto=compress&cs=tinysrgb&w=800',
    deliveryFeeCFA: 600,
    etaRangeMins: [30, 45],
    tags: ['Groceries', 'Deli']
  },
  {
    id: 'st-5',
    name: 'Carrefour Market Etoudi',
    type: 'supermarket',
    area: 'Etoudi',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/5610153/pexels-photo-5610153.jpeg?auto=compress&cs=tinysrgb&w=800',
    deliveryFeeCFA: 900,
    etaRangeMins: [35, 55],
    tags: ['Groceries', 'Gourmet']
  }
];
