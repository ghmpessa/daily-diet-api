import { app } from '../../src/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, it } from 'vitest'

describe('Users', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create new user', async () => {
    await request(app.server).post('/users').send({
      name: 'username',
      avatarUrl: ''
    })
      .expect(201)
  })
})