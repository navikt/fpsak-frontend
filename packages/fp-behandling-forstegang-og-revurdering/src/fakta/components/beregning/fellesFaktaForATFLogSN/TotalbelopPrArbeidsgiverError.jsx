import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { formatCurrencyNoKr, createVisningsnavnForAktivitet, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import { FormattedMessage } from 'react-intl';

export const lagTotalInntektArbeidsforholdList = (values, skjaeringstidspunktBeregning) => {
  const totalInntektArbeidsforholdList = [];
  values.forEach((andel) => {
    const navn = createVisningsnavnForAktivitet(andel);
    if (andel.arbeidsgiverId) {
      const arbforhold = totalInntektArbeidsforholdList.find(({ key }) => key === navn);
      if (arbforhold !== undefined) {
        const idx = totalInntektArbeidsforholdList.indexOf(arbforhold);
        totalInntektArbeidsforholdList[idx].fastsattBelop += removeSpacesFromNumber(andel.fastsattBelop || '0');
        totalInntektArbeidsforholdList[idx].registerInntekt = andel.registerInntekt && andel.registerInntekt !== ''
        ? removeSpacesFromNumber(andel.registerInntekt) : totalInntektArbeidsforholdList[idx].registerInntekt;
      } else {
        totalInntektArbeidsforholdList.push({
          key: navn,
          fastsattBelop: removeSpacesFromNumber(andel.fastsattBelop || '0'),
          registerInntekt: andel.registerInntekt || andel.registerInntekt === 0 ? removeSpacesFromNumber(andel.registerInntekt) : null,
          belopFraInntektsmelding: andel.belopFraInntektsmelding,
          beforeStp: moment(andel.arbeidsperiodeFom).isBefore(moment(skjaeringstidspunktBeregning)),
        });
      }
    } else if (andel.registerInntekt !== null && andel.registerInntekt !== undefined && andel.registerInntekt !== '') {
        totalInntektArbeidsforholdList.push({
          key: navn,
          fastsattBelop: removeSpacesFromNumber(andel.fastsattBelop || '0'),
          registerInntekt: removeSpacesFromNumber(andel.registerInntekt),
          beforeStp: true,
        });
      }
  });
  return totalInntektArbeidsforholdList;
};

/**
 *  TotalbelopPrArbeidsgiverError
 *
 * Presentasjonskomponent: Viser error for fastsatt totalbeløp for arbeidsgivere
 */
const TotalbelopPrArbeidsgiverError = ({
  totalInntektPrArbeidsforhold,
}) => {
  const beforeStpList = totalInntektPrArbeidsforhold.filter(({ beforeStp }) => beforeStp)
  .filter(({ fastsattBelop, registerInntekt }) => fastsattBelop > registerInntekt);
  const afterOrEqualStpList = totalInntektPrArbeidsforhold.filter(({ beforeStp }) => !beforeStp)
  .filter(({ fastsattBelop, belopFraInntektsmelding }) => fastsattBelop > belopFraInntektsmelding);
  return (
    <div>
      {beforeStpList.map(v => (
        <div key={v.key}>
          <FormattedMessage
            id="BeregningInfoPanel.EndringBG.Validation.TotalFordelingForArbeidsforholdIkkeHøyereEnnRapportertInntekt"
            values={{ arbeidsgiver: v.key, inntekt: formatCurrencyNoKr(v.registerInntekt) }}
          />
        </div>
  ))
  }
      {afterOrEqualStpList.map(v => (
        <div key={v.key}>
          <FormattedMessage
            id="BeregningInfoPanel.EndringBG.Validation.TotalFordelingForArbeidsforholdIkkeHøyereEnnBeløpetFraInntektsmeldingen"
            values={{ arbeidsgiver: v.key, inntekt: formatCurrencyNoKr(v.belopFraInntektsmelding) }}
          />
        </div>
  ))
  }
    </div>
  );
};

TotalbelopPrArbeidsgiverError.propTypes = {
  totalInntektPrArbeidsforhold: PropTypes.arrayOf(
    PropTypes.shape({
    key: PropTypes.string,
    fastsattBelop: PropTypes.number,
    registerInntekt: PropTypes.number,
    belopFraInntektsmelding: PropTypes.number,
    notBeforeStp: PropTypes.bool,
  }),
)
  .isRequired,
};

export default TotalbelopPrArbeidsgiverError;
