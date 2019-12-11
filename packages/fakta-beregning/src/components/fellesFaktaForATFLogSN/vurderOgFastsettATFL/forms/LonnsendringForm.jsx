import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { Normaltekst } from 'nav-frontend-typografi';
import { removeSpacesFromNumber, required } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

/**
 * LonnsendringForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet VURDER_FAKTA_FOR_ATFL_SN for tilfelle VURDER_LØNNSENDRING som ber
 * bruker fastsette lønnsendring for en liste med arbeidsforhold.
 * Tilhørende tilfelle for å fastsette FL inntekt er FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING.
 * Denne komponenten kan vise intektstabell under radioknappene dersom skalViseInntektstabell er satt
 */

export const lonnsendringField = 'lonnsendringField';

const LonnsendringForm = ({
  readOnly,
  isAksjonspunktClosed,
}) => (
  <div>
    <Normaltekst>
      <FormattedMessage id="BeregningInfoPanel.VurderOgFastsettATFL.HarSokerEndring" />
    </Normaltekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      name={lonnsendringField}
      validate={[required]}
      readOnly={readOnly}
      isEdited={isAksjonspunktClosed}
    >
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
    </RadioGroupField>
  </div>
);

LonnsendringForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

const buildInitialLonnsendring = (alleATAndeler) => {
  const harSattLonnsendringTilTrue = alleATAndeler.find((andel) => andel.lonnsendringIBeregningsperioden === true) !== undefined;
  const harSattLonnsendringTilFalse = alleATAndeler.find((andel) => andel.lonnsendringIBeregningsperioden === false) !== undefined;
  return harSattLonnsendringTilTrue || (harSattLonnsendringTilFalse ? false : undefined);
};

LonnsendringForm.buildInitialValues = (beregningsgrunnlag) => {
  let initialValues = {};
  if (!beregningsgrunnlag || !beregningsgrunnlag.beregningsgrunnlagPeriode) {
    return initialValues;
  }
  const alleAndeler = beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel;
  if (!alleAndeler || alleAndeler.length < 1) {
    return initialValues;
  }
  const alleATAndeler = alleAndeler.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
  if (!alleATAndeler || alleATAndeler.length < 1) {
    return initialValues;
  }
  initialValues = {
    lonnsendringField: buildInitialLonnsendring(alleATAndeler),
  };
  return initialValues;
};

const findLonnsendringAndeler = (inntektVerdier, fastsatteAndelsnr, faktaOmBeregning) => inntektVerdier
  .filter((field) => !fastsatteAndelsnr.includes(field.andelsnr) && !fastsatteAndelsnr.includes(field.andelsnrRef))
  .filter((field) => faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM
    .find((andel) => andel.andelsnr === field.andelsnr || andel.andelsnr === field.andelsnrRef));

LonnsendringForm.transformValues = (values, inntektVerdier, faktaOmBeregning, fastsatteAndelsnr) => {
  const tilfeller = faktaOmBeregning.faktaOmBeregningTilfeller ? faktaOmBeregning.faktaOmBeregningTilfeller : [];
  if (!tilfeller.map(({ kode }) => kode).includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)) {
    return {};
  }
  if (inntektVerdier === null) {
    return {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_LONNSENDRING],
      vurdertLonnsendring: { erLønnsendringIBeregningsperioden: values[lonnsendringField] },
    };
  }
  const andelerMedLonnsendringFields = values[lonnsendringField] ? findLonnsendringAndeler(inntektVerdier, fastsatteAndelsnr, faktaOmBeregning) : [];
  andelerMedLonnsendringFields.forEach((field) => fastsatteAndelsnr.push(field.andelsnr));
  const lonnsendringInntekt = andelerMedLonnsendringFields
    .map((field) => ({
      andelsnr: field.andelsnr,
      fastsattBeløp: removeSpacesFromNumber(field.fastsattBelop),
    }));
  return ({
    faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING],
    fastsattUtenInntektsmelding: { andelListe: lonnsendringInntekt },
    vurdertLonnsendring: { erLønnsendringIBeregningsperioden: values[lonnsendringField] },
  });
};

export default LonnsendringForm;
