import { z } from "zod";

export const simpleEditorSchema = z
  .object({
    input: z.string().min(1, "Content cannot be empty"),
  })
  .transform(({ input }) => input); // transform object to string
