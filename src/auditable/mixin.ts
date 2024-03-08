import app from '@adonisjs/core/services/app'
import emitter from '@adonisjs/core/services/emitter'
import db from '@adonisjs/lucid/services/db'
import { withAuditable } from './factory.js'

const Auditable = withAuditable(db, emitter, app)
export default Auditable

export type IAuditable = InstanceType<ReturnType<typeof Auditable>>
