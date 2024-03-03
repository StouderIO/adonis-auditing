import {
  afterCreate,
  afterDelete,
  afterUpdate,
  BaseModel,
  beforeCreate,
  beforeDelete,
  beforeUpdate,
  hasMany,
} from '@adonisjs/lucid/orm'
import db from '@adonisjs/lucid/services/db'
import emitter from '@adonisjs/core/services/emitter'
import { ModelObject } from '@adonisjs/lucid/types/model'
import Audit from './audit.js'
import { HasMany } from '@adonisjs/lucid/types/relations'

type EventType = 'create' | 'update' | 'delete'
type AuditEventType = `audit:${EventType}`
type AuditEventsList = {
  [key in AuditEventType]: number
}

declare module '@adonisjs/core/types' {
  interface EventsList extends AuditEventsList {}
}

export type Constructor = new (...args: any[]) => any
export type NormalizeConstructor<T extends Constructor> = {
  new (...args: any[]): InstanceType<T>
} & Omit<T, 'constructor'>

export const Auditable = <T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) => {
  class ModelWithAudit extends superclass {
    @hasMany(() => Audit, {
      foreignKey: 'auditableId',
      onQuery(query) {
        query.where('auditable_type', (this as any).model.name)
      },
    })
    declare audits: HasMany<typeof Audit>

    $auditValuesToSave: ModelObject = {}

    $backupAuditValues() {
      this.$auditValuesToSave = this.$original
    }

    async $audit(event: EventType, modelInstance: ModelWithAudit) {
      console.log(
        'tables juste après le save, dans le afterSave hook du mixin',
        (await db.query().from('sqlite_schema').where('type', 'table')).map((t) => t.name)
      )
      await db
        .insertQuery()
        .table('audits')
        .insert({
          user_type: 'ut', // FIXME find user type
          user_id: 'ui', // FIXME find user id
          event,
          auditable_type: modelInstance.constructor.name,
          auditable_id: (modelInstance as any).id,
          old_values: event === 'create' ? null : modelInstance.$auditValuesToSave,
          new_values: event === 'delete' ? null : modelInstance.$attributes,
        })
        .returning('id')
      await emitter.emit(`audit:${event}`, (modelInstance as any).id)
    }

    @beforeCreate()
    static async beforeSaveHook(modelInstance: ModelWithAudit) {
      modelInstance.$backupAuditValues()
    }

    @afterCreate()
    static afterSaveHook(modelInstance: ModelWithAudit) {
      return modelInstance.$audit('create', modelInstance)
    }

    @beforeUpdate()
    static async beforeUpdateHook(modelInstance: ModelWithAudit) {
      modelInstance.$backupAuditValues()
    }

    @afterUpdate()
    static afterUpdateHook(modelInstance: ModelWithAudit) {
      return modelInstance.$audit('update', modelInstance)
    }

    @beforeDelete()
    static async beforeDeleteHook(modelInstance: ModelWithAudit) {
      modelInstance.$backupAuditValues()
    }

    @afterDelete()
    static afterDeleteHook(modelInstance: ModelWithAudit) {
      return modelInstance.$audit('delete', modelInstance)
    }
  }

  return ModelWithAudit
}
