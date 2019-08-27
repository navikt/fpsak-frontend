import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

export const createVisningsnavnForAktivitet = (aktivitet, getKodeverknavn) => {
  if (!aktivitet.arbeidsgiverNavn) {
    return aktivitet.arbeidsforholdType ? getKodeverknavn(aktivitet.arbeidsforholdType) : '';
  }
  let visningsNavn = `${aktivitet.arbeidsgiverNavn}`;
  if (aktivitet.arbeidsgiverId && aktivitet.arbeidsforholdId) {
    visningsNavn = `${aktivitet.arbeidsgiverNavn} (${aktivitet.arbeidsgiverId}) ...${aktivitet.arbeidsforholdId.substr(-4)}`;
  } else if (aktivitet.arbeidsgiverId) {
    visningsNavn = `${aktivitet.arbeidsgiverNavn} (${aktivitet.arbeidsgiverId})`;
  }
  return visningsNavn;
};


// vanlig arbeidsgivernavn (orgnr)...arbeidsforholdid
// privatperson - KLANG...(18.08.1980)
const formatDate = (dato) => moment(dato).format(DDMMYYYY_DATE_FORMAT);

export const lagVisningsNavn = (arbeidsgiver = {}, arbeidsforholdId = undefined) => {
  const {
    navn, fødselsdato, virksomhet, identifikator,
  } = arbeidsgiver;

  let visningsNavn = `${navn}`;
  if (virksomhet) {
    visningsNavn = identifikator ? `${visningsNavn} (${identifikator})` : visningsNavn;
    visningsNavn = arbeidsforholdId ? `${visningsNavn}...${arbeidsforholdId.substr(-4)}` : visningsNavn;
  } else {
    visningsNavn = `${navn.substr(0, 5)}...(${formatDate(fødselsdato)})`;
  }
  return visningsNavn;
};
