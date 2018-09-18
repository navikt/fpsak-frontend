// TODO (TOR) Flytt ut av util-folder (lag selector)

const createVisningsnavnForAktivitet = (aktivitet) => {
  if (!aktivitet.virksomhetNavn) {
    return aktivitet.arbeidsforholdType ? aktivitet.arbeidsforholdType.navn : '';
  }
  let visningsNavn = `${aktivitet.virksomhetNavn}`;
  if (aktivitet.virksomhetId && aktivitet.arbeidsforholdId) {
    visningsNavn = `${aktivitet.virksomhetNavn} (${aktivitet.virksomhetId}) ...${aktivitet.arbeidsforholdId.substr(-4)}`;
  } else if (aktivitet.virksomhetId) {
    visningsNavn = `${aktivitet.virksomhetNavn} (${aktivitet.virksomhetId})`;
  }
  return visningsNavn;
};
export default createVisningsnavnForAktivitet;
