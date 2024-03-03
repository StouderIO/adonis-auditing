import { ApplicationService } from '@adonisjs/core/types'

export default class AuditingProvider {
  constructor(protected app: ApplicationService) {}
}
