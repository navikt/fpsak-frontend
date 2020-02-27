
const getEndCharFromId = (id) => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const harDuplikateArbeidsforholdFraSammeArbeidsgiver = (Andeler) => {
  const seen = new Set();
  return Andeler.some((currentObject) => seen.size === seen.add(currentObject.arbeidsforhold.arbeidsgiverNavn).size);
};
export const createArbeidsGiverNavn = (arbeidsforhold, harAndelerFraSammeArbeidsgiver, getKodeverknavn) => {
  if (!arbeidsforhold.arbeidsgiverNavn) {
    return arbeidsforhold.arbeidsforholdType ? getKodeverknavn(arbeidsforhold.arbeidsforholdType) : '';
  }
  return harAndelerFraSammeArbeidsgiver ? `${arbeidsforhold.arbeidsgiverNavn} (${getEndCharFromId(arbeidsforhold.eksternArbeidsforholdId)})`
    : arbeidsforhold.arbeidsgiverNavn;
};
