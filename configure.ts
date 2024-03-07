import ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'
import { readFile, writeFile } from 'node:fs/promises'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()
  // create default migration
  await codemods.makeUsingStub(stubsRoot, 'migration.stub', { time: Date.now() })

  // create default config file
  await codemods.makeUsingStub(stubsRoot, 'config.stub', {})

  // add directory to rc file
  await codemods.updateRcFile((transformer) =>
    transformer.addProvider('@stouder-io/adonis-auditing/auditing_provider')
  )

  // add default resolvers
  await codemods.makeUsingStub(stubsRoot, 'resolvers/ip_address_resolver.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'resolvers/user_agent_resolver.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'resolvers/url_resolver.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'resolvers/user_resolver.stub', {})

  // add imports
  const packageJson = await readFile('package.json', 'utf-8').then(JSON.parse)
  packageJson.imports = { ...packageJson.imports, '#audit_resolvers/*': './audit_resolvers/*.js' }
  await writeFile('package.json', JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' })

  // add tsconfig paths
  const tsConfigJson = await readFile('tsconfig.json', 'utf-8').then(JSON.parse)
  tsConfigJson.compilerOptions = {
    ...tsConfigJson.compilerOptions,
    paths: {
      ...tsConfigJson.compilerOptions.paths,
      '#audit_resolvers/*': ['./app/audit_resolvers/*.js'],
    },
  }
  tsConfigJson.compilerOptions.paths['#audit_resolvers/*'] = ['./audit_resolvers/*']
  await writeFile('tsconfig.json', JSON.stringify(tsConfigJson, null, 2), { encoding: 'utf-8' })
}
