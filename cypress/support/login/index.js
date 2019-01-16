const getTokenCypress = require('./getTokenCypress');

Cypress.Commands.add('login', (openAmUsername, openAmPassword) => {
  const config = {
    OIDC_AGENTNAME: Cypress.env('OIDC_AGENTNAME'),
    OIDC_COOKIE_NAME: Cypress.env('OIDC_COOKIE_NAME'),
    OIDC_HOST_URL: Cypress.env('OIDC_HOST_URL'),
    OIDC_PASSWORD: Cypress.env('OIDC_PASSWORD'),
    OIDC_REDIRECT_URI: Cypress.env('OIDC_REDIRECT_URI'),
    openAmPassword,
    openAmUsername,
  };

  return getTokenCypress(config)
    .then((token) => {
      cy.setCookie('ID_token', token.id_token);
    });
});
