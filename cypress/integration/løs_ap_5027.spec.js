const moment = require('moment');
const env = require('../test-data/environment');

const hovedsoknad = require('../test-data/foreldrepengesoknad-sendviafordeling/enkel-soknad');

const state = {
  hovedsoker: {
    arbeidsforhold: null,
    behandling: null,
    fagsak: null,
    inntektsmelding: null,
    person: {},
    soknad: hovedsoknad,
  },
  annensoker: {
    arbeidsforhold: null,
    behandling: null,
    fagsak: null,
    inntektsmelding: null,
    person: {},
    soknad: hovedsoknad,
  },
};

const formatDate = function formatDate(date) {
  return moment(date)
    .format('DD.MM.YYYY');
};

describe('My First Cypress Test', () => {
  before(() => {
    // logger inn
    Cypress.Cookies.debug(false);
    const openAmUsername = Cypress.env('SAKSBEHANDLER_USERNAME');
    const openAmPassword = Cypress.env('SAKSBEHANDLER_PASSWORD');
    cy.hentDollyPerson(state.hovedsoker, 'kvinner.json');
    cy.login(openAmUsername, openAmPassword);
    cy.sikkerstillArbeidsforholdViaTesthub(state.hovedsoker);
    cy.sendSoknadViaTesthub(state.hovedsoker);
    cy.pollFagsak(state.hovedsoker);
    cy.konsumerDollyPerson(state.hovedsoker);
    cy.pollBehandling(state.hovedsoker);
    cy.sendInntektsmeldingViaTesthub(state.hovedsoker);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('ID_token', 'refresh_token');
  });

  it('Besøker FPSAK og går igjennom dokumenterings steget', () => {
    cy.visit(env.GUIROOT);
    cy.get('input#searchString')
      .type(`${state.hovedsoker.soknad.fnr}{enter}`);
    cy.wait(4000);
    cy.url()
      .should('include', 'fakta=foedselsvilkaaret');
    cy.contains('Dokumentasjon foreligger')
      .click();
    cy.get('#antallBarnFodt')
      .type(state.hovedsoker.soknad.antallBarn);
    cy.get('input[placeholder="dd.mm.åååå"]')
      .type(formatDate(state.hovedsoker.soknad.foedsel.foedselsdato));
    cy.get('#begrunnelse')
      .type('Manglet i testgrunnlaget... :-/');
    cy.contains('Bekreft og fortsett')
      .click();
  });
});
