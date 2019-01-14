// TODO slå sammen denne og arbeidsforholdutil.jsx

// KLANG...(18.08.1980)
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from './formats';

const formatDate = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

const lagVisningsNavn = (arbeidsgiver) => {
  const {
    navn, fødselsdato, virksomhet, identifikator,
  } = arbeidsgiver;

  let visningsNavn = `${navn}`;
  if (virksomhet) {
    visningsNavn = `${visningsNavn} ${identifikator}`;
  } else {
    visningsNavn = `${navn.substr(0, 5)}...(${formatDate(fødselsdato)})`;
  }
  return visningsNavn;
};
export default lagVisningsNavn;
