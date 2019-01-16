const url = require('url');
const getCypressOptions = require('./options').cypress;

module.exports = function getToken(config) {
  const options = getCypressOptions(config);
  if (options.onVtp) {
    return cy.request(options.vtpLogin)
      .then(tokenResponse => tokenResponse.body);
  }
  return cy.request(options.authenticate)
    .then((authenticateResponse) => {
      const navIsso = authenticateResponse.body.tokenId;
      options.authorize.headers.Cookie = `${config.OIDC_COOKIE_NAME}=${navIsso};`;
      return cy.request(options.authorize)
        .then((authorizeResponse) => {
          const redirectLocation = url.parse(authorizeResponse.headers.location, true);
          options.token.qs.code = redirectLocation.query.code;
          cy.request(options.token)
            .then(tokenResponse => tokenResponse.body);
        });
    });
};
