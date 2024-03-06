export type EventType = 'create' | 'update' | 'delete'
type AuditEventType = `audit:${EventType}`
type AuditEventsList = {
  [key in AuditEventType]: number
}

declare module '@adonisjs/core/types' {
  interface EventsList extends AuditEventsList {}
}
