import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { ModelObject } from '@adonisjs/lucid/types/model'

export default class Audit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userType: string

  @column()
  declare userId: string

  @column()
  declare event: 'create' | 'update' | 'delete'

  @column()
  declare auditableType: string

  @column()
  declare auditableId: number

  @column({
    consume: (value) => (value ? JSON.parse(value) : null),
    prepare: (value) => (value ? JSON.stringify(value.toObject()) : null),
    serialize: (value) => (value ? value.toObject() : null),
  })
  declare oldValues: ModelObject | null

  @column({
    consume: (value) => (value ? JSON.parse(value) : null),
    prepare: (value) => (value ? JSON.stringify(value.toObject()) : null),
    serialize: (value) => (value ? value.toObject() : null),
  })
  declare newValues: ModelObject | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
