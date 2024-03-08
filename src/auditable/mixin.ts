import emitter from '@adonisjs/core/services/emitter'
import { withAuditable } from './factory.js'
import auditing from '../../services/auditing.js'

const Auditable = withAuditable(emitter, auditing)
export default Auditable

export type IAuditable = InstanceType<ReturnType<typeof Auditable>>
