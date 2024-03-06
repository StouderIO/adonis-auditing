import type { AuditingConfig, ResolvedAuditingConfig } from './types.js'
import { ConfigProvider } from '@adonisjs/core/types'
import { configProvider } from '@adonisjs/core'

export function defineConfig(config: AuditingConfig): ConfigProvider<ResolvedAuditingConfig> {
  return configProvider.create(async (_app) => {
    const userResolver = await config.userResolver()
    const resolversMap = await Promise.all(
      Object.entries(config.resolvers).map(async ([key, value]) => {
        const resolver = await value()
        return [key, new resolver.default()] as const
      })
    )
    return {
      userResolver: new userResolver.default(),
      resolvers: Object.fromEntries(resolversMap),
    }
  })
}
