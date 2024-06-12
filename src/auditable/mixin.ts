import { withAuditable } from './factory.js'
const Auditable = withAuditable()
export default Auditable

export type IAuditable = InstanceType<ReturnType<typeof Auditable>>
