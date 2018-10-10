const url = require('url');
const getOptions = require('./options').cypress;

module.exports = function getToken(config) {
  const options = getOptions(config);
  return cy.request(options.authenticate)
    .then((res) => {
      const navIsso = res.body.tokenId;
      options.authorize.headers.Cookie = `nav-isso=${navIsso};`;
      return cy.request(options.authorize)
        .then((authorizeResponse) => {
          const redirectLocation = url.parse(authorizeResponse.headers.location, true);
          options.token.qs.code = redirectLocation.query.code;
          cy.request(options.token)
            .then(res3 => res3.body);
        });
    });
};
