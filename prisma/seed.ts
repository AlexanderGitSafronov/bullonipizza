import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Categories
  const pizza = await prisma.category.upsert({
    where: { slug: "pizza" },
    update: {},
    create: {
      slug: "pizza",
      nameUk: "Піца",
      nameEn: "Pizza",
      nameRu: "Пицца",
      icon: "🍕",
      order: 1,
    },
  });
  const drinks = await prisma.category.upsert({
    where: { slug: "drinks" },
    update: {},
    create: {
      slug: "drinks",
      nameUk: "Напої",
      nameEn: "Drinks",
      nameRu: "Напитки",
      icon: "🥤",
      order: 2,
    },
  });
  const desserts = await prisma.category.upsert({
    where: { slug: "desserts" },
    update: {},
    create: {
      slug: "desserts",
      nameUk: "Десерти",
      nameEn: "Desserts",
      nameRu: "Десерты",
      icon: "🍰",
      order: 3,
    },
  });
  const sauces = await prisma.category.upsert({
    where: { slug: "sauces" },
    update: {},
    create: {
      slug: "sauces",
      nameUk: "Соуси",
      nameEn: "Sauces",
      nameRu: "Соусы",
      icon: "🥫",
      order: 4,
    },
  });

  const pizzas = [
    {
      slug: "margherita",
      nameUk: "Маргарита",
      nameEn: "Margherita",
      nameRu: "Маргарита",
      descUk: "Класична: моцарела, базилік, томатний соус",
      descEn: "Classic: mozzarella, basil, tomato sauce",
      descRu: "Классика: моцарелла, базилик, томатный соус",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
      basePrice: 189,
      isPopular: true,
    },
    {
      slug: "pepperoni",
      nameUk: "Пепероні",
      nameEn: "Pepperoni",
      nameRu: "Пепперони",
      descUk: "Гостра салямі, моцарела, томатний соус",
      descEn: "Spicy salami, mozzarella, tomato sauce",
      descRu: "Острая салями, моцарелла, томатный соус",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
      basePrice: 229,
      isPopular: true,
      discount: 10,
    },
    {
      slug: "quattro-formaggi",
      nameUk: "Чотири сири",
      nameEn: "Quattro Formaggi",
      nameRu: "Четыре сыра",
      descUk: "Моцарела, горгондзола, пармезан, чеддер",
      descEn: "Mozzarella, gorgonzola, parmesan, cheddar",
      descRu: "Моцарелла, горгонзола, пармезан, чеддер",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
      basePrice: 259,
      isPopular: true,
    },
    {
      slug: "prosciutto",
      nameUk: "Прошуто",
      nameEn: "Prosciutto",
      nameRu: "Прошутто",
      descUk: "В'ялена шинка, руккола, пармезан",
      descEn: "Cured ham, arugula, parmesan",
      descRu: "Вяленая ветчина, руккола, пармезан",
      image:
        "https://images.unsplash.com/photo-1593504049359-74330189a345?w=800",
      basePrice: 279,
    },
    {
      slug: "diavola",
      nameUk: "Дьявола",
      nameEn: "Diavola",
      nameRu: "Дьявола",
      descUk: "Пікантна салямі, чилі, моцарела",
      descEn: "Spicy salami, chili, mozzarella",
      descRu: "Пикантная салями, чили, моцарелла",
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
      basePrice: 239,
      isPopular: true,
    },
    {
      slug: "vegetariana",
      nameUk: "Вегетаріана",
      nameEn: "Vegetariana",
      nameRu: "Вегетариана",
      descUk: "Перець, гриби, оливки, моцарела",
      descEn: "Bell pepper, mushrooms, olives, mozzarella",
      descRu: "Перец, грибы, оливки, моцарелла",
      image:
        "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800",
      basePrice: 219,
    },
  ];

  for (const p of pizzas) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, categoryId: pizza.id, hasSize: true, hasCrust: true },
    });
  }

  const drinkItems = [
    {
      slug: "cola",
      nameUk: "Кока-Кола",
      nameEn: "Coca-Cola",
      nameRu: "Кока-Кола",
      descUk: "0,5 л",
      descEn: "0.5 L",
      descRu: "0,5 л",
      image:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800",
      basePrice: 45,
    },
    {
      slug: "fresh-orange",
      nameUk: "Свіжий апельсин",
      nameEn: "Fresh Orange",
      nameRu: "Свежий апельсин",
      descUk: "300 мл, тільки що віджатий",
      descEn: "300 ml, freshly squeezed",
      descRu: "300 мл, свежевыжатый",
      image:
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800",
      basePrice: 89,
    },
    {
      slug: "espresso",
      nameUk: "Еспресо",
      nameEn: "Espresso",
      nameRu: "Эспрессо",
      descUk: "Італійський класичний",
      descEn: "Italian classic",
      descRu: "Итальянский классический",
      image:
        "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800",
      basePrice: 55,
    },
  ];

  for (const d of drinkItems) {
    await prisma.product.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        ...d,
        categoryId: drinks.id,
        hasSize: false,
        hasCrust: false,
      },
    });
  }

  const dessertItems = [
    {
      slug: "tiramisu",
      nameUk: "Тірамісу",
      nameEn: "Tiramisu",
      nameRu: "Тирамису",
      descUk: "Класичний італійський десерт з маскарпоне",
      descEn: "Classic Italian dessert with mascarpone",
      descRu: "Классический итальянский десерт с маскарпоне",
      image:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800",
      basePrice: 129,
      isPopular: true,
    },
    {
      slug: "cannoli",
      nameUk: "Канолі",
      nameEn: "Cannoli",
      nameRu: "Канноли",
      descUk: "Сицилійський десерт з рікотою",
      descEn: "Sicilian dessert with ricotta",
      descRu: "Сицилийский десерт с рикоттой",
      image:
        "https://images.unsplash.com/photo-1626803775151-61d756612f97?w=800",
      basePrice: 99,
    },
  ];

  for (const d of dessertItems) {
    await prisma.product.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        ...d,
        categoryId: desserts.id,
        hasSize: false,
        hasCrust: false,
      },
    });
  }

  const sauceItems = [
    {
      slug: "garlic-sauce",
      nameUk: "Часниковий",
      nameEn: "Garlic",
      nameRu: "Чесночный",
      descUk: "Сметанна основа з часником",
      descEn: "Sour cream base with garlic",
      descRu: "Сметанная основа с чесноком",
      image:
        "https://images.unsplash.com/photo-1620708486323-3b6e9d04c9c2?w=800",
      basePrice: 25,
    },
    {
      slug: "bbq-sauce",
      nameUk: "BBQ",
      nameEn: "BBQ",
      nameRu: "BBQ",
      descUk: "Димний барбекю",
      descEn: "Smoky barbecue",
      descRu: "Дымный барбекю",
      image:
        "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800",
      basePrice: 25,
    },
  ];

  for (const s of sauceItems) {
    await prisma.product.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        ...s,
        categoryId: sauces.id,
        hasSize: false,
        hasCrust: false,
      },
    });
  }

  console.log("✅ Seeded BulloniPizza");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
