const uuid = require('uuid/v4');
const Base64 = require('js-base64').Base64;
const paths = require('../test-data/paths');


module.exports = function (xml, journalpostId, behandlingstemaOffisiellKode, dokumentTypeIdOffisiellKode, dokumentKategoriOffisiellKode, saksnummer) {
  const forsendelseId = uuid();
  const forsendelseMottatt = (new Date()).toISOString()
    .substr(0, 10);
  const payloadXml = Base64.encodeURI(xml);
  const payloadLength = xml.length;
  return {
    url: paths.FPSAK_JOURNALPOST,
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: {
      saksnummer,
      journalpostId,
      forsendelseId,
      behandlingstemaOffisiellKode,
      dokumentTypeIdOffisiellKode,
      forsendelseMottatt,
      payloadXml,
      payloadLength,
      dokumentKategoriOffisiellKode,
    },
  };
};
