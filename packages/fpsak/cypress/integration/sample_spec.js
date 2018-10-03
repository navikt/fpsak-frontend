let environment;
if (Cypress.env('baseUrl') === 'http://localhost:9000') {
  environment = 'Lokal utvikling-Utbyggeren';
} else {
  environment = 't10';
}
const testHubBase = 'http://e34apvl00250.devillo.no:8051';
const cookieUrl = testHubBase + '/envconfig/getconfig/' + environment;
const sokPersonUrl = testHubBase + '/person/sokperson';
const foreldrepengesoknadUrl = testHubBase + '/foreldrepengesoknad/sendviafordeling/' + environment;
const enkelKvinneSok = require('../test-data/person-sok/enkel-kvinne');
const enkelForeldrepengeSoknad = require('../test-data/foreldrepengesoknad-sendviafordeling/enkel-soknad');

const pollFagsakReady = function (fnr) {
  cy.request({
    url: 'http://localhost:8080/fpsak/api/fagsak/sok',
    method: 'POST',
    body: {
      searchString: fnr,
    },
  })
    .then(function (resp) {
      if (resp.body.length > 0) {
        console.log(resp);
      } else {
        console.log('Not ready, polling...');
        cy.wait(1000);
        pollFagsakReady(fnr);
      }
    });
};

describe('My First Cypress Test', function () {
  before(function () {
    // logger inn
    Cypress.Cookies.debug(false);
    cy.request(cookieUrl)
      .then(function (resp) {
        cy.setCookie('ID_token', resp.body.token);
        cy.setCookie('refresh_token', resp.body.refreshToken);
      });
    // henter ut en person
    cy.request({
      url: sokPersonUrl,
      method: 'POST',
      body: enkelKvinneSok,
    })
      .then(function (sokPersonResp) {
        enkelForeldrepengeSoknad.fnr = sokPersonResp.body.fnr;
        cy.request({
          url: foreldrepengesoknadUrl,
          method: 'POST',
          body: enkelForeldrepengeSoknad,
        })
          .then(function (result) {
            console.log(result);
            //pollFagsakReady(enkelForeldrepengeSoknad.fnr)
          });
      });
  });

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('ID_token', 'refresh_token');
  });

  it('Besøker FPSAK og gjør et søk etter en sak', function () {
    cy.visit('/');
    cy.get('input#searchString')
      .type(enkelForeldrepengeSoknad.fnr + '{enter}');
  });
});
