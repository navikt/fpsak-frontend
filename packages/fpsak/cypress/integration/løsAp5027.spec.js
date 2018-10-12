const moment = require('moment');
const testUsers = require('../test-data/testUsers');
const env = require('../test-data/environment');
const personSok = require('../test-data/person-sok/enkel-kvinne');
const soknad = require('../test-data/foreldrepengesoknad-sendviafordeling/enkel-soknad');

const state = {
  personSok,
  soknad,
};

const formatDate = function formatDate(date) {
  return moment(date)
    .format('DD.MM.YYYY');
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
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('ID_token', 'refresh_token');
  });

  it('Besøker FPSAK og går igjennom dokumenterings steget', () => {
    cy.visit(env.GUIROOT);
    cy.get('input#searchString')
      .type(`${state.soknad.fnr}{enter}`);
    cy.wait(4000);
    cy.url()
      .should('include', 'fakta=foedselsvilkaaret');
    cy.contains('Dokumentasjon foreligger')
      .click();
    cy.get('#antallBarnFodt')
      .type(state.soknad.antallBarn);
    cy.get('input[placeholder="dd.mm.åååå"]')
      .type(formatDate(state.soknad.foedsel.foedselsdato));
    cy.get('#begrunnelse')
      .type('Manglet i testgrunnlaget... :-/');
    cy.contains('Bekreft og fortsett')
      .click();
  });
});
