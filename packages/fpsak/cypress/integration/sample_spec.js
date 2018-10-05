const moment = require('moment');
const paths = require('../test-data/paths');
const env = require('../test-data/environment');
const enkelKvinneSok = require('../test-data/person-sok/enkel-kvinne');
const enkelForeldrepengeSoknad = require('../test-data/foreldrepengesoknad-sendviafordeling/enkel-soknad');

let kjentFodselsnummer;
let currentFagsak;
let currentBehandling;
const pollFagsakReady = function (fnr) {
  cy.request({
    url: '/fpsak/api/fagsak/sok',
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: {
      searchString: fnr,
    },
  })
    .then((resp) => {
      if (resp.body.length > 0) {
        currentFagsak = resp.body[0];
        // finnBehandling(currentFagsak.saksnummer);
      } else {
        console.log('Not ready, polling...');
        cy.wait(1000);
        pollFagsakReady(fnr);
      }
    });
};
/*
const finnBehandling = function finnBehandling(saksnummer) {
  cy.request({
    url: paths.FPSAK_ALLE_BEHANDLINGER + saksnummer,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((resp) => {
      resp.body[0];
      console.log(resp);
    });
};
*/
const formatDate = function formatDate(date) {
  return moment(date)
    .format('DD.MM.YYYY');
};

const createSoknadFromTestHub = function createSoknadFromTestHub(personSokTemplate, soknadsTemplate) {
  // henter ut en person
  cy.request({
    url: paths.TESTHUB_SOK_PERSON,
    method: 'POST',
    body: personSokTemplate,
  })
    .then((sokPersonResp) => {
      soknadsTemplate.fnr = sokPersonResp.body.fnr;
      cy.request({
        url: paths.TESTHUB_SEND_FORELDREPENGESOKNAD,
        method: 'POST',
        body: soknadsTemplate,
      })
        .then((result) => {
          pollFagsakReady(soknadsTemplate.fnr);
        });
    });
};
describe('My First Cypress Test', () => {
  before(() => {
    // logger inn
    Cypress.Cookies.debug(false);
    cy.request(paths.TESTHUB_GETCONFIG)
      .then((resp) => {
        cy.setCookie('ID_token', resp.body.token);
        cy.setCookie('refresh_token', resp.body.refreshToken);
        if (!kjentFodselsnummer) {
          createSoknadFromTestHub(enkelKvinneSok, enkelForeldrepengeSoknad);
          kjentFodselsnummer = enkelForeldrepengeSoknad.fnr;
        } else {
          enkelForeldrepengeSoknad.fnr = kjentFodselsnummer;
        }
      });
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('ID_token', 'refresh_token');
  });

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
});
