import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { Normaltekst } from 'nav-frontend-typografi';
import { createVisningsnavnForAktivitet, required } from '@fpsak-frontend/utils';
import { getVurderMottarYtelse } from 'behandlingFpsak/src/behandlingSelectors';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import faktaOmBeregningTilfelle, { harIkkeATFLSameOrgEllerBesteberegning } from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import FastsettATFLInntektForm from './FastsettATFLInntektForm';
import { utledArbeidsforholdFieldName, finnFrilansFieldName, skalFastsetteInntektATUtenInntektsmelding } from './VurderMottarYtelseUtils';

const andreFrilansTilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];

export const mottarYtelseForArbeidMsg = () => ('BeregningInfoPanel.VurderMottarYtelse.MottarYtelseForArbeid');

const utledArbeidsforholdUtenIMRadioTekst = arbeidsforhold => (
  <FormattedMessage id={mottarYtelseForArbeidMsg()} values={{ arbeid: createVisningsnavnForAktivitet(arbeidsforhold) }} />
);


const mottarYtelseArbeidsforholdRadio = (andel, readOnly, isAksjonspunktClosed) => (
  <div key={utledArbeidsforholdFieldName(andel)}>
    <div>
      <Normaltekst>
        {utledArbeidsforholdUtenIMRadioTekst(andel.arbeidsforhold)}
      </Normaltekst>
    </div>
    <VerticalSpacer eightPx />
    <RadioGroupField
      name={utledArbeidsforholdFieldName(andel)}
      readOnly={readOnly}
      isEdited={isAksjonspunktClosed}
    >
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
    </RadioGroupField>
  </div>
);

export const frilansMedAndreFrilanstilfeller = () => ('BeregningInfoPanel.VurderMottarYtelse.MottarYtelseForFrilansUtenFrilans');
export const frilansUtenAndreFrilanstilfeller = () => ('BeregningInfoPanel.VurderMottarYtelse.MottarYtelseForFrilans');

const finnFrilansTekstKode = (tilfeller) => {
  if (tilfeller.some(tilfelle => andreFrilansTilfeller.includes(tilfelle))) {
    return frilansMedAndreFrilanstilfeller();
  }
  return frilansUtenAndreFrilanstilfeller();
};


/**
 * VurderMottarYtelseForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet VURDER_FAKTA_FOR_ATFL_SN for tilfelle VURDER_MOTTAR_YTELSE som ber
 * bruker vurder om bruker har mottatt ytelse for en eller flere aktiviteter.
 */
export const VurderMottarYtelseFormImpl = ({
  readOnly,
  isAksjonspunktClosed,
  erFrilans,
  arbeidsforholdUtenIM,
  tilfeller,
}) => (
  <div>
    {erFrilans
      && (
      <div>
        <div key={finnFrilansFieldName()}>
          <Normaltekst>
            <FormattedMessage id={finnFrilansTekstKode(tilfeller)} />
          </Normaltekst>
        </div>
        <VerticalSpacer eightPx />
        <RadioGroupField
          name={finnFrilansFieldName()}
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed}
        >
          <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
          <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
        </RadioGroupField>
      </div>
      )
    }
    {arbeidsforholdUtenIM.map(andel => (
      mottarYtelseArbeidsforholdRadio(andel, readOnly, isAksjonspunktClosed)
    ))}
  </div>
);

VurderMottarYtelseFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  tilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  arbeidsforholdUtenIM: PropTypes.arrayOf(PropTypes.object).isRequired,
  erFrilans: PropTypes.bool.isRequired,
};

VurderMottarYtelseFormImpl.buildInitialValues = (vurderMottarYtelse) => {
  const initialValues = {};
  if (!vurderMottarYtelse) {
    return null;
  }
  if (vurderMottarYtelse.erFrilans) {
    initialValues[finnFrilansFieldName()] = vurderMottarYtelse.frilansMottarYtelse;
  }

  const ATAndelerUtenIM = vurderMottarYtelse.arbeidstakerAndelerUtenIM ? vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  if (ATAndelerUtenIM.length < 1) {
    return initialValues;
  }
  ATAndelerUtenIM.forEach((andel) => {
    initialValues[utledArbeidsforholdFieldName(andel)] = andel.mottarYtelse;
  });
  return initialValues;
};

