// TODO (TOR) Flytt ut av util-folder (lag selector)

const createVisningsnavnForAktivitet = (aktivitet) => {
  if (!aktivitet.arbeidsgiverNavn) {
    return aktivitet.arbeidsforholdType ? aktivitet.arbeidsforholdType.navn : '';
  }
  let visningsNavn = `${aktivitet.arbeidsgiverNavn}`;
  if (aktivitet.arbeidsgiverId && aktivitet.arbeidsforholdId) {
    visningsNavn = `${aktivitet.arbeidsgiverNavn} (${aktivitet.arbeidsgiverId}) ...${aktivitet.arbeidsforholdId.substr(-4)}`;
  } else if (aktivitet.arbeidsgiverId) {
    visningsNavn = `${aktivitet.arbeidsgiverNavn} (${aktivitet.arbeidsgiverId})`;
  }
  return visningsNavn;
};
export default createVisningsnavnForAktivitet;
