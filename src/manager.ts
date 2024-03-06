import { AuditingService, ResolvedAuditingConfig } from './types.js'
import { HttpContext } from '@adonisjs/core/http'
import { LoggerService } from '@adonisjs/core/types'

export default class AuditingManager implements AuditingService {
  constructor(
    protected config: ResolvedAuditingConfig,
    protected logger: LoggerService
  ) {}

  async getUserForContext(): Promise<{ id: string; type: string } | null> {
    const ctx = HttpContext.get()
    if (!ctx) {
      return null
    }

    return this.config.userResolver.resolve(ctx)
  }

  async getMetadataForContext(): Promise<Record<string, unknown>> {
    const ctx = HttpContext.get()
    if (!ctx) {
      return {}
    }

    const promiseResults = await Promise.allSettled(
      Object.entries(this.config.resolvers).map(
        async ([key, resolver]) => [key, await resolver.resolve(ctx)] as const
      )
    )

    return Object.fromEntries(
      promiseResults
        .map((result) => {
          if (result.status === 'fulfilled') {
            return result.value
          }

          this.logger.warn('Failed to resolve auditing metadata', result.reason)
          return null
        })
        .filter((value) => value !== null) as [string, unknown][]
    )
  }
}
