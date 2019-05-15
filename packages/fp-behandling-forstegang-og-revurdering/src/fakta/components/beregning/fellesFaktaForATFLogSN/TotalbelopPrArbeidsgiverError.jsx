import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import { FormattedMessage } from 'react-intl';
import { createVisningsnavnForAktivitet } from 'behandlingForstegangOgRevurdering/src/visningsnavnHelper';

export const lagTotalInntektArbeidsforholdList = (values, skalValidereMotRapportert, skalValidereInntektMotRefusjon, getKodeverknavn) => {
  const totalInntektArbeidsforholdList = [];
  values.forEach((andel) => {
    if (skalValidereMotRapportert(andel) || skalValidereInntektMotRefusjon(andel)) {
      const navn = createVisningsnavnForAktivitet(andel, getKodeverknavn);
      if (andel.arbeidsgiverId) {
        const arbforhold = totalInntektArbeidsforholdList.find(({ key }) => key === navn);
        if (arbforhold !== undefined) {
          const idx = totalInntektArbeidsforholdList.indexOf(arbforhold);
          totalInntektArbeidsforholdList[idx].fastsattBelop += removeSpacesFromNumber(andel.fastsattBelop || '0');
          totalInntektArbeidsforholdList[idx].refusjonskrav += andel.refusjonskravFraInntektsmelding === null
          || andel.refusjonskravFraInntektsmelding === undefined ? 0 : andel.refusjonskravFraInntektsmelding;
          totalInntektArbeidsforholdList[idx].registerInntekt = andel.registerInntekt && andel.registerInntekt !== ''
          ? removeSpacesFromNumber(andel.registerInntekt) : totalInntektArbeidsforholdList[idx].registerInntekt;
        } else {
          totalInntektArbeidsforholdList.push({
            key: navn,
            fastsattBelop: removeSpacesFromNumber(andel.fastsattBelop || '0'),
            registerInntekt: andel.registerInntekt || andel.registerInntekt === 0 ? removeSpacesFromNumber(andel.registerInntekt) : null,
            belopFraInntektsmelding: andel.belopFraInntektsmelding,
            validerMotRefusjon: skalValidereInntektMotRefusjon(andel),
            refusjonskrav: andel.refusjonskravFraInntektsmelding === null
            || andel.refusjonskravFraInntektsmelding === undefined ? 0 : andel.refusjonskravFraInntektsmelding,
            beforeStp: !andel.nyttArbeidsforhold,
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
  const validerMotRefusjonList = totalInntektPrArbeidsforhold.filter(({ validerMotRefusjon }) => validerMotRefusjon)
  .filter(({ fastsattBelop, refusjonskrav }) => fastsattBelop > refusjonskrav);
  const beforeStpList = totalInntektPrArbeidsforhold.filter(({ beforeStp, validerMotRefusjon }) => beforeStp && !validerMotRefusjon)
  .filter(({ fastsattBelop, registerInntekt }) => fastsattBelop > registerInntekt);
  const afterOrEqualStpList = totalInntektPrArbeidsforhold.filter(({ beforeStp, validerMotRefusjon }) => !beforeStp && !validerMotRefusjon)
  .filter(({ fastsattBelop, belopFraInntektsmelding }) => fastsattBelop > belopFraInntektsmelding);
  return (
    <div>
      {validerMotRefusjonList.map(v => (
        <div key={v.key}>
          <FormattedMessage
            id="BeregningInfoPanel.EndringBG.Validation.TotalFordelingForArbeidsforholdIkkeHøyereEnnRefusjon"
            values={{ arbeidsgiver: v.key, refusjonskrav: formatCurrencyNoKr(v.refusjonskrav) }}
          />
        </div>
      ))}
      {beforeStpList.map(v => (
        <div key={v.key}>
          <FormattedMessage
            id="BeregningInfoPanel.EndringBG.Validation.TotalFordelingForArbeidsforholdIkkeHøyereEnnRapportertInntekt"
            values={{ arbeidsgiver: v.key, inntekt: formatCurrencyNoKr(v.registerInntekt) }}
          />
        </div>
      ))}
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
).isRequired,
};

export default TotalbelopPrArbeidsgiverError;
