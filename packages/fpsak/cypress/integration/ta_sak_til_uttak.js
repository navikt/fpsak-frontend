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

describe('tester sekvensiell kjøring av brukere fra dolly', () => {
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
    cy.pollAksjonspunkter(state.hovedsoker);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('ID_token', 'refresh_token');
  });

  it('Sjekker hvordan Uttak ser ut...', () => {
    const uttakUtl = `${env.GUIROOT}#/fagsak/${state.hovedsoker.fagsak.saksnummer}/behandling/${state.hovedsoker.behandling.id}/?punkt=uttak`;
    cy.visit(uttakUtl);
    console.log(state);
  });
});
