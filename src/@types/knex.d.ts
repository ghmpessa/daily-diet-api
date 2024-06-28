import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      avatar_url?: string
    }

    meals: {
      id: string
      title: string
      description: string
      date: string
      is_inside_the_diet: boolean
      user_id: string
    }
  }
}
