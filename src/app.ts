import fastify from 'fastify'
import { usersRoutes, mealsRoute } from './routes'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)
app.register(mealsRoute, {
  prefix: 'meals'
})
app.register(usersRoutes, {
  prefix: 'users'
})