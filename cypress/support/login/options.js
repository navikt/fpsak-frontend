const url = require('url');

const axiosOptions = function axiosOptions(config, cypress) {
  const issoAuthorizeUrl = `${config.OIDC_HOST_URL}/authorize`;
  const jsonBase = config.OIDC_HOST_URL.replace('oauth2', 'json');
  const issoAuthenticateUrl = `${jsonBase}/authenticate`;
  const issoAccessTokenUrl = `${config.OIDC_HOST_URL}/access_token`;
  const isOnVTP = (url.parse(config.OIDC_HOST_URL).hostname === 'localhost');
  let params = 'params';
  if (cypress) {
    params = 'qs';
  }
  const auth = {
    username: config.OIDC_AGENTNAME,
    password: config.OIDC_PASSWORD,
  };
  const authenticateOptions = {
    url: issoAuthenticateUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-OpenAM-Username': config.openAmUsername,
      'X-OpenAM-Password': config.openAmPassword,
    },
    auth,
  };

  const authorizeOptions = {
    url: issoAuthorizeUrl,
    method: 'GET',
    headers: {},
    [params]: {
      response_type: 'code',
      scope: 'openid',
      client_id: config.OIDC_AGENTNAME,
      state: 'dummy',
      redirect_uri: config.OIDC_REDIRECT_URI,
    },
  };

  const tokenOptions = {
    url: issoAccessTokenUrl,
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-type': 'application/x-www-form-urlencoded',
    },
    [params]: {
      grant_type: 'authorization_code',
      realm: '/',
      redirect_uri: config.OIDC_REDIRECT_URI,
      code: '',
      state: 'dummy',
    },
    auth,
  };
  const vtpLoginOptions = {
    url: issoAccessTokenUrl,
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-type': 'application/x-www-form-urlencoded',
    },
    body: tokenOptions[params],
  };
  vtpLoginOptions.body.code = config.openAmUsername;
  return {
    onVtp: isOnVTP,
    authenticate: authenticateOptions,
    authorize: authorizeOptions,
    token: tokenOptions,
    vtpLogin: vtpLoginOptions,
  };
};

module.exports = {
  cypress(config) {
    const options = axiosOptions(config, true);
    options.authorize.followRedirect = false;
    options.authorize.log = true;
    options.authorize.form = true;
    options.vtpLogin.form = true;
    return options;
  },
  axios(config) {
    const options = axiosOptions(config);
    options.authorize.maxRedirects = 0;
    options.authenticate.proxy = false;
    options.authorize.proxy = false;
    options.token.proxy = false;
    options.vtpLogin.proxy = false;
    return options;
  },
};
