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

    const id = randomUUID()

    await knex('users').insert({
      id,
      name,
      avatar_url: avatarUrl
    })

    res.setCookie('sessionId', id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return res.status(201).send()
  })
}