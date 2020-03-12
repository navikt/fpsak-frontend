const createVisningsnavnForAktivitet = (aktivitet, getKodeverknavn) => {
  if (!aktivitet.arbeidsgiverNavn) {
    return aktivitet.arbeidsforholdType ? getKodeverknavn(aktivitet.arbeidsforholdType) : '';
  }
  return aktivitet.arbeidsgiverId
    ? `${aktivitet.arbeidsgiverNavn} (${aktivitet.arbeidsgiverId})${getEndCharFromId(aktivitet.eksternArbeidsforholdId)}`
    : aktivitet.arbeidsgiverNavn;
};

export default createVisningsnavnForAktivitet;
