import { getActiveTest } from '@japa/runner'
import { join } from 'node:path'
import { Database } from '@adonisjs/lucid/database'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { defineConfig as defineLucidConfig } from '@adonisjs/lucid'

export async function setupApp() {
  const test = getActiveTest()
  if (!test) throw new Error('Cannot use "setupApp" outside of a Japa test')

  const { fs } = test.context
  fs.mkdir(fs.basePath, { recursive: true })

  const ignitor = new IgnitorFactory()
    .withCoreProviders()
    .withCoreConfig()
    .merge({
      config: {
        database: defineLucidConfig({
          connection: 'sqlite',
          connections: {
            sqlite: {
              client: 'sqlite3',
              connection: { filename: join(fs.basePath, 'db.sqlite3') },
              useNullAsDefault: true,
            },
          },
        }),
      },
      rcFileContents: {
        providers: [() => import('@adonisjs/lucid/database_provider')],
      },
    })
    .create(fs.baseUrl)

  const app = ignitor.createApp('web')
  test.cleanup(() => app.terminate())
  await app.init()
  await app.boot()

  const db = await app.container.make('lucid.db')
  const emitter = await app.container.make('emitter')

  return { app, db, emitter }
}

export async function resetTables(db: Database) {
  const test = getActiveTest()
  if (!test) throw new Error('Cannot use "createTables" outside of a Japa test')

  test.cleanup(async () => {
    await db.connection().schema.dropTableIfExists('users')
    await db.connection().schema.dropTableIfExists('books')
    await db.connection().schema.dropTableIfExists('movies')
    await db.connection().schema.dropTableIfExists('audits')
  })

  await db.connection().schema.createTable('users', (table) => {
    table.increments('id').notNullable()
    table.string('name').unique().notNullable()
    table.timestamps()
  })

  await db.connection().schema.createTable('books', (table) => {
    table.increments('id').notNullable()
    table.string('name').unique().notNullable()
    table.timestamps()
  })

  await db.connection().schema.createTable('movies', (table) => {
    table.increments('id').notNullable()
    table.string('name').unique().notNullable()
    table.timestamps()
  })

  await db.connection().schema.createTable('audits', (table) => {
    table.increments('id').notNullable()

    table.text('user_type').notNullable()
    table.integer('user_id').notNullable()

    table.text('event').notNullable()

    table.text('auditable_type').notNullable()
    table.integer('auditable_id').notNullable()

    table.jsonb('old_values').nullable()
    table.jsonb('new_values').nullable()

    table.jsonb('metadata').nullable()

    table.timestamp('created_at')
    table.timestamp('updated_at')
  })
}
