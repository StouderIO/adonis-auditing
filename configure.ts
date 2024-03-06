import ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()
  // create default migration
  await codemods.makeUsingStub(stubsRoot, 'migration.stub', { time: Date.now() })

  // create default config file
  await codemods.makeUsingStub(stubsRoot, 'config.stub', {})

  // add directory to rc file
  await codemods.updateRcFile((transformer) =>
    transformer.setDirectory('audit_resolvers', 'app/audit_resolvers')
  )

  // add default resolvers
  await codemods.makeUsingStub(stubsRoot, 'resolvers/ip_address_resolver.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'resolvers/user_agent_resolver.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'resolvers/url_resolver.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'resolvers/user_resolver.stub', {})
}
