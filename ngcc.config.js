module.exports = {
  packages: {
    'angular2-text-mask': {
      ignorableDeepImportMatchers: [
        /text-mask-core\//,
      ]
    },
    'ng2-pica': {
      ignorableDeepImportMatchers: [
        /pica\//,
        /dist\//,
      ]
    },
  },
};