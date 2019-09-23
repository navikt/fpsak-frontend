require('dotenv')
  .config();


module.exports = function (app) {
  if (process.env.FAKE_ERROR_PATH) {
    app.all(process.env.FAKE_ERROR_PATH, function (req, res) {
      const statusCode = process.env.FAKE_ERROR_CODE ? process.env.FAKE_ERROR_CODE : 500;
      const errorBody = process.env.FAKE_ERROR_BODY ? process.env.FAKE_ERROR_BODY : { error: true };
      res.status(statusCode)
        .json(errorBody);
    });
  }

};
