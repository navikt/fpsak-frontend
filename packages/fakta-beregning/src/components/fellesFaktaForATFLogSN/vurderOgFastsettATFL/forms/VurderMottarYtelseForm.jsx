import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { Normaltekst } from 'nav-frontend-typografi';

import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { removeSpacesFromNumber, required } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import {
  andelsnrMottarYtelseMap,
  finnFrilansFieldName,
  frilansMottarYtelse,
  skalFastsetteInntektATUtenInntektsmelding,
  utledArbeidsforholdFieldName,
} from './VurderMottarYtelseUtils';
import { createVisningsnavnForAktivitet } from '../../../ArbeidsforholdHelper';


const andreFrilansTilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];


export const mottarYtelseForArbeidMsg = () => ('BeregningInfoPanel.VurderMottarYtelse.MottarYtelseForArbeid');

const utledArbeidsforholdUtenIMRadioTekst = (arbeidsforhold, alleKodeverk) => (
  <FormattedMessage id={mottarYtelseForArbeidMsg()} values={{ arbeid: createVisningsnavnForAktivitet(arbeidsforhold, alleKodeverk) }} />
);


const mottarYtelseArbeidsforholdRadio = (andel, readOnly, isAksjonspunktClosed, alleKodeverk) => (
  <div key={utledArbeidsforholdFieldName(andel)}>
    <div>
      <Normaltekst>
        {utledArbeidsforholdUtenIMRadioTekst(andel.arbeidsforhold, alleKodeverk)}
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
  if (tilfeller.some((tilfelle) => andreFrilansTilfeller.includes(tilfelle))) {
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
  alleKodeverk,
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
      )}
    {arbeidsforholdUtenIM.map((andel) => (
      mottarYtelseArbeidsforholdRadio(andel, readOnly, isAksjonspunktClosed, alleKodeverk)
    ))}
  </div>
);

VurderMottarYtelseFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  tilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  arbeidsforholdUtenIM: PropTypes.arrayOf(PropTypes.object).isRequired,
  erFrilans: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

const transformValuesArbeidstakerUtenIM = (values, inntektVerdier, faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr, faktaOmBeregningTilfeller) => {
  if (inntektVerdier === null) {
    return {};
  }
  const skalFastsetteAT = skalFastsetteInntektATUtenInntektsmelding(values, faktaOmBeregning.vurderMottarYtelse);
  if (skalFastsetteAT) {
    const listeMedFastsatteMaanedsinntekter = [];
    const mottarYtelseMap = andelsnrMottarYtelseMap(values, faktaOmBeregning.vurderMottarYtelse, beregningsgrunnlag);
    faktaOmBeregning.vurderMottarYtelse.arbeidstakerAndelerUtenIM.forEach((andel) => {
      if (mottarYtelseMap[andel.andelsnr] && !fastsatteAndelsnr.includes(andel.andelsnr)) {
        const inntektUtenFormat = inntektVerdier.find((field) => field.andelsnr === andel.andelsnr).fastsattBelop;
        if (inntektUtenFormat || inntektUtenFormat === 0) {
          listeMedFastsatteMaanedsinntekter.push({
            andelsnr: andel.andelsnr,
            fastsattBeløp: removeSpacesFromNumber(inntektUtenFormat),
          });
          fastsatteAndelsnr.push(andel.andelsnr);
        }
      }
    });
    if (listeMedFastsatteMaanedsinntekter.length > 0) {
      faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING);
      return {
        fastsattUtenInntektsmelding: { andelListe: listeMedFastsatteMaanedsinntekter },
      };
    }
    return {};
  }
  return {};
};


const transformValuesFrilans = (values, inntektVerdier, beregningsgrunnlag, fastsatteAndelsnr, faktaOmBeregningTilfeller) => {
  if (inntektVerdier === null) {
    return {};
  }
  const skalFastsetteInntektFrilans = values[finnFrilansFieldName()];
  if (skalFastsetteInntektFrilans) {
    const frilansAndel = beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
      .find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);
    if (!fastsatteAndelsnr.includes(frilansAndel.andelsnr) && frilansMottarYtelse(values)) {
      const frilansInntekt = inntektVerdier.find((field) => field.andelsnr === frilansAndel.andelsnr);
      fastsatteAndelsnr.push(frilansAndel.andelsnr);
      faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL);
      return {
        fastsettMaanedsinntektFL: { maanedsinntekt: removeSpacesFromNumber(frilansInntekt.fastsattBelop) },

      };
    }
    return {};
  }
  return {};
};

const transformValuesMottarYtelse = (values, faktaOmBeregning, faktaOmBeregningTilfeller) => {
  const ATAndelerUtenIM = faktaOmBeregning.vurderMottarYtelse.arbeidstakerAndelerUtenIM ? faktaOmBeregning.vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE);
  return {
    mottarYtelse: {
      frilansMottarYtelse: values[finnFrilansFieldName()],
      arbeidstakerUtenIMMottarYtelse: ATAndelerUtenIM.map((andel) => ({
        andelsnr: andel.andelsnr,
        mottarYtelse: values[utledArbeidsforholdFieldName(andel)],
      })),
    },
  };
};

const emptyArray = [];

export const getVurderMottarYtelse = createSelector(
  [(ownProps) => ownProps.beregningsgrunnlag.faktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.vurderMottarYtelse : undefined),
);

const mapStateToProps = (state, ownProps) => {
  const vurderInfo = getVurderMottarYtelse(ownProps);
  const erFrilans = vurderInfo && vurderInfo.erFrilans;
  const arbeidsforholdUtenIM = vurderInfo && vurderInfo.arbeidstakerAndelerUtenIM ? vurderInfo.arbeidstakerAndelerUtenIM : emptyArray;
  return ({
    arbeidsforholdUtenIM,
    erFrilans,
  });
};

const VurderMottarYtelseForm = connect(mapStateToProps)(VurderMottarYtelseFormImpl);


VurderMottarYtelseForm.buildInitialValues = (vurderMottarYtelse) => {
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

VurderMottarYtelseForm.transformValues = (values, inntektVerdier, faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr) => {
  const faktaOmBeregningTilfeller = [];
  const aktiveTilfeller = faktaOmBeregning.faktaOmBeregningTilfeller ? faktaOmBeregning.faktaOmBeregningTilfeller : [];
  if (!aktiveTilfeller.map(({ kode }) => kode).includes(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE)) {
    return {};
  }
  return ({
    ...transformValuesMottarYtelse(values, faktaOmBeregning, faktaOmBeregningTilfeller),
    ...transformValuesArbeidstakerUtenIM(values, inntektVerdier, faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr, faktaOmBeregningTilfeller),
    ...transformValuesFrilans(values, inntektVerdier, beregningsgrunnlag, fastsatteAndelsnr, faktaOmBeregningTilfeller),
    faktaOmBeregningTilfeller,
  });
};

VurderMottarYtelseForm.validate = (values, vurderMottarYtelse) => {
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

export default VurderMottarYtelseForm;
