// TODO slå sammen denne og arbeidsforholdutil.jsx

// vanlig arbeidsgivernavn (orgnr)...arbeidsforholdid
// privatperson - KLANG...(18.08.1980)
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from './formats';

const formatDate = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

const lagVisningsNavn = (arbeidsgiver = {}, arbeidsforholdId = undefined) => {
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
export default lagVisningsNavn;
