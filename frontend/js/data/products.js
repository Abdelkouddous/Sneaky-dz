import { generateUUID } from '../utils/helpers.js';

export const products = [
  {
    id: generateUUID(),
    name: "Air Max Pulse Roam",
    brand: "Nike",
    price: 1550000, // 15,500 DA
    oldPrice: 1750000,
    category: "lifestyle",
    gender: "men",
    image: "assets/sneaker_product_1_1783532819351.jpg",
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isSale: true,
    colors: ["#000000", "#FFFFFF", "#FF4D00"],
    sizes: [40, 41, 42, 43, 44, 45],
    stock: { 40: 5, 41: 0, 42: 12, 43: 8, 44: 2, 45: 0 },
    description: "The Air Max Pulse Roam takes inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and vacuum-sealed accents keep it looking fresh and clean."
  },
  {
    id: generateUUID(),
    name: "Dunk Low Retro",
    brand: "Nike",
    price: 2150000, // 21,500 DA
    oldPrice: null,
    category: "lifestyle",
    gender: "unisex",
    image: "assets/sneaker_product_2_1783532827451.jpg",
    rating: 4.9,
    reviews: 856,
    isNew: false,
    isSale: false,
    colors: ["#FFFFFF", "#000000"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44],
    stock: { 36: 2, 37: 5, 38: 10, 39: 15, 40: 20, 41: 15, 42: 8, 43: 4, 44: 1 },
    description: "Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colors. This basketball icon channels '80s vibes with premium leather."
  },
  {
    id: generateUUID(),
    name: "Yeezy Boost 350 V2",
    brand: "Adidas",
    price: 3200000, // 32,000 DA
    oldPrice: null,
    category: "lifestyle",
    gender: "unisex",
    image: "assets/sneaker_product_3_1783532835359.jpg",
    rating: 4.7,
    reviews: 432,
    isNew: false,
    isSale: false,
    colors: ["#F5F5DC", "#808080"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    stock: { 38: 0, 39: 2, 40: 5, 41: 8, 42: 10, 43: 6, 44: 2, 45: 0, 46: 1 },
    description: "The Yeezy Boost 350 V2 features an upper composed of re-engineered Primeknit. The post-dyed monofilament side stripe is woven into the upper. The midsole utilizes adidas' innovative BOOST™ technology."
  },
  {
    id: generateUUID(),
    name: "Air Jordan 1 High OG",
    brand: "Jordan",
    price: 2800000, // 28,000 DA
    oldPrice: null,
    category: "basketball",
    gender: "men",
    image: "assets/sneaker_product_4_1783532844313.jpg",
    rating: 5.0,
    reviews: 1205,
    isNew: true,
    isSale: false,
    colors: ["#FF0000", "#FFFFFF", "#000000"],
    sizes: [40, 41, 42, 43, 44, 45, 46],
    stock: { 40: 3, 41: 7, 42: 15, 43: 12, 44: 8, 45: 4, 46: 2 },
    description: "Familiar but always fresh, the iconic Air Jordan 1 is remastered for today's sneakerhead culture. This Retro High OG version goes all in with premium leather, comfortable cushioning and classic design details."
  },
  {
    id: generateUUID(),
    name: "New Balance 990v6",
    brand: "New Balance",
    price: 2450000, // 24,500 DA
    oldPrice: null,
    category: "running",
    gender: "unisex",
    image: "assets/sneaker_product_5_1783533592276.jpg",
    rating: 4.6,
    reviews: 320,
    isNew: false,
    isSale: false,
    colors: ["#808080", "#000080"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    stock: { 38: 2, 39: 5, 40: 8, 41: 12, 42: 15, 43: 10, 44: 5, 45: 2, 46: 1 },
    description: "The 990's original designers were tasked with creating the single best running shoe on the market. The MADE in USA 990v6 embraces this original mandate, with a series of performance-inspired updates."
  },
  {
    id: generateUUID(),
    name: "Gel-Kayano 14",
    brand: "Asics",
    price: 1850000, // 18,500 DA
    oldPrice: 1950000,
    category: "running",
    gender: "women",
    image: "assets/sneaker_product_6_1783533601168.jpg",
    rating: 4.8,
    reviews: 215,
    isNew: false,
    isSale: true,
    colors: ["#FFFFFF", "#C0C0C0", "#FF69B4"],
    sizes: [36, 37, 38, 39, 40, 41, 42],
    stock: { 36: 4, 37: 8, 38: 12, 39: 10, 40: 6, 41: 3, 42: 0 },
    description: "Conveying a new perception to the retro running shape, the GEL-KAYANO® 14 running shoe resurfaces with its late 2000s aesthetic as a nod to our storied GEL-KAYANO® series."
  }
];

export const getProducts = () => Promise.resolve([...products]);
export const getProductById = (id) => Promise.resolve(products.find(p => p.id === id));
export const getFeaturedProducts = () => Promise.resolve(products.slice(0, 4));
export const getSaleProducts = () => Promise.resolve(products.filter(p => p.isSale));
