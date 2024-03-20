---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Adonis Auditing"
  tagline: Audit your Lucid models with ease.
  actions:
    - theme: brand
      text: Getting started
      link: /guide/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/StouderIO/adonis-auditing
      
features:
  - title: Auditable mixing
    details: Simply add the `Auditable` mixin to your model to enable auditing.
  - title: Resolvers
    details: Define custom resolvers to resolve metadata.
  - title: User resolver
    details: Define a user resolver to resolve the user who triggered the audit.
  - title: Events
    details: Auditing events let you subscribe to model changes.
  - title: Transition
    details: Transition from one state to another with ease.
---

