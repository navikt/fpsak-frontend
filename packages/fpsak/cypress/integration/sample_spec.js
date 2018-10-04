const moment = require('moment');
let environment;
if (Cypress.config().baseUrl === 'http://localhost:9000') {
  environment = 'Lokal utvikling-Utbyggeren';
} else {
  environment = 't10';
}
const testHubBase = 'http://e34apvl00250.devillo.no:8051';
const cookieUrl = `${testHubBase}/envconfig/getconfig/${environment}`;
const sokPersonUrl = `${testHubBase}/person/sokperson`;
const foreldrepengesoknadUrl = `${testHubBase}/foreldrepengesoknad/sendviafordeling/${environment}`;
const enkelKvinneSok = require('../test-data/person-sok/enkel-kvinne');
const enkelForeldrepengeSoknad = require('../test-data/foreldrepengesoknad-sendviafordeling/enkel-soknad');

let kjentFodselsnummer;

const pollFagsakReady = function (fnr) {
  cy.request({
    url: 'http://localhost:8080/fpsak/api/fagsak/sok',
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
      } else {
        console.log('Not ready, polling...');
        cy.wait(1000);
        pollFagsakReady(fnr);
      }
    });
};
const formatDate = function formatDate(date) {
  return moment(date)
    .format('DD.MM.YYYY');
};

const createSoknadFromTestHub = function (personSokTemplate, soknadsTemplate) {
  // henter ut en person
  cy.request({
    url: sokPersonUrl,
    method: 'POST',
    body: personSokTemplate,
  })
    .then((sokPersonResp) => {
      soknadsTemplate.fnr = sokPersonResp.body.fnr;
      cy.request({
        url: foreldrepengesoknadUrl,
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
    cy.request(cookieUrl)
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

  it('Besøker FPSAK og gjør et søk etter en sak', () => {
    cy.visit('/');
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
