// site/sidebars.js
module.exports = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Business',
      collapsed: false,
      items: [
        'business/overview',
        'business/roadmap',
        'business/vision',
      ],
    },
    {
      type: 'category',
      label: 'Developers',
      collapsed: false,
      items: [
        'developers/getting-started',
        'developers/architecture',
        'developers/api',
        'developers/plugins',
        'developers/themes',
        'developers/testing',
      ],
    },
    {
      type: 'category',
      label: 'Users',
      collapsed: false,
      items: [
        'users/intro',
        'users/media',
        'users/collaboration',
        'users/ecommerce',
      ],
    },
    {
      type: 'category',
      label: 'Community',
      collapsed: true,
      items: [
        'community/contributing',
        'community/governance',
        'community/faq',
      ],
    },
  ],
};
