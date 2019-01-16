const axios = require('axios');
const url = require('url');
const getAxiosOptions = require('./options').axios;

module.exports = function getToken(config) {
  const options = getAxiosOptions(config);
  if (options.onVtp) {
    return axios(options.vtpLogin)
      .then(tokenResponse => tokenResponse.data)
      .catch((tokenError) => {
        console.error('Error: ', tokenError.message);
      });
  }
  return axios(options.authenticate)
    .then((res) => {
      const navIsso = res.data.tokenId;
      options.authorize.headers.Cookie = `${config.OIDC_COOKIE_NAME}=${navIsso};`;
      return axios(options.authorize)
        .then((res2) => {
          console.log(res2);
        });
    })
    .catch((err) => {
      if (err.response.headers.location) {
        const res = url.parse(err.response.headers.location, true);
        options.token.params.code = res.query.code;
        return axios(options.token)
          .then(tokenResponse => tokenResponse.data)
          .catch((tokenError) => {
            console.error('Error: ', tokenError.message);
          });
      }
      console.error('Error: ', err.message);
      return err;
    });
};
