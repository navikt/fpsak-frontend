// TODO (TOR) Flytt ut av util-folder (lag selector)

// TODO slå sammen denne og lagvisningnavn.jsx


/*
uttak
arbeidsgiver: {
  aktørId: "1000104380799",
  fødselsdato: "1980-08-18",
  identifikator: "18088011895",
  navn: "KLANG OBSERVANT",
  virksomhet: false
}
beregning
arbeidsforhold: {
  aktørId: "1000104380799",
  arbeidsforholdId: null,
  arbeidsforholdType: {kode: "ARBEID", navn: "Arbeid", kodeverk: "OPPTJENING_AKTIVITET_TYPE"},
  kode: "ARBEID",
  kodeverk: "OPPTJENING_AKTIVITET_TYPE",
  navn: "Arbeid",
  arbeidsgiverId: "18.08.1980",
  arbeidsgiverNavn: "KLANG OBSERVANT",
  opphoersdato: null,
  startdato: "2017-01-01",
}
inntekstmelding
arbeidsforhold: {
  arbeidsforholdId: "f2ecd800-42cd-4bfd-b64e-2f12cc490631",
  arbeidsgiverIdentifikator: "1000104380799",
  arbeidsgiverIdentifiktorGUI: "18.08.1980",
  beskrivelse: null,
  brukArbeidsforholdet: true,
  erEndret: true,
  erNyttArbeidsforhold: null,
  erSlettet: null,
  erstatterArbeidsforholdId: null,
  fomDato: "2017-01-01",
  fortsettBehandlingUtenInntektsmelding: true,
  harErstattetEttEllerFlere: null,
  id: "1000104380799-f2ecd800-42cd-4bfd-b64e-2f12cc490631",
  ikkeRegistrertIAaRegister: false,
  kilde: {navn: "AA-Registeret"},
  mottattDatoInntektsmelding: null,
  navn: "KLANG OBSERVANT",
  stillingsprosent: 100,
  tilVurdering: false,
  tomDato: null,
  vurderOmSkalErstattes: false
}
opptjening
opptjeningAktivitetList: {
  aktivitetType: {kode: "ARBEID", navn: "Arbeid", kodeverk: "OPPTJENING_AKTIVITET_TYPE"},
  arbeidsforholdRef: "f2ecd800-42cd-4bfd-b64e-2f12cc490631",
  arbeidsgiver: null,
  begrunnelse: null,
  erEndret: false,
  erGodkjent: true,
  erManueltOpprettet: false,
  erPeriodeEndret: false,
  naringRegistreringsdato: null,
  oppdragsgiverOrg: "1000104380799",
  opptjeningFom: "2017-01-01",
  opptjeningTom: "9999-12-31",
  originalFom: null,
  originalTom: null,
  stillingsandel: 100
}
foreldrepenger
andeler: {
  aktivitetStatus: {kode: "AT", navn: "Arbeidstaker", kodeverk: "AKTIVITET_STATUS"},
  arbeidsforholdId: null,
  arbeidsforholdType: {kode: "-", navn: "UDEFINERT", kodeverk: "OPPTJENING_AKTIVITET_TYPE"},
  arbeidsgiverNavn: "KLANG OBSERVANT",
  arbeidsgiverOrgnr: "18.08.1980",
  refusjon: 0,
  sisteUtbetalingsdato: "2019-02-28",
  tilSoker: 1154,
  utbetalingsgrad: 100,
  uttak: {trekkdager: 30, stonadskontoType: "MØDREKVOTE", periodeResultatType: "INNVILGET", gradering: false}
}
*/

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
