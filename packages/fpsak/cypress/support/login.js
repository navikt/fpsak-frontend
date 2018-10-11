const getTokenCypress = require('../helpers/login/getTokenCypress');

Cypress.Commands.add('login', (openAmUsername, openAmPassword) => {
  const config = {
    issoHost: Cypress.env('OPENIDCONNECT_ISSOHOST'),
    issoCookieName: Cypress.env('OPENIDCONNECT_COOKIE_NAME'),
    openAmUsername,
    openAmPassword,
    redirectUri: Cypress.env('OPENIDCONNECT_REDIRECT_URL'),
    servicePassword: Cypress.env('OPENIDCONNECT_PASSWORD'),
    serviceUsername: Cypress.env('OPENIDCONNECT_USERNAME'),
  };
  return getTokenCypress(config)
    .then((token) => {
      cy.setCookie('ID_token', token.id_token);
      cy.setCookie('refresh_token', token.refresh_token);
    });
});
