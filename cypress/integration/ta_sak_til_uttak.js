const env = require('../test-data/environment');
const hovedsoknad = require('../test-data/foreldrepengesoknad-sendviafordeling/enkel-soknad-termin');
const fixRelativeDates = require('../helpers/fixRelativeDates');
const birthDate = require('../test-data/dates')['14_DAGER_FREM_I_TID'];
const state = {
  hovedsoker: {
    arbeidsforhold: null,
    behandling: null,
    fagsak: null,
    inntektsmelding: null,
    person: {},
    soknad: fixRelativeDates(hovedsoknad, birthDate),
  },
  annensoker: {
    arbeidsforhold: null,
    behandling: null,
    fagsak: null,
    inntektsmelding: null,
    person: {},
    soknad: fixRelativeDates(hovedsoknad, birthDate),
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
    // cy.route('/fpsak/api/nav-ansatt', 'fixture:nav-ansatt.json');
    const uttakUtl = `${env.GUIROOT}#/fagsak/${state.hovedsoker.fagsak.saksnummer}/behandling/${state.hovedsoker.behandling.id}/?punkt=uttak`;
    cy.visit(uttakUtl);
    console.log(state);
  });
});
