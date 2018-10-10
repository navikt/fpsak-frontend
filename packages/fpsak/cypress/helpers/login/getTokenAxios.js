const axios = require('axios');
const url = require('url');
const getAxiosOptions = require('./options').axios;

module.exports = function getToken(config) {
  const options = getAxiosOptions(config);
  return axios(options.authenticate)
    .then((res) => {
      const navIsso = res.data.tokenId;
      options.authorize.headers.Cookie = `nav-isso=${navIsso};`;
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
          .then(res3 => res3.data)
          .catch((err3) => {
            console.error('Error: ', err3.message);
          });
      }
      console.error('Error: ', err.message);
      return err;
    });
};
