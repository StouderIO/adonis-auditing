import { ApplicationService } from '@adonisjs/core/types'
import { RuntimeException } from '@poppinss/utils'

import { AuditingConfig, AuditingService, ResolvedAuditingConfig } from '../src/types.js'
import { configProvider } from '@adonisjs/core'
import AuditingManager from '../src/manager.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'auditing.manager': AuditingService
  }
}
export default class AuditingProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('auditing.manager', async () => {
      const auditingConfig = this.app.config.get<AuditingConfig>('auditing')
      const config = await configProvider.resolve<ResolvedAuditingConfig>(this.app, auditingConfig)

      if (!config) {
        throw new RuntimeException(
          'Invalid config exported from "config/auditing.ts" file. Make sure to use the defineConfig method'
        )
      }

      const logger = await this.app.container.make('logger')

      return new AuditingManager(config, logger)
    })
  }
}
