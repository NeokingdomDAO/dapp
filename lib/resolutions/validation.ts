import { z } from "zod";

export const ResolutionData = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});
