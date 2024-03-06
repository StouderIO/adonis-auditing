import { createError } from '@poppinss/utils'

export const E_AUDITABLE_WRONG_TYPE = createError<[string, string]>(
  'Expected Auditable type "%s", got "%s" instead.',
  'E_AUDITABLE_WRONG_TYPE',
  500
)

export const E_AUDITABLE_WRONG_INSTANCE = createError<[string, string]>(
  'Expected audit for id %s, got audit for id %s instead.',
  'E_AUDITABLE_WRONG_INSTANCE',
  500
)

export const E_AUDITABLE_INCOMPATIBLE_ATTRIBUTES = createError<[string, string, string]>(
  'Incompatible attributes: Index.%s and %s.%s',
  'E_AUDITABLE_INCOMPATIBLE_ATTRIBUTES',
  500
)

export const E_AUDITABLE_LOAD_NULL = createError<[string]>(
  'Cannot transition to %s values because it is null.',
  'E_AUDITABLE_NULL_VALUES',
  500
)

export const E_AUDITABLE_CANNOT_REVERT = createError(
  'Cannot revert, missing audit.',
  'E_AUDITABLE_CANNOT_REVERT',
  500
)
