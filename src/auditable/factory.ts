import { EmitterService } from '@adonisjs/core/types'
import {
  afterCreate,
  afterDelete,
  afterUpdate,
  BaseModel,
  beforeCreate,
  beforeDelete,
  beforeUpdate,
} from '@adonisjs/lucid/orm'
import Audit from '../audit.js'
import {
  E_AUDITABLE_CANNOT_REVERT,
  E_AUDITABLE_INCOMPATIBLE_ATTRIBUTES,
  E_AUDITABLE_LOAD_NULL,
  E_AUDITABLE_WRONG_INSTANCE,
  E_AUDITABLE_WRONG_TYPE,
} from '../errors.js'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { NormalizeConstructor } from '../utils/normalized_constructor.js'
import { EventType } from './events.js'
import type { AuditingService } from '../types.js'

export interface AuditsCursor extends Promise<Audit[]> {
  first: () => Promise<Audit | null>
  last: () => Promise<Audit | null>
}

export function withAuditable() {
  return <T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) => {
    class ModelWithAudit extends superclass {
      static innerEmitter: EmitterService
      static innerAuditing: AuditingService

      audits() {
        const audits = Audit.query()
          .where('auditableType', this.constructor.name)
          .where('auditableId', (this as any).id)
        const promise = Promise.resolve(audits.clone())
        Object.defineProperty(promise, 'first', {
          value: async function () {
            return audits.clone().first()
          },
        }).catch((e) => console.error(e))

        Object.defineProperty(promise, 'last', {
          value: async function () {
            return audits.clone().orderBy('id', 'desc').first()
          },
        }).catch((e) => console.error(e))

        return promise as AuditsCursor
      }

      transitionTo(audit: Audit, valuesType: 'old' | 'new') {
        if (audit.auditableType !== this.constructor.name) {
          throw new E_AUDITABLE_WRONG_TYPE([this.constructor.name, audit.auditableType])
        }

        if (audit.auditableId !== (this as any).id) {
          throw new E_AUDITABLE_WRONG_INSTANCE([(this as any).id, '' + audit.auditableId])
        }

        const values = valuesType === 'old' ? audit.oldValues : audit.newValues
        if (values === null) {
          throw new E_AUDITABLE_LOAD_NULL([valuesType])
        }

        // Key incompatibilities
        const incompatibilities = Object.keys(values).filter(
          (element) => !Object.keys(this.$attributes).includes(element)
        )
        if (incompatibilities.length > 0) {
          throw new E_AUDITABLE_INCOMPATIBLE_ATTRIBUTES([
            incompatibilities[0],
            audit.auditableType,
            incompatibilities[0],
          ])
        }

        for (const key in values) {
          this.$attributes[key] = values[key]
        }
      }

      async revert() {
        const lastAudit = await this.audits().last()
        if (lastAudit === null) {
          throw new E_AUDITABLE_CANNOT_REVERT()
        }
        this.transitionTo(lastAudit, 'old')
      }

      $auditValuesToSave: ModelObject = {}

      $backupAuditValues() {
        this.$auditValuesToSave = this.$original
      }

      async $audit(event: EventType, modelInstance: ModelWithAudit) {
        await ModelWithAudit.#init()
        const auditedUser = await ModelWithAudit.innerAuditing.getUserForContext()
        const metadata = await ModelWithAudit.innerAuditing.getMetadataForContext()

        const audit = new Audit()
        audit.userType = auditedUser?.type ?? null
        audit.userId = auditedUser?.id ?? null
        audit.event = event
        audit.auditableType = modelInstance.constructor.name
        audit.auditableId = (modelInstance as any).id
        audit.oldValues = event === 'create' ? null : this.$auditValuesToSave
        audit.newValues = event === 'delete' ? null : this.$attributes
        audit.metadata = metadata
        await audit.save()

        await ModelWithAudit.innerEmitter.emit(`audit:${event}`, audit.id)
      }

      static async #init() {
        if (ModelWithAudit.innerEmitter && ModelWithAudit.innerAuditing) {
          return
        }
        ModelWithAudit.innerEmitter = await import('@adonisjs/core/services/emitter').then(
          (m) => m.default
        )
        ModelWithAudit.innerAuditing = await import('../../services/auditing.js').then(
          (m) => m.default
        )
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
}
