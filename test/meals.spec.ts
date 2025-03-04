import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

const makeSut = async () => {
  const user = await request(app.server).post('/users').send({
    name: 'username',
    avatarUrl: ''
  })

  const cookie = user.get('Set-Cookie')

  return cookie
}

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
    const cookie = await makeSut()

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

  it('should list all user meals', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        name: 'username',
      })

    const cookie = user.get('Set-Cookie')

    const date = new Date(Date.now()).toISOString()

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Bacon Duplo',
        description: 'Bacon Duplo do Aconchego da gula',
        date,
        isInsideTheDiet: false,
      })
      .set('Cookie', cookie!)

    const { body: { meals }, statusCode } = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie!)

    expect(statusCode).toEqual(200)
    expect(meals).toEqual([
      expect.objectContaining({
        title: 'Bacon Duplo',
        description: 'Bacon Duplo do Aconchego da gula',
        date,
      })
    ])
  })

  it('should get a specific meal', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        name: 'username',
      })

    const cookie = user.get('Set-Cookie')

    const date = new Date(Date.now()).toISOString()

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Bacon Duplo',
        description: 'Bacon Duplo do Aconchego da gula',
        date,
        isInsideTheDiet: false,
      })
      .set('Cookie', cookie!)

    const { body: { meals } } = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie!)

    const id = meals[0].id

    const { body: { meal }, statusCode } = await request(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookie!)

    expect(statusCode).toEqual(200)
    expect(meal).toEqual(
      expect.objectContaining({
        title: 'Bacon Duplo',
        description: 'Bacon Duplo do Aconchego da gula',
        date,
      })
    )
  })

  it('should delete a specific meal', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        name: 'username',
      })

    const cookie = user.get('Set-Cookie')

    const date = new Date(Date.now()).toISOString()

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Bacon Duplo',
        description: 'Bacon Duplo do Aconchego da gula',
        date,
        isInsideTheDiet: false,
      })
      .set('Cookie', cookie!)

    const { body } = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie!)

    const id = body.meals[0].id

    const { statusCode } = await request(app.server)
      .delete(`/meals/${id}`)
      .set('Cookie', cookie!)

    const { body: { meals } } = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie!)

    expect(statusCode).toEqual(204)
    expect(meals.length).toEqual(0)
  })

  it('should update a specific meal', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        name: 'username',
      })

    const cookie = user.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Bacon Duplo',
        description: 'Bacon Duplo do Aconchego da gula',
        date: new Date(Date.now()).toISOString(),
        isInsideTheDiet: false,
      })
      .set('Cookie', cookie!)

    const { body } = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie!)

    const id = body.meals[0].id

    const date = new Date().toISOString()

    await request(app.server)
      .put(`/meals/${id}`)
      .send({
        title: 'Arroz com carne moída',
        description: 'Tentando ser saudável',
        date,
        isInsideTheDiet: true,
      })
      .set('Cookie', cookie!)
      .expect(204)

    const { body: { meal } } = await request(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookie!)
      .expect(200)

    expect(meal).toEqual(
      expect.objectContaining({
        title: 'Arroz com carne moída',
        description: 'Tentando ser saudável',
        date,
      })
    )
  })

  it('should return meals summary', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        name: 'username',
      })

    const cookie = user.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Bacon Duplo',
        description: 'Bacon Duplo do Aconchego da gula',
        date: new Date(Date.now()).toISOString(),
        isInsideTheDiet: false,
      })
      .set('Cookie', cookie!)


    await request(app.server)
      .post('/meals')
      .send({
        title: 'Arroz com frango',
        description: 'Saúde',
        date: new Date(Date.now()).toISOString(),
        isInsideTheDiet: true,
      })
      .set('Cookie', cookie!)

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Arroz com carne',
        description: 'Saúde',
        date: new Date(Date.now()).toISOString(),
        isInsideTheDiet: true,
      })
      .set('Cookie', cookie!)

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Whey',
        description: 'Saúde',
        date: new Date(Date.now()).toISOString(),
        isInsideTheDiet: true,
      })
      .set('Cookie', cookie!)

    const { body: { summary } } = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookie!)
      .expect(200)

    expect(summary).toEqual(
      expect.objectContaining({
        totalMeals: 4,
        insideDiet: 3,
        outsideDiet: 1,
        maxStreak: 3,
      })
    )
  })
})