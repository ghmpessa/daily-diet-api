import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

describe('Users', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should create a new meal', async () => {
    const user = await request(app.server).post('/users').send({
      name: 'username',
      avatarUrl: ''
    })

    const cookie = user.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie!)
      .send({
        title: 'Bacon Duplo',
        description: 'Bacon Duplo do Aconchego da gula',
        date: new Date(Date.now()).toISOString(),
        isInsideTheDiet: false,
      })
      .expect(201)
  })
})