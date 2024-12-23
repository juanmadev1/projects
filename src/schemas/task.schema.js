import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string({
      required_error: "Title is required",
  }),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
  image: z.string().url().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
