import { test } from '@japa/runner'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { resetTables, setupApp } from '../tests_helpers/helper.js'
import Audit from '../src/audit.js'

test.group('BaseModel with auditable', () => {
  test('create event', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const { withAuditable } = await import('../src/mixin.js')
    const Auditable = withAuditable(db, emitter)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    assert.isUndefined(book.id)
    book.name = 'The Hobbit'
    await book.save()
    assert.isDefined(book.id)

    assert.lengthOf(await book.audits(), 1)
    const audit = await book.audits().first()
    assert.isNotNull(audit)
    assert.equal(audit!.event, 'create')
    assert.equal(audit!.auditableType, 'Book')
    assert.equal(audit!.auditableId, book.id)
    assert.isNull(audit!.oldValues)
    assert.deepEqual(audit!.newValues, { id: book.id, name: 'The Hobbit' })
  })

  test('update event', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const { withAuditable } = await import('../src/mixin.js')
    const Auditable = withAuditable(db, emitter)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    assert.isUndefined(book.id)
    book.name = 'The Hobbit'
    await book.save()

    book.name = 'The Lord of the Rings'
    await book.save()
    assert.isDefined(book.id)

    assert.lengthOf(await book.audits(), 2)
    const audit = await book.audits().last()
    assert.isNotNull(audit)
    assert.equal(audit!.event, 'update')
    assert.equal(audit!.auditableType, 'Book')
    assert.equal(audit!.auditableId, book.id)
    assert.deepEqual(audit!.newValues, { id: book.id, name: 'The Lord of the Rings' })
    assert.deepEqual(audit!.oldValues, { id: book.id, name: 'The Hobbit' })
  })

  test('delete event', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const { withAuditable } = await import('../src/mixin.js')
    const Auditable = withAuditable(db, emitter)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    assert.isUndefined(book.id)
    book.name = 'The Hobbit'
    await book.save()

    await book.delete()

    const audit = await Audit.query()
      .where('auditableType', 'Book')
      .where('auditableId', book.id)
      .orderBy('id', 'desc')
      .firstOrFail()

    assert.equal(audit.event, 'delete')
    assert.equal(audit.auditableType, 'Book')
    assert.equal(audit.auditableId, book.id)
    assert.deepEqual(audit.oldValues, { id: book.id, name: 'The Hobbit' })
    assert.isNull(audit.newValues)
  })

  test('do not audit failed operations', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const { withAuditable } = await import('../src/mixin.js')
    const Auditable = withAuditable(db, emitter)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = null!
    await assert.rejects(book.save)

    const audits = await Audit.query().where('auditableType', 'Book')
    assert.lengthOf(audits, 0)
  })

  test('events are emitted', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const eventStack: string[] = []
    emitter.on('audit:create', () => eventStack.push('create'))
    emitter.on('audit:update', () => eventStack.push('update'))
    emitter.on('audit:delete', () => eventStack.push('delete'))

    const { withAuditable } = await import('../src/mixin.js')
    const Auditable = withAuditable(db, emitter)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = 'The Hobbit'
    await book.save()

    book.name = 'The Lord of the Rings'
    await book.save()

    await book.delete()

    assert.deepEqual(eventStack, ['create', 'update', 'delete'])
  })

  test('transition to wrong types', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const { withAuditable } = await import('../src/mixin.js')
    const Auditable = withAuditable(db, emitter)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    class Movie extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = 'The Hobbit'
    await book.save()
    book.name = 'The Lord of the Rings'
    await book.save()

    const movie = new Movie()
    movie.name = 'The Lord of the Rings'
    await movie.save()

    const firstVersion = await movie.audits().first()
    assert.throws(() => book.transitionTo(firstVersion!, 'old'))
  })

  test('transition to wrong instance', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const { withAuditable } = await import('../src/mixin.js')
    const Auditable = withAuditable(db, emitter)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const bookA = new Book()
    bookA.name = 'The Hobbit'
    await bookA.save()
    bookA.name = 'The Lord of the Rings'
    await bookA.save()

    const bookB = new Book()
    bookB.name = 'Shrek'
    await bookB.save()

    const firstVersion = await bookA.audits().first()
    assert.throws(() => bookB.transitionTo(firstVersion!, 'old'))
  })

  test('transition to null attributes', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const { withAuditable } = await import('../src/mixin.js')
    const Auditable = withAuditable(db, emitter)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = 'The Hobbit'
    await book.save()

    const firstVersion = await book.audits().first()
    assert.throws(() => book.transitionTo(firstVersion!, 'old'))
  })

  test('transition to, audit has more attributes', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const { withAuditable } = await import('../src/mixin.js')
    const Auditable = withAuditable(db, emitter)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = 'The Hobbit'
    await book.save()
    book.name = 'The Lord of the Rings'
    await book.save()

    const firstVersion = await book.audits().first()
    firstVersion!.newValues!.extra = 'extra'
    assert.throws(() => book.transitionTo(firstVersion!, 'new'))
  })

  test('revert an update', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const { withAuditable } = await import('../src/mixin.js')
    const Auditable = withAuditable(db, emitter)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = 'The Hobbit'
    await book.save()
    book.name = 'The Lord of the Rings'
    await book.save()

    await book.revert()
    assert.equal(book.name, 'The Hobbit')
  })
})
