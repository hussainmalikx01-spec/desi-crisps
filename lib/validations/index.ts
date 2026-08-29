import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  line: z.enum(["CHIPS", "NIMKO"]),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().positive().max(1_000_000),
  salePrice: z.coerce.number().positive().max(1_000_000).optional().nullable(),
  featured: z.coerce.boolean().optional(),
  weightGrams: z.coerce.number().int().positive().optional(),
  stock: z.coerce.number().int().min(0),
  status: z.enum(["PUBLISHED", "COMING_SOON", "OUT_OF_STOCK", "DRAFT"]),
  ingredients: z.string().max(1000).optional(),
  nutrition: z.string().max(1000).optional(),
  images: z.array(z.object({ url: z.string().url() })).optional(),
});

export const checkoutSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z
    .string()
    .regex(/^(\+92|0)?3\d{9}$/, "Enter a valid Pakistani mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(10).max(500),
  city: z.string().min(2).max(100),
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().positive().max(50),
      })
    )
    .min(1, "Cart cannot be empty"),
});

export const reviewSchema = z.object({
  productId: z.string().optional(),
  customerName: z.string().min(2).max(80),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const siteSettingsSchema = z.object({
  logoUrl: z.string().max(500).optional().or(z.literal("")),
  heroImageUrl: z.string().max(500).optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(30).optional(),
  whatsappNumber: z.string().max(30).optional(),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  tiktokUrl: z.string().url().optional().or(z.literal("")),
  bannerText: z.string().max(300).optional(),
  footerText: z.string().max(300).optional(),
  freeDeliveryThreshold: z.coerce.number().int().min(0).max(1_000_000).optional(),
  standardShippingFee: z.coerce.number().int().min(0).max(100_000).optional(),
  faqItems: z
    .array(z.object({ question: z.string().min(1).max(300), answer: z.string().min(1).max(2000) }))
    .max(50)
    .optional(),
});

export const storyStageSchema = z.object({
  line: z.enum(["CHIPS", "NIMKO"]),
  sortOrder: z.coerce.number().int().min(0).max(1000),
  label: z.string().min(1).max(80),
  caption: z.string().min(1).max(200),
  imageUrl: z.string().min(1).max(500),
  active: z.coerce.boolean().optional(),
});

export const deliveryCitySchema = z.object({
  name: z.string().min(2).max(100),
  active: z.coerce.boolean().optional(),
  deliveryFee: z.coerce.number().int().min(0).max(100_000).optional().nullable(),
});

export const brandStoryMilestoneSchema = z.object({
  sortOrder: z.coerce.number().int().min(0).max(1000),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(1000),
  imageUrl: z.string().min(1).max(500),
  yearLabel: z.string().max(40).optional().nullable(),
  active: z.coerce.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
