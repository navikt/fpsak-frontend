const getToken = require('../getTokenAxios');
const cypressEnv = require('../../../../cypress.env');

const config = {
  serviceUsername: cypressEnv.OPENIDCONNECT_USERNAME,
  servicePassword: cypressEnv.OPENIDCONNECT_PASSWORD,
  openAmUsername: cypressEnv.SAKSBEHANDLER_USERNAME,
  openAmPassword: cypressEnv.SAKSBEHANDLER_PASSWORD,
  redirectUri: cypressEnv.OPENIDCONNECT_REDIRECT_URL,
  issoHost: cypressEnv.OPENIDCONNECT_ISSOHOST,
  issoCookieName: cypressEnv.OPENIDCONNECT_COOKIE_NAME,
};

getToken(config)
  .then((res) => {
    console.log(res);
  });
