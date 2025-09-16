// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AetherCMS Docs',
  tagline: 'Headless, plugin-first CMS',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://rzymianin11.github.io',      // <— Twój GitHub Pages root
  baseUrl: '/AetherCMS-docs/',               // <— ścieżka do repo Pages

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: { defaultLocale: 'pl', locales: ['pl', 'en'] },

  presets: [
    [
      'classic',
      ({
        docs: {
          routeBasePath: '/', // docs pod / zamiast /docs
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/rzymianin11/AetherCMS-docs/edit/docs-site/site/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig: ({
    navbar: {
      title: 'AetherCMS',
      logo: { alt: 'AetherCMS', src: 'img/logo.svg' },
      items: [
        { to: '/business/overview', label: 'Business', position: 'left' },
        { to: '/developers/getting-started', label: 'Developers', position: 'left' },
        { to: '/users/intro', label: 'Users', position: 'left' },
        { href: 'https://github.com/rzymianin11/AetherCMS-docs', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        { title: 'Docs', items: [
          { label: 'Overview', to: '/business/overview' },
          { label: 'Getting Started', to: '/developers/getting-started' },
        ]},
        { title: 'Community', items: [
          { label: 'Contributing', to: '/community/contributing' },
        ]},
      ],
      copyright: `© ${new Date().getFullYear()} AetherCMS`,
    },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
  }),
};

export default config;
