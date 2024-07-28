import z from "zod";

export const CoffeeRes = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    ingredients: z.array(z.string()),
    image: z.string(),
  })
  .strict();

export type CoffeeResType = z.TypeOf<typeof CoffeeRes>;
