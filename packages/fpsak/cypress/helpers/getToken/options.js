const axiosOptions = function axiosOptions(config) {
  const issoAuthorizeUrl = `${config.issoHost}/authorize`;
  const jsonBase = config.issoHost.replace('oauth2', 'json');
  const issoAuthenticateUrl = `${jsonBase}/authenticate`;
  const issoAccessTokenUrl = `${config.issoHost}/access_token`;

  const authenticateOptions = {
    url: issoAuthenticateUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-OpenAM-Username': config.openAmUsername,
      'X-OpenAM-Password': config.openAmPassword,
    },
    auth: {
      username: config.serviceUsername,
      password: config.servicePassword,
    },
    // data: {},
  };

  const authorizeOptions = {
    url: issoAuthorizeUrl,
    method: 'GET',
    headers: {},
    maxRedirects: 0,
    params: {
      response_type: 'code',
      scope: 'openid',
      client_id: config.serviceUsername,
      state: 'dummy',
      redirect_uri: config.redirectUri,
    },
  };

  const tokenOptions = {
    url: issoAccessTokenUrl,
    method: 'POST',
    proxy: false,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-type': 'application/x-www-form-urlencoded',
    },
    params: {
      grant_type: 'authorization_code',
      realm: '/',
      redirect_uri: config.redirectUri,
      code: '',
    },
    auth: {
      username: config.serviceUsername,
      password: config.servicePassword,
    },
  };
  return {
    authenticate: authenticateOptions,
    authorize: authorizeOptions,
    token: tokenOptions,
  };
};

module.exports = {
  cypress: function (config) {
    const options = axiosOptions(config);
    options.authorize.followRedirect = false;
    options.authorize.qs = options.authorize.params;
    options.token.qs = options.token.params;
    return options;
  },
  axios: function (config) {
    const options = axiosOptions(config);
    options.authenticate.proxy = false;
    options.authorize.maxRedirects = 0;
    options.authorize.proxy = false;
    options.authorize.proxy = false;
    return options;
  },
};
