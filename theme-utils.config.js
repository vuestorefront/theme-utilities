module.exports = {
  copy: {
    to: 'temp',
    from: [
      {
        path: '/home/fsobol/Projects/Storefront/packages/commercetools/theme/_theme',
        ignore: [],
        variables: {},
        watch: true
      },
      {
        path: '/home/fsobol/Projects/Storefront/packages/commercetools/theme',
        ignore: [
          '_theme/**'
        ],
        variables: {},
        watch: true
      }
    ]
  }
};