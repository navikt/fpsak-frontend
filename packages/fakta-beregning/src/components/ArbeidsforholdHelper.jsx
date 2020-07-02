import PropTypes from 'prop-types';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

const getEndCharFromId = (id) => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createVisningsnavnForAktivitet = (aktivitet, alleKodeverk) => {
  if (!aktivitet.arbeidsgiverNavn) {
    return aktivitet.arbeidsforholdType ? getKodeverknavnFn(alleKodeverk, kodeverkTyper)(aktivitet.arbeidsforholdType) : '';
  }
  return aktivitet.arbeidsgiverIdVisning
    ? `${aktivitet.arbeidsgiverNavn} (${aktivitet.arbeidsgiverIdVisning})${getEndCharFromId(aktivitet.eksternArbeidsforholdId)}`
    : aktivitet.arbeidsgiverNavn;
};

export const sortArbeidsforholdList = (arbeidsforhold) => {
  const copy = arbeidsforhold.slice(0);
  copy.sort((a, b) => new Date(a.arbeidsforhold.startdato) - new Date(b.arbeidsforhold.startdato));
  return copy;
};

export const arbeidsforholdProptype = PropTypes.shape({
  arbeidsgiverNavn: PropTypes.string,
  arbeidsgiverId: PropTypes.string,
  arbeidsgiverIdVisning: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
});

const arbeidsforholdEksistererIListen = (arbeidsforhold, arbeidsgiverList) => {
  if (arbeidsforhold.arbeidsforholdId === null) {
    return arbeidsgiverList.map(({ arbeidsgiverId }) => (arbeidsgiverId)).includes(arbeidsforhold.arbeidsgiverId);
  }
  return arbeidsgiverList.map(({ arbeidsforholdId }) => (arbeidsforholdId)).includes(arbeidsforhold.arbeidsforholdId);
};

export const getUniqueListOfArbeidsforholdFields = (fields) => {
  const arbeidsgiverList = [];
  if (fields === undefined) {
    return arbeidsgiverList;
  }
  fields.forEach((id, index) => {
    const field = fields.get(index);
    if (field.arbeidsgiverNavn !== null && !arbeidsforholdEksistererIListen(field, arbeidsgiverList)) {
      const arbeidsforholdObject = {
        andelsnr: field.andelsnr,
        arbeidsforholdId: field.arbeidsforholdId,
        arbeidsgiverId: field.arbeidsgiverId,
        arbeidsgiverIdVisning: field.arbeidsgiverIdVisning,
        arbeidsgiverNavn: field.arbeidsgiverNavn,
        arbeidsperiodeFom: field.arbeidsperiodeFom,
        arbeidsperiodeTom: field.arbeidsperiodeTom,
      };
      arbeidsgiverList.push(arbeidsforholdObject);
    }
  });
  return arbeidsgiverList;
};
