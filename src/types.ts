import { HttpContext } from '@adonisjs/core/http'

export interface UserResolver {
  resolve(ctx: HttpContext): Promise<{ id: string; type: string } | null>
}

export interface Resolver {
  resolve(ctx: HttpContext): Promise<unknown>
}

export interface AuditingConfig {
  userResolver: () => Promise<{ default: new () => UserResolver }>
  resolvers: Record<string, () => Promise<{ default: new () => Resolver }>>
}

export interface ResolvedAuditingConfig {
  userResolver: UserResolver
  resolvers: Record<string, Resolver>
}

export interface AuditingService {
  getUserForContext(): Promise<{ id: string; type: string } | null>
  getMetadataForContext(): Promise<Record<string, unknown>>
}
