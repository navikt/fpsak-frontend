const url = require('url');
const paths = require('../../test-data/paths');

Cypress.Commands.add('vtpLogin', role => cy.request({
  url: `http://localhost:8080${paths.FPSAK_LOGIN}`,
  method: 'GET',
  followRedirect: true,
})
  .then((res) => {
    const lastRequest = res.allRequestResponses.pop();
    const lastReqUrl = lastRequest['Request URL'];
    const url_parts = url.parse(lastReqUrl, true);
    const query = url_parts.query;
    console.log(query);
    return cy.request({
      url: query.redirect_uri,
      method: 'GET',
      followRedirect: true,
      qs: {
        scope: query.scope,
        state: query.state,
        client_id: query.client_id,
        redirect_uri: query.redirect_uri,
        code: role,
      },
    });
  }));
