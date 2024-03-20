# Model Setup

Setting up the model for auditing is a simple process.
You only need to add the `Auditable` mixin using the `compose` helper to extends the model with the auditing features.

To install the package and all its dependencies, please refer to the [Installation](/guide/installation) section.

```typescript
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@stouder-io/adonis-auditing'

export default class Book extends compose(BaseModel, Auditable) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```
