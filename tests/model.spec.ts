import { test } from '@japa/runner'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { resetTables, setupApp } from '../tests_helpers/helper.js'

test.group('BaseModel with auditable', (group) => {
  test('create event', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)

    const { Auditable } = await import('../src/mixin.js')

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    assert.isUndefined(book.id)
    book.name = 'The Hobbit'
    console.log(
      'tables avant le save',
      (await db.query().from('sqlite_schema').where('type', 'table')).map((t) => t.name)
    )
    await book.save()
    assert.isDefined(book.id)

    await book.load('audits')

    assert.lengthOf(book.audits, 1)
    const audit = book.audits[0]
    assert.equal(audit.event, 'create')
    assert.equal(audit.auditableType, 'Book')
    assert.equal(audit.auditableId, book.id)
    assert.isNull(audit.oldValues)
    assert.deepEqual(audit.newValues, { id: book.id, name: 'The Hobbit' })
  })

  test('create event 2', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)

    const { Auditable } = await import('../src/mixin.js')

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    assert.isUndefined(book.id)
    book.name = 'The Hobbit'

    console.log(
      'tables avant le save',
      (await db.query().from('sqlite_schema').where('type', 'table')).map((t) => t.name)
    )
    await book.save()

    assert.isDefined(book.id)

    assert.equal(1, 1)
  })
})
