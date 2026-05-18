export type OrderMode = 'purchase' | 'errand' | 'both'

export type Product = {
  id: number
  name: string
  category: string
  price: number
  packSize: string
  note: string
}

export type DeliveryZone = {
  id: string
  label: string
  fee: string
  eta: string
}

export const brandPromises = ['Fresh', 'Hygienic', 'Locally Sourced']

export const orderModes: { id: OrderMode; title: string; description: string }[] = [
  {
    id: 'purchase',
    title: 'Purchase',
    description: 'Pick packaged food items, add them to cart, and submit quickly.',
  },
  {
    id: 'errand',
    title: 'Errand',
    description:
      'Tell us the extra market items you need and we can help buy them for you.',
  },
  {
    id: 'both',
    title: 'Purchase + Errand',
    description:
      'Order from our store and add outside-market requests in one delivery.',
  },
]

export const products: Product[] = [
  {
    id: 1,
    name: 'Clean Rice',
    category: 'Rice & Beans',
    price: 3200,
    packSize: '2kg sealed pack',
    note: 'Clear nylon, printed label, packed date included.',
  },
  {
    id: 2,
    name: 'Honey Beans',
    category: 'Rice & Beans',
    price: 2800,
    packSize: '2kg sealed pack',
    note: 'Sorted, neat, and ready for home use.',
  },
  {
    id: 3,
    name: 'Indomie Bundle',
    category: 'Indomie & Spaghetti',
    price: 1900,
    packSize: '5-pack bundle',
    note: 'Value bundle for quick meals and family stock-up.',
  },
  {
    id: 4,
    name: 'Spaghetti Pack',
    category: 'Indomie & Spaghetti',
    price: 1700,
    packSize: '4-pack bundle',
    note: 'Simple pantry staple with consistent label style.',
  },
  {
    id: 5,
    name: 'Kitchen Spice Mix',
    category: 'Spices',
    price: 800,
    packSize: '250g pouch',
    note: 'Curry, thyme, and pepper mix in one easy pack.',
  },
  {
    id: 6,
    name: 'Ground Crayfish',
    category: 'Crayfish',
    price: 1500,
    packSize: '200g zip pouch',
    note: 'Airtight, sealed, and clean for serious buyers.',
  },
  {
    id: 7,
    name: 'Dry Pepper',
    category: 'Pepper',
    price: 500,
    packSize: 'Standard pack',
    note: 'Uniform pack sizes for easy shopping and fast reorder.',
  },
  {
    id: 8,
    name: 'Fresh Onions',
    category: 'Onions',
    price: 1200,
    packSize: 'Basket-selected set',
    note: 'Neatly arranged and sold with order, not overcrowded on display.',
  },
]

export const deliveryZones: DeliveryZone[] = [
  { id: 'nearby', label: 'Nearby area', fee: '₦1,000', eta: '30 to 45 mins' },
  { id: 'mid', label: 'Mid-range area', fee: '₦1,800', eta: '45 to 70 mins' },
  { id: 'far', label: 'Farther area', fee: '₦2,500', eta: '70 to 100 mins' },
]

export const shelfTips = [
  'Group the same products together so customers can compare fast.',
  'Keep all labels facing front for trust and easy recognition.',
  'Use baskets or wooden trays to make the shelves feel neat and natural.',
  'Avoid overcrowding so every product still looks premium.',
]

export const thankYouLines = [
  'E sure for u',
  'Senior man',
  'Oga boss',
  'See as u fresh',
  'Chop remain o',
  'Money na water',
]
