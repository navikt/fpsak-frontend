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

describe('tester henting fra VTP', () => {
  before(() => {
    // logger inn
    Cypress.Cookies.debug(false);
    cy.vtpLogin('beslut');
    cy.vtpCreateScenario(state, 50);
    cy.previewSoknad(state.hovedsoker);
    cy.vtpJournalforSoknad(state.hovedsoker, 'I000003');
    cy.opprettFagsak(state.hovedsoker, 'ab0047');
    cy.vtpKnyttSakTilJournalpost(state.hovedsoker);
    cy.journalpost(state.hovedsoker);
    cy.previewInntektsmelding(state.hovedsoker);
    /*
    cy.login(openAmUsername, openAmPassword);
    cy.sikkerstillArbeidsforholdViaTesthub(state.hovedsoker);
    cy.sendSoknadViaTesthub(state.hovedsoker);
    cy.pollFagsak(state.hovedsoker);
    cy.pollBehandling(state.hovedsoker);
    cy.sendInntektsmeldingViaTesthub(state.hovedsoker);
    cy.pollAksjonspunkter(state.hovedsoker);
    */
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
