import emitter from '@adonisjs/core/services/emitter'
import db from '@adonisjs/lucid/services/db'
import auditing from '../../services/auditing.js'

import { withAuditable } from './factory.js'

const Auditable = withAuditable(db, emitter, auditing)
export default Auditable

export type IAuditable = InstanceType<ReturnType<typeof Auditable>>
