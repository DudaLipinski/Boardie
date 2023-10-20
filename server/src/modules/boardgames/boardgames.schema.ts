import z from 'zod'

export const boardgameDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  bggId: z.number(),
  year: z.number(),
})

export type BoardgameDTO = z.infer<typeof boardgameDtoSchema>
