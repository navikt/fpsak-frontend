require('dotenv')
  .load();
const moment = require('moment');
const paths = require('../test-data/paths');
const getToken = require('../helpers/getToken/getTokenCypress');
const testUsers = require('../test-data/testUsers');

const state = {
  personSok: require('../test-data/person-sok/enkel-kvinne'),
  soknad: require('../test-data/foreldrepengesoknad-sendviafordeling/enkel-soknad'),
};
let kjentFodselsnummer;
const pollFagsakReady = function (state) {
  return cy.request({
    url: paths.FPSAK_FAGSAK_SOK,
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: {
      searchString: state.soknad.fnr,
    },
  })
    .then((resp) => {
      if (resp.body.length > 0) {
        state.fagsak = resp.body[0];
        return state;
      }
      cy.wait(1000);
      return pollFagsakReady(state);
    });
};

const finnBehandling = function finnBehandling(state) {
  return cy.request({
    url: paths.FPSAK_ALLE_BEHANDLINGER + state.fagsak.saksnummer,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((resp) => {
      if (resp.body[0]) {
        state.behandling = resp.body[0];
        return state;
      }
      cy.wait(1000);
      return finnBehandling(state);
    });
};

const formatDate = function formatDate(date) {
  return moment(date)
    .format('DD.MM.YYYY');
};
const printResult = function printResult(state) {
  console.log(state);
};
const createSoknadFromTestHub = function createSoknadFromTestHub(state) {
  // henter ut en person
  return cy.request({
    url: paths.TESTHUB_SOK_PERSON,
    method: 'POST',
    body: state.personSok,
  })
    .then((sokPersonResp) => {
      state.soknad.fnr = sokPersonResp.body.fnr;
      cy.request({
        url: paths.TESTHUB_SEND_FORELDREPENGESOKNAD,
        method: 'POST',
        body: state.soknad,
      })
        .then(result => state);
    });
};
const oppfyllAksjonspunkt5027 = function oppfyllAksjonspunkt5027(state) {
  const template = require('../test-data/aksjonspunkt/5027');
  template.behandlingId = state.behandling.id;
  template.behandlingVersjon = tate.behandling.versjon;
  template.bekreftedeAksjonspunktDtoer[0].fodselsdato = state.soknad.foedsel.foedselsdato;
  template.bekreftedeAksjonspunktDtoer[0].antallBarnFodt = state.soknad.antallBarn;
  cy.request({
    url: paths.FPSAK_LAGRE_AKSJONSPUNKT,
    method: 'POST',
    body: template,
  });
};
const config = {
  serviceUsername: process.env.OPENIDCONNECT_USERNAME,
  servicePassword: process.env.OPENIDCONNECT_PASSWORD,
  openAmUsername: testUsers.FPSAK_SAKSBEHANDLER,
  openAmPassword: process.env.TESTUSER_PASSWORD,
  redirectUri: process.env.OPENIDCONNECT_REDIRECT_URL,
  issoHost: process.env.OPENIDCONNECT_ISSOHOST,
};

describe('My First Cypress Test', () => {
  before(() => {
    // logger inn
    Cypress.Cookies.debug(false);
    getToken(config)
      .then((token) => {
        cy.setCookie('ID_token', token.id_token);
        cy.setCookie('refresh_token', token.refresh_token);
        createSoknadFromTestHub(state)
          .then(pollFagsakReady)
          .then(finnBehandling)
          .then(printResult);
      });
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('ID_token', 'refresh_token');
  });
  /*
    it('Besøker FPSAK og går igjennom dokumenterings steget', () => {
      cy.visit(env.GUIROOT);
      cy.get('input#searchString')
        .type(`${enkelForeldrepengeSoknad.fnr}{enter}`);
      cy.wait(1000);
      cy.url()
        .should('include', 'fakta=foedselsvilkaaret');
      cy.contains('Dokumentasjon foreligger')
        .click();
      cy.get('#antallBarnFodt')
        .type(enkelForeldrepengeSoknad.antallBarn);
      cy.get('input[placeholder="dd.mm.åååå"]')
        .type(formatDate(enkelForeldrepengeSoknad.foedsel.foedselsdato));
      cy.get('#begrunnelse')
        .type('Manglet i testgrunnlaget... :-/');
      cy.contains('Bekreft og fortsett')
        .click();
    });
    */
  it('Besøker FPSAK og går igjennom dokumenterings steget', () => {
    // console.log(state);
    // oppfyllAksjonspunkt5027(templateAksjonspunkt5027);


  });
});
