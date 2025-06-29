import { z } from 'zod'

const jokeRatingSchema = z.coerce.number().int().min(0).max(5)

export const jokeSchema = z.object({
  id: z.string().nanoid(),
  type: z.enum(['general', 'knock-knock', 'programming', 'dad']),
  setup: z.string(),
  punchline: z.string(),
  rating: jokeRatingSchema.optional(),
})

export type Joke = z.infer<typeof jokeSchema>

export const jokeByIdParamsSchema = jokeSchema.pick({
  id: true,
})

export type JokeByIdParams = z.infer<typeof jokeByIdParamsSchema>

export const jokeUpdateSchema = jokeSchema.omit({ id: true }).partial()

export type JokeUpdatePayload = z.infer<typeof jokeUpdateSchema>

export const jokeCreateSchema = jokeSchema.omit({ id: true }).omit({
  rating: true,
})

export type JokeCreatePayload = z.infer<typeof jokeCreateSchema>
