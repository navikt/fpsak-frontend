
const env = require('../test-data/environment');

const personSok = require('../test-data/person-sok/enkel-kvinne');
const soknad = require('../test-data/foreldrepengesoknad-sendviafordeling/enkel-soknad');

const state = {
  personSok,
  soknad,
};

describe('My First Cypress Test', () => {
  before(() => {
    // logger inn
    Cypress.Cookies.debug(false);
    const openAmUsername = Cypress.env('TEST_SAKSBEHANDLER_USERNAME');
    const openAmPassword = Cypress.env('TEST_SAKSBEHANDLER_PASSWORD');
    cy.login(openAmUsername, openAmPassword);
    cy.finnPerson(state);
    cy.sikkerstillAtArbeidsforhold(state);
    cy.sendSoknadViaTesthub(state);
    cy.pollFagsak(state);
    cy.pollBehandling(state);
    cy.sendInntektsmeldingViaTesthub(state);
    cy.pollAksjonspunkter(state);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('ID_token', 'refresh_token');
  });

  it('Sjekker hvordan Uttak ser ut...', () => {
    const uttakUtl = `${env.GUIROOT}#/fagsak/${state.fagsak.saksnummer}/behandling/${state.behandling.id}/?punkt=uttak`;
    cy.visit(env.GUIROOT);
    cy.visit(uttakUtl);
  });
});
