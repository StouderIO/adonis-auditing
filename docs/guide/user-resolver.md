# User Resolver

An user resolver is a class that implements `UserResolver` interface.

The user resolver must expose a `resolve` method that takes an [HttpContext](https://docs.adonisjs.com/guides/http-context) instance and returns a `Promise` of either `{ id: string; type: string }` or `null`.

When an audit is created, the package will call the user resolver's `resolve` method and store it as `auditableId` and `auditableType` metadata of the audit.

## Register a custom user resolver
To register a custom user resolver, you must add it to the `userResolver` field `config/auditing.ts` file.
Please refer to the [General Configuration](/guide/general-configuration.html#user-resolver) section for more information.

