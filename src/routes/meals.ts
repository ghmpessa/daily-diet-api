import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export const mealsRoute = async (app: FastifyInstance) => {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists]
    },
    async (req, res) => {
      const { sessionId } = req.cookies

      const mealsSchema = z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().datetime(),
        isInsideTheDiet: z.boolean()
      })

      const { title, description, date, isInsideTheDiet } = mealsSchema.parse(req.body)

      await knex('meals').insert({
        id: randomUUID(),
        title,
        description,
        date,
        is_inside_the_diet: isInsideTheDiet,
        user_id: sessionId
      })

      res.status(201).send()
    })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists]
    },
    async (req, res) => {
      const { sessionId } = req.cookies

      const meals = await knex('meals')
        .select()
        .where('user_id', sessionId)

      return res.status(200).send({ meals })
    })
}