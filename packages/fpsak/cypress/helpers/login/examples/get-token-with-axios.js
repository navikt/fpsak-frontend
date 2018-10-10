const getToken = require('../getTokenAxios');
const testUsers = require('../../../test-data/testUsers');
const cypressEnv = require('../../../../cypress.env');
/**
 * Config stuff
 */


const config = {
  serviceUsername: cypressEnv.OPENIDCONNECT_USERNAME,
  servicePassword: cypressEnv.OPENIDCONNECT_PASSWORD,
  openAmUsername: testUsers.FPSAK_SAKSBEHANDLER,
  openAmPassword: cypressEnv.TESTUSER_PASSWORD,
  redirectUri: cypressEnv.OPENIDCONNECT_REDIRECT_URL,
  issoHost: cypressEnv.OPENIDCONNECT_ISSOHOST,
};

getToken(config)
  .then((res) => {
    console.log(res);
  });
