const bodyParser = require('body-parser');

module.exports = function (app) {
  app.all('/api/1/store/', bodyParser.json({ type: '*/*' }), function (req, res) {
    req.body.exception.values.forEach(entry => {
      console.info('Sentry: ' + '[' + entry.type + '] ' + entry.value);
    });
    res.json({
      id: req.body.event_id,
    });
  });
};
