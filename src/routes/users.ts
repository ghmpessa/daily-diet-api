import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/', async (req, res) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      avatarUrl: z.string().optional()
    })

    const { name, avatarUrl } = createUserBodySchema.parse(req.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      avatar_url: avatarUrl
    })

    return res.status(201).send()
  })
}