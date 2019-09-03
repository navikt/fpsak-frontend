const toggles = {
  'featureToggles': {
    'fpsak.lopende-medlemskap': false,
    'fpsak.aksjonspunkt-marker-utenlandssak': false,
    'fpsak.overstyr_beregningsgrunnlag': true,
    'fpsak.simuler-oppdrag-varseltekst': false,
    'fpsak.gradering.snfl': true,
    'fpsak.klage-formkrav': false,
    'fpsak.aktiver-tilbakekrevingbehandling': false,
  },
};

module.exports = function (app) {
  app.all('/fpsak/api/feature-toggle', function (req, res) {
    res.json(toggles);
  });
};
