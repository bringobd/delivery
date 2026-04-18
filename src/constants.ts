import { Restaurant, Category, Order } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Pizza', icon: '🍕' },
  { id: '2', name: 'Burgers', icon: '🍔' },
  { id: '3', name: 'Sushi', icon: '🍣' },
  { id: '4', name: 'Pasta', icon: '🍝' },
  { id: '5', name: 'Desserts', icon: '🍰' },
  { id: '6', name: 'Healthy Food', icon: '🥗' },
  { id: '7', name: 'Tacos', icon: '🌮' },
  { id: '8', name: 'Coffee', icon: '☕' },
  { id: '9', name: 'Steak', icon: '🥩' },
  { id: '10', name: 'Bakery', icon: '🥐' },
  { id: '11', name: 'Asian', icon: '🍜' },
  { id: '12', name: 'Drinks', icon: '🥤' },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'res-1',
    name: 'Pizza Maestro',
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: 50,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    description: 'Authentic Italian wood-fired pizza with fresh ingredients.',
    categories: ['Pizza', 'Pasta', 'Italian'],
    commission: 80,
    menu: [
      { id: 'm1', name: 'Pepperoni Pizza', description: 'Tomato sauce, mozzarella, pepperoni', price: 189, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400', category: 'Pizza' },
      { id: 'm2', name: 'Margherita Pizza', description: 'Tomato sauce, mozzarella, basil', price: 149, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=400', category: 'Pizza' },
      { id: 'm3', name: 'Pasta Carbonara', description: 'Spaghetti, bacon, egg, parmesan', price: 165, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=400', category: 'Pasta' },
    ]
  },
  {
    id: 'res-2',
    name: 'Burger House',
    rating: 4.7,
    deliveryTime: '15-25 min',
    deliveryFee: 50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    description: 'Juicy burgers from the best meat and local products.',
    categories: ['Burgers', 'American'],
    commission: 80,
    menu: [
      { id: 'm4', name: 'Cheeseburger', description: 'Beef, cheddar, sauce, vegetables', price: 129, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', category: 'Burgers' },
      { id: 'm5', name: 'Double Burger', description: 'Double beef, bacon, cheese', price: 179, image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&q=80&w=400', category: 'Burgers' },
      { id: 'm6', name: 'French Fries', description: 'Crispy fries with signature sauce', price: 59, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400', category: 'Sides' },
    ]
  },
  {
    id: 'res-3',
    name: 'Sushi Bar',
    rating: 4.9,
    deliveryTime: '25-35 min',
    deliveryFee: 50,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=800',
    description: 'Fresh sushi and rolls, prepared daily by master chefs.',
    categories: ['Sushi', 'Japanese'],
    commission: 80,
    menu: [
      { id: 'm7', name: 'Philadelphia Roll', description: 'Salmon, cream cheese, cucumber', price: 219, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400', category: 'Sushi' },
      { id: 'm8', name: 'California Roll', description: 'Crab, avocado, cucumber, roe', price: 199, image: 'https://images.unsplash.com/photo-1559466273-d95e72debaf8?auto=format&fit=crop&q=80&w=400', category: 'Sushi' },
      { id: 'm9', name: 'Sushi Set 24 pcs.', description: '24 pieces, assorted rolls', price: 399, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&q=80&w=400', category: 'Sets' },
    ]
  },
  {
    id: 'res-4',
    name: 'Taco Loco',
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: 50,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
    description: 'Fiery Mexican cuisine that adds spice.',
    categories: ['Tacos', 'Mexican'],
    commission: 80,
    menu: [
      { id: 'm10', name: 'Chicken Taco', description: 'Tortilla, chicken, salsa', price: 115, image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=400', category: 'Tacos' },
      { id: 'm11', name: 'Burrito', description: 'Large burrito with meat and beans', price: 145, image: 'https://images.unsplash.com/photo-1584031036380-3fb6f2d51880?auto=format&fit=crop&q=80&w=400', category: 'Burrito' },
    ]
  },
  {
    id: 'res-5',
    name: 'Steak House',
    rating: 4.9,
    deliveryTime: '30-45 min',
    deliveryFee: 70,
    image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800',
    description: 'Premium cuts of meat, grilled to perfection.',
    categories: ['Steak', 'American'],
    commission: 80,
    menu: [
      { id: 'm12', name: 'Ribeye Steak', description: '300g premium ribeye beef', price: 450, image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=400', category: 'Steak' },
      { id: 'm13', name: 'Grilled Vegetables', description: 'Seasonal grilled vegetables', price: 120, image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&q=80&w=400', category: 'Sides' },
    ]
  },
  {
    id: 'res-6',
    name: 'Asian Fusion',
    rating: 4.6,
    deliveryTime: '20-35 min',
    deliveryFee: 40,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
    description: 'A modern take on traditional Asian dishes.',
    categories: ['Asian', 'Noodles'],
    commission: 80,
    menu: [
      { id: 'm14', name: 'Pad Thai', description: 'Rice noodles, shrimp, peanuts', price: 185, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=400', category: 'Asian' },
      { id: 'm15', name: 'Miso Soup', description: 'Traditional Japanese soup', price: 75, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400', category: 'Asian' },
    ]
  }
];

export const LIVE_ORDERS: Order[] = [
  {
    id: '#2001',
    restaurantId: 'res-1',
    restaurantName: 'Pizza Maestro',
    items: 'Pepperoni, Margherita',
    total: 338,
    status: 'preparing',
    timestamp: Date.now() - 180000,
    userId: 'mock-user-1'
  },
  {
    id: '#2002',
    restaurantId: 'res-2',
    restaurantName: 'Burger House',
    items: 'Cheeseburger x2, Fries',
    total: 317,
    status: 'accepted',
    timestamp: Date.now() - 90000,
    userId: 'mock-user-2'
  },
  {
    id: '#2003',
    restaurantId: 'res-3',
    restaurantName: 'Sushi Bar',
    items: 'Philadelphia Set',
    total: 269,
    status: 'ready',
    timestamp: Date.now() - 60000,
    userId: 'mock-user-3'
  }
];

export const PROMOS = [
  { 
    id: '1',
    title: '20% OFF', 
    subtitle: 'on first order over 500₴', 
    icon: '🎉',
    gradient: 'from-[#0CEDE9] to-[#1A7EDB]' 
  },
  { 
    id: '2',
    title: 'FREE DELIVERY', 
    subtitle: 'on orders over 300₴', 
    icon: '🚀',
    gradient: 'from-[#2196F3] to-[#0CEDE9]' 
  },
  { 
    id: '3',
    title: 'COMBO MENU', 
    subtitle: 'Pizza + Drink for only 249₴', 
    icon: '🍕',
    gradient: 'from-[#0CEDE9] to-[#2196F3]' 
  }
];

