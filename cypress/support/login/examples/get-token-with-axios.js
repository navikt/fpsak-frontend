const getToken = require('../getTokenAxios');
const cyEnv = require('../../../../cypress.env');


const config = {
  OIDC_AGENTNAME: cyEnv.OIDC_AGENTNAME,
  OIDC_COOKIE_NAME: cyEnv.OIDC_COOKIE_NAME,
  OIDC_HOST_URL: cyEnv.OIDC_HOST_URL,
  OIDC_PASSWORD: cyEnv.OIDC_PASSWORD,
  OIDC_REDIRECT_URI: cyEnv.OIDC_REDIRECT_URI,
  openAmPassword: cyEnv.SAKSBEHANDLER_PASSWORD,
  openAmUsername: cyEnv.SAKSBEHANDLER_USERNAME,
};

getToken(config)
  .then((res) => {
    console.log(res);
  });
