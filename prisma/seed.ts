import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CHIPS_PROCESS, NIMKO_PROCESS } from "../lib/story-data";

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: "Salty",
    slug: "salty",
    description:
      "Our original — thin-cut potato crisps fried golden and finished with a clean, honest layer of sea salt. No frills, just the taste of a really good potato.",
    price: 120,
    weightGrams: 60,
    stock: 100,
    featured: true,
    ingredients: "Potatoes, vegetable oil, sea salt",
  },
  {
    name: "Chatpata",
    slug: "chatpata",
    description:
      "A tangy, spiced blend inspired by the flavors of a Karachi street stall — sour, spicy, and a little addictive.",
    price: 130,
    weightGrams: 60,
    stock: 100,
    featured: true,
    ingredients: "Potatoes, vegetable oil, chatpata spice mix (chili, amchur, salt, spices)",
  },
  {
    name: "Crunch",
    slug: "crunch",
    description:
      "Cut thicker and fried a little longer for an extra-deep crunch. For people who take their chips seriously.",
    price: 130,
    weightGrams: 65,
    stock: 100,
    featured: true,
    ingredients: "Potatoes, vegetable oil, salt",
  },
  {
    name: "Wavy",
    slug: "wavy",
    description:
      "Ridged and rippled to hold more seasoning in every bite, with a heartier crunch than our classic cut.",
    price: 130,
    weightGrams: 60,
    stock: 100,
    featured: false,
    ingredients: "Potatoes, vegetable oil, seasoning blend",
  },
  {
    name: "Classic Sticks",
    slug: "classic-sticks",
    description:
      "Golden potato sticks, lightly salted — an easy, everyday snack that goes with everything.",
    price: 110,
    weightGrams: 50,
    stock: 100,
    featured: false,
    ingredients: "Potatoes, vegetable oil, salt",
  },
];

async function main() {
  console.log("Seeding database...");

  // 1. Create the default admin account.
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@desicrisps.pk";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: "Desi Crisps Admin" },
  });
  console.log(`Admin created: ${adminEmail} (password: ${adminPassword}) — CHANGE THIS AFTER FIRST LOGIN`);

  // 2. Create the initial Chips products, all published with placeholder images.
  // Note: per the current brand direction there are 5 active Chips products;
  // "Spicy Sticks" is intentionally left out here — re-add it any time from
  // the admin panel (Products → Add Product) if you want a 6th flavor live.
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        line: "CHIPS",
        status: "PUBLISHED",
        images: {
          create: [{ url: "/assets/story/chips-v2/07-final-packet.svg", altText: `${product.name} packet`, sortOrder: 0 }],
        },
      },
    });
  }
  console.log(`Seeded ${PRODUCTS.length} products.`);

  // 3. Default site settings.
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      logoUrl: "/assets/logo/desi-crisps-logo.png",
      contactEmail: "hello@desicrisps.pk",
      contactPhone: "+92 300 0000000",
      whatsappNumber: "+923000000000",
      instagramUrl: "https://instagram.com/desicrisps",
      facebookUrl: "https://facebook.com/desicrisps",
      bannerText: "Free delivery on orders above Rs. 1500",
      footerText: "Desi Crisps — farm-fresh snacks, made the honest way.",
      freeDeliveryThreshold: 1500,
      standardShippingFee: 150,
    },
  });
  console.log("Site settings created.");

  // 4. Delivery cities — Lahore active by default, matching current
  // brand direction. Add more anytime from Admin → Delivery Cities.
  await prisma.deliveryCity.upsert({
    where: { name: "Lahore" },
    update: {},
    create: { name: "Lahore", active: true, deliveryFee: 150 },
  });
  console.log("Delivery cities seeded.");

  // 5. Story stages — the potato-to-packet and nimko journeys, seeded from
  // the built-in defaults so the admin has something to edit immediately
  // rather than starting from a blank list.
  for (const [index, stage] of CHIPS_PROCESS.entries()) {
    await prisma.storyStage.upsert({
      where: { id: `seed-chips-${index}` },
      update: {},
      create: {
        id: `seed-chips-${index}`,
        line: "CHIPS",
        sortOrder: index,
        label: stage.label,
        caption: stage.caption,
        imageUrl: stage.icon,
        active: true,
      },
    });
  }
  for (const [index, stage] of NIMKO_PROCESS.entries()) {
    await prisma.storyStage.upsert({
      where: { id: `seed-nimko-${index}` },
      update: {},
      create: {
        id: `seed-nimko-${index}`,
        line: "NIMKO",
        sortOrder: index,
        label: stage.label,
        caption: stage.caption,
        imageUrl: stage.icon,
        active: true,
      },
    });
  }
  console.log("Story stages seeded.");

  // 6. Brand story timeline — a starting point; edit freely from
  // Admin → Our Story Timeline.
  const milestones = [
    {
      id: "seed-milestone-0",
      sortOrder: 0,
      title: "Started in a family kitchen",
      description:
        "Desi Crisps began the way most honest things do — with a potato, a knife, and a recipe passed down more by taste than by measurement.",
      imageUrl: "/assets/logo/desi-crisps-logo.png",
      yearLabel: "The Beginning",
    },
    {
      id: "seed-milestone-1",
      sortOrder: 1,
      title: "From countryside tradition to daily ritual",
      description:
        "What started as a family tradition grew into a promise we keep in every packet: real ingredients, real care, nothing hidden.",
      imageUrl: "/assets/story/chips-v2/01-fresh-potato.svg",
      yearLabel: "Growing Up",
    },
    {
      id: "seed-milestone-2",
      sortOrder: 2,
      title: "Quality you can trust",
      description:
        "Today, every batch is still fried in small, controlled batches — because consistency and honesty matter more to us than shortcuts.",
      imageUrl: "/assets/story/chips-v2/07-final-packet.svg",
      yearLabel: "Today",
    },
  ];
  for (const milestone of milestones) {
    await prisma.brandStoryMilestone.upsert({
      where: { id: milestone.id },
      update: {},
      create: { ...milestone, active: true },
    });
  }
  console.log("Brand story timeline seeded.");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
