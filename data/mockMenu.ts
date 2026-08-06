export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  isGlutenFree?: boolean;
}

export const MAIN_CATEGORIES = [
  { id: 'cafeteria', name: 'CAFETERÍA' },
  { id: 'cocina', name: 'COCINA' },
  { id: 'bebidas', name: 'BEBIDAS' },
  { id: 'sintacc', name: 'SIN TACC' },
];

export const MOCK_ITEMS: MenuItem[] = [
  // ================= CAFETERÍA =================
  {
    id: 'c1',
    name: 'Espresso Doble',
    description: 'Extracción intensa con granos seleccionados 100% arábica.',
    price: 2800,
    category: 'cafeteria',
    subcategory: 'Cafetería Tradicional',
  },
  {
    id: 'c2',
    name: 'Café con Leche',
    description: 'Doble shot de espresso servido con leche creada a vapor.',
    price: 3200,
    category: 'cafeteria',
    subcategory: 'Cafetería Tradicional',
  },
  {
    id: 'c3',
    name: 'Flat White Especial',
    description: 'Doble shot de espresso concentrado con microespuma de leche.',
    price: 3600,
    category: 'cafeteria',
    subcategory: 'Cafetería Especial',
  },
  {
    id: 'c4',
    name: 'Mocaccino de Avellanas',
    description: 'Espresso, chocolate fundido, leche vaporizada y toque de avellana.',
    price: 4200,
    category: 'cafeteria',
    subcategory: 'Cafetería Especial',
  },
  {
    id: 'c5',
    name: 'Tostado de Jamón y Queso',
    description: 'En pan de miga artesanal hojaldrado doradito a la plancha.',
    price: 5500,
    category: 'cafeteria',
    subcategory: 'Opciones de Merienda',
  },
  {
    id: 'c6',
    name: 'Tarta de Zanahoria & Nuez (Carrot Cake)',
    description: 'Bizcochuelo especiado con nueces y abundante frosting de queso crema.',
    price: 4800,
    category: 'cafeteria',
    subcategory: 'Tortas & Pastelería',
  },
  {
    id: 'c7',
    name: 'Cheesecake de Frutos Rojos',
    description: 'Clásico pastel de queso horneado con salsa casera de frutos del bosque.',
    price: 5200,
    category: 'cafeteria',
    subcategory: 'Tortas & Pastelería',
  },

  // ================= COCINA =================
  {
    id: 'k1',
    name: 'Papas Antonela Guarracino',
    description: 'Papas fritas crocantes con salsa cheddar artesanal y panceta tostada.',
    price: 16000,
    category: 'cocina',
    subcategory: 'Entradas & Para Compartir',
  },
  {
    id: 'k2',
    name: 'Rabas a la Romana',
    description: 'Rabas crocantes con lactonesa de rúcula y gajos de limón.',
    price: 25000,
    category: 'cocina',
    subcategory: 'Entradas & Para Compartir',
  },
  {
    id: 'k3',
    name: 'Hamburguesa Smash Doble',
    description: 'Doble medalla de carne, cheddar fundido, cebolla caramelizada y salsa especial.',
    price: 12500,
    category: 'cocina',
    subcategory: 'Platos Principales',
  },
  {
    id: 'k4',
    name: 'Ojo de Bife con Manteca de Hierbas',
    description: 'Corte a la parrilla con manteca de romero y tomillo con papas rústicas.',
    price: 28000,
    category: 'cocina',
    subcategory: 'Platos Principales',
  },
  {
    id: 'k5',
    name: 'Volcán de Dulce de Leche',
    description: 'Bizcochuelo tibio con corazón fluido y bocha de helado de crema.',
    price: 7800,
    category: 'cocina',
    subcategory: 'Postres',
  },

  // ================= BEBIDAS =================
  {
    id: 'b1',
    name: 'Limonada con Menta y Jengibre',
    description: 'Jugo natural de limón, menta fresca y toque de jengibre.',
    price: 3200,
    category: 'bebidas',
    subcategory: 'Sin Alcohol',
  },
  {
    id: 'b2',
    name: 'Agua Mineral 500ml',
    description: 'Con o sin gas.',
    price: 2200,
    category: 'bebidas',
    subcategory: 'Sin Alcohol',
  },
  {
    id: 'b3',
    name: 'Fernet Branca con Cola',
    description: 'Servido en vaso trago largo bien helado.',
    price: 6500,
    category: 'bebidas',
    subcategory: 'Tragos & Coctelería',
  },
  {
    id: 'b4',
    name: 'Gin Tonic de Frutos Rojos',
    description: 'Gin artesanal, agua tónica, frutos rojos y rodaja de pepino.',
    price: 7200,
    category: 'bebidas',
    subcategory: 'Tragos & Coctelería',
  },
  {
    id: 'b5',
    name: 'Cerveza IPA Artesanal',
    description: 'Pinta tirada de canilla local.',
    price: 4500,
    category: 'bebidas',
    subcategory: 'Cervezas',
  },
  {
    id: 'b6',
    name: 'Malbec Reserva - Bodega León',
    description: 'Vino tinto de cuerpo medio con notas a frutos rojos maduros.',
    price: 18500,
    category: 'bebidas',
    subcategory: 'Vinos & Espumantes',
  },

  // ================= SIN TACC =================
  {
    id: 'st1',
    name: 'Avocado Toast Sin TACC',
    description: 'Pan de semillas sin gluten, palta, huevo poché y sésamo.',
    price: 6500,
    category: 'sintacc',
    subcategory: 'Cafetería & Salados',
    isGlutenFree: true,
  },
  {
    id: 'st2',
    name: 'Brownie Sin TACC con Helado',
    description: 'Brownie de chocolate intenso apto celíacos con helado de vainilla.',
    price: 5800,
    category: 'sintacc',
    subcategory: 'Pastelería & Dulces',
    isGlutenFree: true,
  },
  {
    id: 'st3',
    name: 'Risotto de Hongos',
    description: 'Arroz Carnaroli cremoso con variedad de hongos y parmesano.',
    price: 23500,
    category: 'sintacc',
    subcategory: 'Platos Elaborados',
    isGlutenFree: true,
  },
];