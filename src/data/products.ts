export type UomOption = {
  label: string;
  price: number;
};

export type Product = {
  id: number;
  name: string;
  category: string;
  uom: UomOption[];
  errand: boolean;
  image: string;
  note?: string;
  price?: number;
  packSize?: string;

};

// Shared UOM scales
const GRAIN_UOM: UomOption[] = [
  { label: '1 Cup', price: 50 },
  { label: '1 Derica', price: 100 },
  { label: '1 Paint', price: 500 },
];

export const products: Product[] = [
  // Grains & Cereals
  { id: 1, name: 'Ofada Rice', category: 'Grains & Cereals', uom: GRAIN_UOM, errand: false, image: '/images/products/ofada-rice.jpg' },
  { id: 3, name: 'Abakaliki Rice', category: 'Grains & Cereals', uom: GRAIN_UOM, errand: false, image: '/images/products/abakaliki-rice.jpg' },
  { id: 5, name: 'Foreign Long-Rice', category: 'Grains & Cereals', uom: GRAIN_UOM, errand: false, image: '/images/products/foreign-rice.jpg' },
  { id: 7, name: 'White Beans', category: 'Grains & Cereals', uom: GRAIN_UOM, errand: false, image: '/images/products/white-beans.jpg' },
  { id: 9, name: 'Oloyin Beans', category: 'Grains & Cereals', uom: GRAIN_UOM, errand: false, image: '/images/products/honey-beans.jpg' },
  { id: 11, name: 'Brown Beans', category: 'Grains & Cereals', uom: GRAIN_UOM, errand: false, image: '/images/products/brown-beans.jpg' },
  { id: 13, name: 'Dried Maize (Corn)', category: 'Grains & Cereals', uom: GRAIN_UOM, errand: false, image: '/images/products/dried-maize.jpg' },

  // Tubers & Root Crops
  { id: 14, name: 'Garri (White)', category: 'Tubers & Root Crops', uom: GRAIN_UOM, errand: false, image: '/images/products/garri-white.jpg' },
  { id: 16, name: 'Garri (Yellow)', category: 'Tubers & Root Crops', uom: GRAIN_UOM, errand: false, image: '/images/products/garri-yellow.jpg' },
  { id: 18, name: 'Fufu (Cassava)', category: 'Tubers & Root Crops', uom: [{ label: '1 kg', price: 1800 }], errand: false, image: '/images/products/fufu.jpg' },
  { id: 19, name: 'Yam (Whole)', category: 'Tubers & Root Crops', uom: [{ label: '1 tuber', price: 3500 }], errand: false, image: '/images/products/yam.jpg' },

  // Legumes & Nuts
  { id: 20, name: 'Groundnut', category: 'Legumes & Nuts', uom: GRAIN_UOM, errand: false, image: '/images/products/groundnut.jpg' },
  { id: 22, name: 'Soya Beans', category: 'Legumes & Nuts', uom: GRAIN_UOM, errand: false, image: '/images/products/soya-beans.jpg' },
  { id: 23, name: 'Egusi', category: 'Legumes & Nuts', uom: GRAIN_UOM, errand: false, image: '/images/products/egusi.jpg' },

  // Spices & Seasonings
  { id: 25, name: 'Ata Rodo', category: 'Spices', uom: [{ label: '500 g', price: 1800 }], errand: false, image: '/images/products/ata-rodo.jpg' },
  { id: 26, name: 'Dry Pepper', category: 'Spices', uom: [{ label: '200 g', price: 1200 }], errand: false, image: '/images/products/dry-pepper.jpg' },
  { id: 27, name: 'Curry Powder', category: 'Spices', uom: [{ label: '100 g', price: 800 }], errand: false, image: '/images/products/curry-powder.jpg' },
  { id: 28, name: 'Thyme', category: 'Spices', uom: [{ label: '50 g', price: 600 }], errand: false, image: '/images/products/thyme.jpg' },
  { id: 29, name: 'Garlic', category: 'Spices', uom: [{ label: '100 g', price: 900 }], errand: false, image: '/images/products/garlic-powder.jpg' },
  { id: 30, name: 'Ginger (Ground)', category: 'Spices', uom: [{ label: '100 g', price: 750 }], errand: false, image: '/images/products/ground-ginger.jpg' },
  { id: 31, name: 'Locust Beans (Iru)', category: 'Spices', uom: [{ label: '100 g', price: 800 }], errand: false, image: '/images/products/locust-beans.jpg' },
  { id: 32, name: 'Nutmeg', category: 'Spices', uom: [{ label: '50 g', price: 700 }], errand: false, image: '/images/products/nutmeg.jpg' },
  { id: 33, name: 'Black Pepper', category: 'Spices', uom: [{ label: '50 g', price: 650 }], errand: false, image: '/images/products/black-pepper.jpg' },
  { id: 34, name: 'Maggi  Cubes', category: 'Spices', uom: [{ label: '50 cubes', price: 1200 }], errand: false, image: '/images/products/maggi-cubes.jpg' },
  { id: 35, name: 'Knorr  Cubes', category: 'Spices', uom: [{ label: '50 cubes', price: 1300 }], errand: false, image: '/images/products/knorr-cubes.jpg' },

  // Oils & Fats
  { id: 36, name: 'Palm Oil', category: 'Oils & Fats', uom: [{ label: '1 litre', price: 2800 }], errand: false, image: '/images/products/palm-oil.jpg' },

  // Proteins
  { id: 38, name: 'Crayfish', category: 'Proteins', uom: [{ label: '200 g', price: 2200 }], errand: false, image: '/images/products/crayfish.jpg' },
  { id: 40, name: 'Stockfish', category: 'Proteins', uom: [{ label: '500 g', price: 5500 }], errand: false, image: '/images/products/stockfish.jpg' },
  { id: 41, name: 'Smoked Catfish', category: 'Proteins', uom: [{ label: '500 g', price: 4200 }], errand: false, image: '/images/products/smoked-catfish.jpg' },
  { id: 43, name: 'Chicken (Fresh)', category: 'Proteins', uom: [{ label: 'per kg', price: 4500 }], errand: true, image: '/images/products/chicken.jpg' },
  { id: 44, name: 'Beef (Fresh)', category: 'Proteins', uom: [{ label: 'per kg', price: 5500 }], errand: true, image: '/images/products/beef.jpg' },
  { id: 45, name: 'Goat Meat (Fresh)', category: 'Proteins', uom: [{ label: 'per kg', price: 6000 }], errand: true, image: '/images/products/goat-meat.jpg' },
  { id: 46, name: 'Turkey (Fresh)', category: 'Proteins', uom: [{ label: 'per kg', price: 5000 }], errand: true, image: '/images/products/turkey.jpg' },
  { id: 47, name: 'Panla', category: 'Proteins', uom: [{ label: '500 g', price: 3800 }], errand: true, image: '/images/products/panla.jpg' },
  { id: 48, name: 'Snail (Fresh)', category: 'Proteins', uom: [{ label: 'per pack', price: 4500 }], errand: true, image: '/images/products/snail.jpg' },
  { id: 49, name: 'Periwinkles', category: 'Proteins', uom: [{ label: '500 g', price: 2800 }], errand: true, image: '/images/products/periwinkles.jpg' },

  // Vegetables
  { id: 50, name: 'Ugu ', category: 'Vegetables', uom: [{ label: 'per bunch', price: 800 }], errand: true, image: '/images/products/ugu.jpg' },
  { id: 51, name: 'Waterleaf', category: 'Vegetables', uom: [{ label: 'per bunch', price: 600 }], errand: true, image: '/images/products/waterleaf.jpg' },
  { id: 52, name: 'Scent Leaf (Efirin)', category: 'Vegetables', uom: [{ label: 'per bunch', price: 500 }], errand: true, image: '/images/products/scent-leaf.jpg' },
  { id: 53, name: 'Ewedu (Jute Leaves)', category: 'Vegetables', uom: [{ label: 'per bunch', price: 600 }], errand: true, image: '/images/products/ewedu.jpg' },
  { id: 54, name: 'Okra (Fresh)', category: 'Vegetables', uom: [{ label: '500 g', price: 900 }], errand: true, image: '/images/products/okra.jpg' },
  { id: 55, name: 'Spinach', category: 'Vegetables', uom: [{ label: 'per bunch', price: 700 }], errand: true, image: '/images/products/spinach.jpg' },
  { id: 56, name: 'Tomatoes (Fresh)', category: 'Vegetables', uom: [{ label: '1 kg', price: 1500 }], errand: true, image: '/images/products/tomatoes.jpg' },

  // Fruits
  { id: 57, name: 'Plantain', category: 'Fruits', uom: [{ label: 'per finger', price: 1200 }], errand: true, image: '/images/products/plantain.jpg' },
  { id: 58, name: 'Pineapple', category: 'Fruits', uom: [{ label: 'per piece', price: 1500 }], errand: true, image: '/images/products/pineapple.jpg' },
  { id: 59, name: 'Oranges', category: 'Fruits', uom: [{ label: 'per dozen', price: 1800 }], errand: true, image: '/images/products/oranges.jpg' },
  { id: 60, name: 'Watermelon', category: 'Fruits', uom: [{ label: 'per piece', price: 4000 }], errand: true, image: '/images/products/watermelon.jpg' },
  { id: 61, name: 'Coconut (Whole)', category: 'Fruits', uom: [{ label: 'per piece', price: 1200 }], errand: true, image: '/images/products/coconut.jpg' },
  { id: 62, name: 'Apple (Whole)', category: 'Fruits', uom: [{ label: 'per piece', price: 700 }], errand: true, image: '/images/products/apple.jpg' },

  // Drinks & Refreshments
  { id: 63, name: 'Bottled Water (Small)', category: 'Drinks & Refreshments', uom: [{ label: '50 cl bottle', price: 300 }], errand: true, image: '/images/products/bottled-water.jpg' },
  { id: 65, name: 'Sachet Water', category: 'Drinks & Refreshments', uom: [{ label: '1 bag', price: 500 }], errand: true, image: '/images/products/sachet-water.jpg' },
  { id: 66, name: 'Soft Drinks', category: 'Drinks & Refreshments', uom: [{ label: 'per bottle/can', price: 700 }], errand: true, image: '/images/products/soft-drinks.jpg' },
  { id: 67, name: 'Malt Drinks', category: 'Drinks & Refreshments', uom: [{ label: 'per bottle/can', price: 900 }], errand: true, image: '/images/products/malt-drinks.jpg' },
  { id: 68, name: 'Fruit Juices', category: 'Drinks & Refreshments', uom: [{ label: '1 litre pack', price: 1800 }], errand: true, image: '/images/products/fruit-juice.jpg' },
  { id: 69, name: 'Energy Drinks', category: 'Drinks & Refreshments', uom: [{ label: 'per bottle/can', price: 1200 }], errand: true, image: '/images/products/energy-drinks.jpg' },
  { id: 70, name: 'Bitters', category: 'Drinks & Refreshments', uom: [{ label: 'all sizes', price: 1600 }], errand: true, image: '/images/products/bitters.jpg' },

  // Bakery & Dairy
  { id: 71, name: 'Bread', category: 'Bakery & Dairy', uom: [{ label: '1 loaf', price: 1200 }], errand: true, image: '/images/products/bread.jpg' },
  { id: 72, name: 'Yogurt', category: 'Bakery & Dairy', uom: [{ label: 'per cup', price: 1800 }], errand: true, image: '/images/products/yogurt.jpg' },
  { id: 73, name: 'Butter', category: 'Bakery & Dairy', uom: [{ label: '250 g tub', price: 2200 }], errand: true, image: '/images/products/butter.jpg' },

  // Breakfast & Pantry
  { id: 74, name: 'Honey', category: 'Breakfast & Pantry', uom: [{ label: '500 ml', price: 3500 }], errand: true, image: '/images/products/honey.jpg' },
  { id: 75, name: 'Oats', category: 'Breakfast & Pantry', uom: [{ label: '500 g pack', price: 2800 }], errand: true, image: '/images/products/oats.jpg' },
  { id: 76, name: 'Pap', category: 'Breakfast & Pantry', uom: [{ label: '1 litre', price: 1500 }], errand: true, image: '/images/products/pap.jpg' },

  // Gas
  { id: 77, name: 'Cooking Gas', category: 'Gas', uom: [{ label: '3 kg', price: 4500 }], errand: false, image: '/images/products/cooking-gas.jpg' },
];

export default products;