const transformValuesArbeidstakerUtenIM = (values, tilfeller, faktaOmBeregning, transformedValues, beregningsgrunnlag) => {
  const skalFastsetteAT = skalFastsetteInntektATUtenInntektsmelding(values, faktaOmBeregning.vurderMottarYtelse);
  if (skalFastsetteAT && harIkkeATFLSameOrgEllerBesteberegning(tilfeller)) {
    if (!transformedValues.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING)) {
      transformedValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING);
      return {
        ...transformedValues,
        ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning,
          faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING, beregningsgrunnlag),
        faktaOmBeregningTilfeller: transformedValues.faktaOmBeregningTilfeller,
      };
    }
    if (!transformedValues.fastsattUtenInntektsmelding) {
      return {
        ...transformedValues,
        ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning,
          faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING, beregningsgrunnlag),
      };
    }
  }
  return {};
};


const transformValuesFrilans = (values, tilfeller, faktaOmBeregning, transformedValues, beregningsgrunnlag) => {
  const skalFastsetteInntektFrilans = values[finnFrilansFieldName()];
  if (skalFastsetteInntektFrilans && harIkkeATFLSameOrgEllerBesteberegning(tilfeller)) {
    if (!transformedValues.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)) {
      transformedValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL);
      return {
        ...transformedValues,
        ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL, beregningsgrunnlag),
        faktaOmBeregningTilfeller: transformedValues.faktaOmBeregningTilfeller,
      };
    }
    if (!transformedValues.fastsettMaanedsinntektFL) {
      return {
        ...transformedValues,
        ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL, beregningsgrunnlag),
      };
    }
  }
  return {};
};

const transformValuesMottarYtelse = (values, faktaOmBeregning) => {
  const ATAndelerUtenIM = faktaOmBeregning.vurderMottarYtelse.arbeidstakerAndelerUtenIM ? faktaOmBeregning.vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  return {
    mottarYtelse: {
      frilansMottarYtelse: values[finnFrilansFieldName()],
      arbeidstakerUtenIMMottarYtelse: ATAndelerUtenIM.map(andel => ({
        andelsnr: andel.andelsnr,
        mottarYtelse: values[utledArbeidsforholdFieldName(andel)],
      })),
    },
  };
};

VurderMottarYtelseFormImpl.transformValues = (values, faktaOmBeregning, tilfeller, transformedValues, beregningsgrunnlag) => ({
  ...transformValuesMottarYtelse(values, faktaOmBeregning),
  ...transformValuesArbeidstakerUtenIM(values, tilfeller, faktaOmBeregning, transformedValues, beregningsgrunnlag),
  ...transformValuesFrilans(values, tilfeller, faktaOmBeregning, transformedValues),
});

VurderMottarYtelseFormImpl.validate = (values, vurderMottarYtelse) => {
  const errors = {};
  if (!vurderMottarYtelse) {
    return null;
  }
  if (vurderMottarYtelse.erFrilans) {
    errors[finnFrilansFieldName()] = required(values[finnFrilansFieldName()]);
  }
  const ATAndelerUtenIM = vurderMottarYtelse.arbeidstakerAndelerUtenIM ? vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  ATAndelerUtenIM.forEach((andel) => {
    errors[utledArbeidsforholdFieldName(andel)] = required(values[utledArbeidsforholdFieldName(andel)]);
  });
  return errors;
};

const mapStateToProps = (state) => {
  const vurderInfo = getVurderMottarYtelse(state);
  const erFrilans = vurderInfo && vurderInfo.erFrilans;
  const arbeidsforholdUtenIM = vurderInfo && vurderInfo.arbeidstakerAndelerUtenIM ? vurderInfo.arbeidstakerAndelerUtenIM : [];
  return {
    arbeidsforholdUtenIM,
    erFrilans,
  };
};

export default connect(mapStateToProps)(VurderMottarYtelseFormImpl);
