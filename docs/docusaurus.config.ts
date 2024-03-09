import { themes as prismThemes } from 'prism-react-renderer'
import type { Config, PluginOptions } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import npm2yarn from '@docusaurus/remark-plugin-npm2yarn'

const config: Config = {
  title: 'Adonis Auditing',
  tagline: 'Audit your Lucid models with ease',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://stouderio.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/adonis-auditing',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'StouderIO', // Usually your GitHub org/user name.
  projectName: 'adonis-auditing', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [npm2yarn as PluginOptions],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Adonis Auditing',
      logo: {
        alt: 'Adonis Auditing logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        // { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/StouderIO/adonis-auditing',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'AdonisJS',
          items: [
            {
              label: 'AdonisJS',
              href: 'https://adonisjs.com/',
            },
            {
              label: 'Lucid ORM',
              href: 'https://lucid.adonisjs.com/',
            },
          ],
        },
        {
          title: 'Other packages from StouderIO',
          items: [
            {
              label: 'Adonis Translatable',
              href: 'https://github.com/StouderIO/adonis-translatable',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} StouderIO. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
