import { z } from "zod";

export const publishStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const projectSectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("field"),
    label: z.string().min(1),
    value: z.string().min(1),
    stacked: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("list"),
    label: z.string().min(1),
    intro: z.string().optional(),
    items: z.array(z.string().min(1)).min(1),
  }),
]);

export const projectInputSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1),
  dateLabel: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  sections: z.array(projectSectionSchema).default([]),
  heroImage: z.string().optional().nullable(),
  introImage: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: publishStatusSchema.default("DRAFT"),
});

export const trainingInputSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1),
  dateLabel: z.string().optional().nullable(),
  meta: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  status: publishStatusSchema.default("DRAFT"),
});

export const blogInputSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  authorName: z.string().optional().nullable(),
  status: publishStatusSchema.default("DRAFT"),
});

export const inviteInputSchema = z.object({
  email: z.string().email(),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(10),
  name: z.string().min(1).optional(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
