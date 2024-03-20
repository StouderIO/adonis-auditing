# Getting audits

`Audit` instance can be fetched very easily thanks to the `Auditable` mixin.

## Retrieving audits
Using a `Book` model as an example, here is how it works:
```typescript
// Get the first available book
const book = await Book.firstOrFail()

// Get all associated audits
const audits = await book.audits()

// Get the first audit
const first = await book.audits().first()

// Get the last audit
const last = await book.audits().last()
```

## Audit model
The `Audit` model is a Lucid model that represents the audit table. It has the following columns:

- `id`: The unique identifier of the audit.
- `auditableId`: The identifier of the audited model.
- `auditableType`: The type of the audited model.
- `event`: The event that triggered the audit.
- `oldValues`: The old values of the audited model.
- `newValues`: The new values of the audited model.
- `metadata`: Resolved metadata.
- `createdAt`: The date and time when the audit was created.
- `updatedAt`: The date and time when the audit was last updated.
