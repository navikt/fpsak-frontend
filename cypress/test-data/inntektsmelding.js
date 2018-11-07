module.exports = function (template, fnr, arbeidsforholdId, startDato, orgnr) {
  const inntektsmelding = require('./journalforInntektsmelding/enkel');
  inntektsmelding.arbeidstakerFNR = fnr;
  inntektsmelding.arbeidsforholdId = arbeidsforholdId;
  inntektsmelding.startDatoForeldrepengePerioden = startDato;
  inntektsmelding.inntektsmeldingID = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);
  inntektsmelding.organisasjonsnummer = orgnr;
  return inntektsmelding;
};
