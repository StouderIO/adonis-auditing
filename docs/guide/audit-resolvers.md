# Audit Resolvers

A resolver is a class that implements `Resolver` interface.

Each resolver must expose a `resolve` method that takes an [HttpContext](https://docs.adonisjs.com/guides/http-context) instance and returns a `Promise` of `unknown`.

When an audit is created, the package will call each resolver's `resolve` method and store the result as metadata of the audit.

## Default resolver
The package comes with three default resolvers:
* `UrlResolver`: Resolves the URL of the request.
* `IpResolver`: Resolves the IP address of the request.
* `UserAgentResolver`: Resolves the user agent of the request.

## Custom resolver

You can create your own resolver by implementing the `Resolver` interface.

```typescript
import { HttpContext } from '@adonisjs/core/http'
import { Resolver } from '@stouder-io/adonis-auditing'

export default class RandomResolver implements Resolver {
  async resolve(ctx: HttpContext) {
    return Math.random() * 100
  }
}
```

## Register a custom resolver
To register a custom resolver, you must add it to the `resolvers` array in the `config/auditing.ts` file.
Please refer to the [General Configuration](/guide/general-configuration.html#resolvers) section for more information.

