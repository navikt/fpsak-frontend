const BASEURL = Cypress.config().baseUrl;
const localDev = 'http://localhost:9000';
const validNames = {
  [localDev]: 'Lokal utvikling-Utbyggeren',
  'https://app-t10.adeo.no': 't10',
};

module.exports = {
  BASEURL,
  NAME: validNames[BASEURL],
  GUIROOT: BASEURL === localDev ? '/' : '/fpsak',
};
