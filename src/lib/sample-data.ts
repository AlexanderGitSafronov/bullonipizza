// Used as a fallback when DB is not configured — keeps the UI fully working.
export type SampleProduct = {
  id: string;
  slug: string;
  nameUk: string;
  nameEn: string;
  nameRu: string;
  descUk: string;
  descEn: string;
  descRu: string;
  image: string;
  basePrice: number;
  categorySlug: string;
  isPopular?: boolean;
  inStock?: boolean;
  hasSize: boolean;
  hasCrust: boolean;
  discount?: number;
};

export const sampleCategories = [
  {
    slug: "pizza",
    nameUk: "Піца",
    nameEn: "Pizza",
    nameRu: "Пицца",
    icon: "🍕",
  },
  {
    slug: "drinks",
    nameUk: "Напої",
    nameEn: "Drinks",
    nameRu: "Напитки",
    icon: "🥤",
  },
  {
    slug: "desserts",
    nameUk: "Десерти",
    nameEn: "Desserts",
    nameRu: "Десерты",
    icon: "🍰",
  },
  {
    slug: "sauces",
    nameUk: "Соуси",
    nameEn: "Sauces",
    nameRu: "Соусы",
    icon: "🥫",
  },
];

export const sampleProducts: SampleProduct[] = [
  {
    id: "1",
    slug: "margherita",
    nameUk: "Маргарита",
    nameEn: "Margherita",
    nameRu: "Маргарита",
    descUk: "Класична: моцарела, базилік, томатний соус",
    descEn: "Classic: mozzarella, basil, tomato sauce",
    descRu: "Классика: моцарелла, базилик, томатный соус",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    basePrice: 189,
    categorySlug: "pizza",
    isPopular: true,
    hasSize: true,
    hasCrust: true,
  },
  {
    id: "2",
    slug: "pepperoni",
    nameUk: "Пепероні",
    nameEn: "Pepperoni",
    nameRu: "Пепперони",
    descUk: "Гостра салямі, моцарела, томатний соус",
    descEn: "Spicy salami, mozzarella, tomato sauce",
    descRu: "Острая салями, моцарелла, томатный соус",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    basePrice: 229,
    categorySlug: "pizza",
    isPopular: true,
    hasSize: true,
    hasCrust: true,
    discount: 10,
  },
  {
    id: "3",
    slug: "quattro-formaggi",
    nameUk: "Чотири сири",
    nameEn: "Quattro Formaggi",
    nameRu: "Четыре сыра",
    descUk: "Моцарела, горгондзола, пармезан, чеддер",
    descEn: "Mozzarella, gorgonzola, parmesan, cheddar",
    descRu: "Моцарелла, горгонзола, пармезан, чеддер",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    basePrice: 259,
    categorySlug: "pizza",
    isPopular: true,
    hasSize: true,
    hasCrust: true,
  },
  {
    id: "4",
    slug: "prosciutto",
    nameUk: "Прошуто",
    nameEn: "Prosciutto",
    nameRu: "Прошутто",
    descUk: "В'ялена шинка, руккола, пармезан",
    descEn: "Cured ham, arugula, parmesan",
    descRu: "Вяленая ветчина, руккола, пармезан",
    image:
      "https://images.unsplash.com/photo-1593504049359-74330189a345?w=800&q=80",
    basePrice: 279,
    categorySlug: "pizza",
    hasSize: true,
    hasCrust: true,
  },
  {
    id: "5",
    slug: "diavola",
    nameUk: "Дьявола",
    nameEn: "Diavola",
    nameRu: "Дьявола",
    descUk: "Пікантна салямі, чилі, моцарела",
    descEn: "Spicy salami, chili, mozzarella",
    descRu: "Пикантная салями, чили, моцарелла",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
    basePrice: 239,
    categorySlug: "pizza",
    isPopular: true,
    hasSize: true,
    hasCrust: true,
  },
  {
    id: "6",
    slug: "vegetariana",
    nameUk: "Вегетаріана",
    nameEn: "Vegetariana",
    nameRu: "Вегетариана",
    descUk: "Перець, гриби, оливки, моцарела",
    descEn: "Bell pepper, mushrooms, olives, mozzarella",
    descRu: "Перец, грибы, оливки, моцарелла",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80",
    basePrice: 219,
    categorySlug: "pizza",
    hasSize: true,
    hasCrust: true,
  },
  {
    id: "7",
    slug: "cola",
    nameUk: "Кока-Кола",
    nameEn: "Coca-Cola",
    nameRu: "Кока-Кола",
    descUk: "0,5 л",
    descEn: "0.5 L",
    descRu: "0,5 л",
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
    basePrice: 45,
    categorySlug: "drinks",
    hasSize: false,
    hasCrust: false,
  },
  {
    id: "8",
    slug: "fresh-orange",
    nameUk: "Свіжий апельсин",
    nameEn: "Fresh Orange",
    nameRu: "Свежий апельсин",
    descUk: "300 мл, тільки що віджатий",
    descEn: "300 ml, freshly squeezed",
    descRu: "300 мл, свежевыжатый",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&q=80",
    basePrice: 89,
    categorySlug: "drinks",
    hasSize: false,
    hasCrust: false,
  },
  {
    id: "9",
    slug: "espresso",
    nameUk: "Еспресо",
    nameEn: "Espresso",
    nameRu: "Эспрессо",
    descUk: "Італійський класичний",
    descEn: "Italian classic",
    descRu: "Итальянский классический",
    image:
      "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&q=80",
    basePrice: 55,
    categorySlug: "drinks",
    hasSize: false,
    hasCrust: false,
  },
  {
    id: "10",
    slug: "tiramisu",
    nameUk: "Тірамісу",
    nameEn: "Tiramisu",
    nameRu: "Тирамису",
    descUk: "Класичний італійський десерт з маскарпоне",
    descEn: "Classic Italian dessert with mascarpone",
    descRu: "Классический итальянский десерт с маскарпоне",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    basePrice: 129,
    categorySlug: "desserts",
    isPopular: true,
    hasSize: false,
    hasCrust: false,
  },
  {
    id: "11",
    slug: "cannoli",
    nameUk: "Канолі",
    nameEn: "Cannoli",
    nameRu: "Канноли",
    descUk: "Сицилійський десерт з рікотою",
    descEn: "Sicilian dessert with ricotta",
    descRu: "Сицилийский десерт с рикоттой",
    image:
      "https://images.unsplash.com/photo-1626803775151-61d756612f97?w=800&q=80",
    basePrice: 99,
    categorySlug: "desserts",
    hasSize: false,
    hasCrust: false,
  },
  {
    id: "12",
    slug: "garlic-sauce",
    nameUk: "Часниковий",
    nameEn: "Garlic",
    nameRu: "Чесночный",
    descUk: "Сметанна основа з часником",
    descEn: "Sour cream base with garlic",
    descRu: "Сметанная основа с чесноком",
    image:
      "https://images.unsplash.com/photo-1620708486323-3b6e9d04c9c2?w=800&q=80",
    basePrice: 25,
    categorySlug: "sauces",
    hasSize: false,
    hasCrust: false,
  },
  {
    id: "13",
    slug: "bbq-sauce",
    nameUk: "BBQ",
    nameEn: "BBQ",
    nameRu: "BBQ",
    descUk: "Димний барбекю",
    descEn: "Smoky barbecue",
    descRu: "Дымный барбекю",
    image:
      "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&q=80",
    basePrice: 25,
    categorySlug: "sauces",
    hasSize: false,
    hasCrust: false,
  },
];
