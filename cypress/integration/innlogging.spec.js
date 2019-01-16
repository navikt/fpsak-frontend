describe('tester innlogging mot baseurl', () => {
  before(() => {
    // logger inn
    Cypress.Cookies.debug(false);
    cy.login('veil', null);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('ID_token');
  });

  it('Sjekker hvordan Uttak ser ut...', () => {

    const uttakUtl = '/fpsak/aktoer/992029500269';
    cy.visit(uttakUtl);
    cy.get('h2.typo-systemtittel')
      .should('contain', 'Foreldrepenger');
  });
});
