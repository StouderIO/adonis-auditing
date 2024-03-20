import {defineConfig} from 'vitepress'

const guidesNav = [
  {
    text: 'Essentials',
    items: [
      {
        text: 'Introduction',
        link: '/guide/introduction'
      },
      {
        text: 'Installation',
        link: '/guide/installation'
      }
    ]
  },
  {
    text: 'Configuration',
    items: [
      {
        text: 'General Configuration',
        link: '/guide/general-configuration'
      }
    ]
  },
  {
    text: 'Basic Usage',
    items: [
      {
        text: 'Model Setup',
        link: '/guide/model-setup'
      },
      {
        text: 'Getting Audits',
        link: '/guide/getting-audits'
      }
    ]
  }
]

const releasesNav = [
  {
    text: 'Changelog',
    link: 'https://github.com/StouderIO/adonis-auditing/blob/main/CHANGELOG.md',
  },
  {
    text: 'Release Notes',
    link: 'https://github.com/StouderIO/adonis-auditing/releases',
  }
]

const adonisNav = [
  {
    text: 'AdonisJS',
    link: 'https://adonisjs.com/',
  },
  {
    text: 'Lucid',
    link: 'https://lucid.adonisjs.com/',
  }
]

const stouderIONav = [
  {
    text: 'adonis-translatable',
    link: 'https://github.com/StouderIO/adonis-translatable',
  }
]

export default defineConfig({
  title: 'Adonis Auditing',
  description: 'Audit your Lucid models with ease.',

  head: [
    ['meta', { property: 'og:title', content: 'Adonis Auditing' }],
    ['meta', { property: 'og:site_name', content: 'Adonis Auditing' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:description', content: 'Adonis Auditing allows you to record changes to a Lucid model\'s set of data by simply adding its mixin to your model.' }],
    ['meta', { property: 'og:url', content: 'https://adonis-auditing.github.io/' }]
  ],

  lastUpdated: true,
  lang: 'en-US',

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/StouderIO/adonis-auditing/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    nav: [
      {text: 'Guide', link: '/guide/introduction'},
      {text: 'Releases', items: releasesNav},
      {text: 'AdonisJS', items: adonisNav},
      {text: 'Other packages', items: stouderIONav},
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: guidesNav
        }
      ]
    },
    socialLinks: [
      {icon: 'github', link: 'https://github.com/StouderIO/adonis-auditing'}
    ]
  }
})
