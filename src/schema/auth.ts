import z from "zod";

export const LoginRes = z
  .object({
    accessToken: z.string(),
  })
  .strict();

export type LoginResType = z.TypeOf<typeof LoginRes>;
