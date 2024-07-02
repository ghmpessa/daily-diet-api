import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export const mealsRoute = async (app: FastifyInstance) => {
  app.addHook('preHandler', checkSessionIdExists)

  app.post(
    '/',
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
    async (req, res) => {
      const { sessionId } = req.cookies

      const meals = await knex('meals')
        .select()
        .where('user_id', sessionId)

      return res.status(200).send({ meals })
    },
  )

  app.get(
    '/:id',
    async (req, res) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid()
      })

      const { id } = getMealsParamsSchema.parse(req.params)

      const { sessionId } = req.cookies

      const meal = await knex('meals')
        .select()
        .where({
          id,
          user_id: sessionId,
        })
        .first()

      return res.status(200).send({ meal })
    },
  )

  app.delete(
    '/:id',
    async (req, res) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid()
      })

      const { id } = getMealsParamsSchema.parse(req.params)

      const { sessionId } = req.cookies

      await knex('meals')
        .delete()
        .where({
          id,
          user_id: sessionId,
        })

      return res.status(204).send()
    },
  )

  app.put(
    '/:id',
    async (req, res) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid()
      })

      const mealsSchema = z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().datetime(),
        isInsideTheDiet: z.boolean()
      })

      const { id } = getMealsParamsSchema.parse(req.params)

      const {
        title,
        description,
        date,
        isInsideTheDiet
      } = mealsSchema.parse(req.body)

      const { sessionId } = req.cookies

      await knex('meals')
        .update({
          title,
          description,
          date,
          is_inside_the_diet: isInsideTheDiet,
        })
        .where({
          id,
          user_id: sessionId,
        })

      return res.status(204).send()
    },
  )
}