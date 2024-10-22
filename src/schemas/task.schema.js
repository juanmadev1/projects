import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string({
      required_error: "Title is required",
  }),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
  imageUrl: z.string().url().optional(), // Añadir campo para la URL de la imagen
});
