import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import { createSelector, createStructuredSelector } from 'reselect';
import {
  getAksjonspunkter,
  getBeregningsgrunnlag,
  getEndringBeregningsgrunnlagPerioder,
  getFaktaOmBeregning,
  getFaktaOmBeregningTilfellerKoder,
  getKortvarigeArbeidsforhold,
  getKunYtelse,
  getBehandlingIsRevurdering,
  getVurderMottarYtelse,
  getVurderBesteberegning,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import NyoppstartetFLForm from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import {
  setFaktaPanelForKunYtelse,
  transformValuesForKunYtelse,
  getKunYtelseValidation,
  buildInitialValuesKunYtelse,
} from './kunYtelse/FastsettBgKunYtelse';
import FastsettEndretBeregningsgrunnlag from './endringBeregningsgrunnlag/FastsettEndretBeregningsgrunnlag';
import {
  getHelpTextsEndringBG,
  skalViseHelptextForEndretBg,
} from './endringBeregningsgrunnlag/EndretBeregningsgrunnlagUtils';
import LonnsendringForm from './vurderOgFastsettATFL/forms/LonnsendringForm';
import NyIArbeidslivetSNForm from './nyIArbeidslivet/NyIArbeidslivetSNForm';
import VurderOgFastsettATFL from './vurderOgFastsettATFL/VurderOgFastsettATFL';
import VurderEtterlonnSluttpakkeForm from './etterlønnSluttpakke/VurderEtterlonnSluttpakkeForm';
import FastsettEtterlonnSluttpakkeForm from './etterlønnSluttpakke/FastsettEtterlonnSluttpakkeForm';
import VurderMottarYtelseForm from './vurderOgFastsettATFL/forms/VurderMottarYtelseForm';
import VurderBesteberegningForm from './besteberegningFodendeKvinne/VurderBesteberegningForm';


const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

export const mapStateToValidationProps = createStructuredSelector({
  aktivertePaneler: getFaktaOmBeregningTilfellerKoder,
  endringBGPerioder: getEndringBeregningsgrunnlagPerioder,
  kunYtelse: getKunYtelse,
  vurderMottarYtelse: getVurderMottarYtelse,
  faktaOmBeregning: getFaktaOmBeregning,
  beregningsgrunnlag: getBeregningsgrunnlag,
});

export const getValidationFaktaForATFLOgSN = createSelector([mapStateToValidationProps, getAlleKodeverk], (props, alleKodeverk) => (values) => {
  if (!values || !props.faktaOmBeregning || !props.beregningsgrunnlag || !props.aktivertePaneler) {
    return {};
  }
  return ({
    ...FastsettEndretBeregningsgrunnlag.validate(values, props.endringBGPerioder, props.aktivertePaneler, props.faktaOmBeregning,
      props.beregningsgrunnlag, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
    ...getKunYtelseValidation(values, props.kunYtelse, props.endringBGPerioder, props.aktivertePaneler),
    ...VurderMottarYtelseForm.validate(values, props.vurderMottarYtelse),
    ...VurderBesteberegningForm.validate(values, props.aktivertePaneler),
    ...VurderOgFastsettATFL.validate(values, props.aktivertePaneler, props.faktaOmBeregning, props.beregningsgrunnlag,
      getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
  });
});

export const lagHelpTextsForFakta = (aktivertePaneler) => {
  const helpTexts = [];
  if (!skalViseHelptextForEndretBg(aktivertePaneler)) {
    helpTexts.push(<FormattedMessage key="VurderFaktaForBeregningen" id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning" />);
  }
  return helpTexts;
};

export const getHelpTextsFaktaForATFLOgSN = createSelector(
  [getFaktaOmBeregningTilfellerKoder, getAksjonspunkter, getHelpTextsEndringBG],
  (aktivertePaneler, aksjonspunkter, helpTextEndringBG) => (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)
    ? helpTextEndringBG.concat(lagHelpTextsForFakta(aktivertePaneler))
    : []),
);

const spacer = (hasShownPanel) => {
  if (hasShownPanel) {
    return <VerticalSpacer twentyPx />;
  }
  return {};
};


const getFaktaPanels = (readOnly, tilfeller, isAksjonspunktClosed) => {
  const faktaPanels = [];
  let hasShownPanel = false;
  tilfeller.forEach((tilfelle) => {
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD) {
      hasShownPanel = true;
      faktaPanels.push(
        <ElementWrapper key={tilfelle}>
          <TidsbegrensetArbeidsforholdForm
            readOnly={readOnly}
            isAksjonspunktClosed={isAksjonspunktClosed}
          />
        </ElementWrapper>,
      );
    }
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET) {
      hasShownPanel = true;
      faktaPanels.push(
        <ElementWrapper key={tilfelle}>
          {spacer(hasShownPanel)}
          <NyIArbeidslivetSNForm
            readOnly={readOnly}
            isAksjonspunktClosed={isAksjonspunktClosed}
          />
        </ElementWrapper>,
      );
    }
    if (tilfelle === faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE) {
      hasShownPanel = true;
      faktaPanels.push(
        <ElementWrapper key={tilfelle}>
          {spacer(hasShownPanel)}
          <VurderEtterlonnSluttpakkeForm
            readOnly={readOnly}
            isAksjonspunktClosed={isAksjonspunktClosed}
          />
        </ElementWrapper>,
      );
    }
  });
  setFaktaPanelForKunYtelse(faktaPanels, tilfeller, readOnly, isAksjonspunktClosed);
  faktaPanels.push(
    <ElementWrapper key="VurderOgFastsettATFL">
      {spacer(true)}
      <VurderOgFastsettATFL
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
        tilfeller={tilfeller}
      />
    </ElementWrapper>,
  );
  return faktaPanels;
};

/**
 * FaktaForArbeidstakerFLOgSNPanel
 *
 * Container komponent.. Inneholder paneler for felles faktaavklaring for aksjonspunktet Vurder fakta for arbeidstaker, frilans og selvstendig næringsdrivende
 */
export const FaktaForATFLOgSNPanelImpl = ({
  readOnly,
  aktivePaneler,
  isAksjonspunktClosed,
}) => (
  <div>
    {getFaktaPanels(readOnly, aktivePaneler, isAksjonspunktClosed).map(panelOrSpacer => panelOrSpacer)}
  </div>
);


FaktaForATFLOgSNPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aktivePaneler: PropTypes.arrayOf(PropTypes.string).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

const kunYtelseTransform = (faktaOmBeregning, endringBGPerioder, aktivePaneler) => values => transformValuesForKunYtelse(values,
  faktaOmBeregning.kunYtelse, endringBGPerioder, aktivePaneler);

const nyIArbeidslivetTransform = (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET);
  return ({
    ...vurderFaktaValues,
    ...NyIArbeidslivetSNForm.transformValues(values),
  });
};

const kortvarigeArbeidsforholdTransform = kortvarigeArbeidsforhold => (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD);
  return ({
    ...vurderFaktaValues,
    ...TidsbegrensetArbeidsforholdForm.transformValues(values, kortvarigeArbeidsforhold),
  });
};

const etterlonnSluttpakkeTransform = aktivePaneler => (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE);
  return {
    ...vurderFaktaValues,
    ...VurderEtterlonnSluttpakkeForm.etterlonnSluttpakkeInntekt(values, aktivePaneler, vurderFaktaValues),
    ...VurderEtterlonnSluttpakkeForm.transformValues(values),
  };
};


export const transformValues = (
  aktivePaneler,
  nyIArbTransform,
  kortvarigTransform,
  etterlonnTransform,
) => (vurderFaktaValues, values) => {
  let transformed = { ...vurderFaktaValues };
  aktivePaneler.forEach((kode) => {
    if (kode === faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET) {
      transformed = nyIArbTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD) {
      transformed = kortvarigTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE) {
      transformed = etterlonnTransform(transformed, values);
    }
  });
  return transformed;
};

export const setInntektValues = (aktivePaneler, fatsettKunYtelseTransform,
  vurderOgFastsettATFLTransform) => (values) => {
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)) {
    return fatsettKunYtelseTransform(values);
  }
  return { ...vurderOgFastsettATFLTransform(values) };
};

const setValuesForVurderFakta = (aktivePaneler, values, endringBGPerioder, kortvarigeArbeidsforhold, faktaOmBeregning, beregningsgrunnlag) => {
  const vurderFaktaValues = setInntektValues(
    aktivePaneler,
    kunYtelseTransform(faktaOmBeregning, endringBGPerioder, aktivePaneler),
    VurderOgFastsettATFL.transformValues(faktaOmBeregning, beregningsgrunnlag),
  )(values);
  return transformValues(aktivePaneler,
    nyIArbeidslivetTransform,
    kortvarigeArbeidsforholdTransform(kortvarigeArbeidsforhold),
    etterlonnSluttpakkeTransform(aktivePaneler))(vurderFaktaValues, values);
};


export const transformValuesFaktaForATFLOgSN = createSelector(
  [getFaktaOmBeregningTilfellerKoder,
    getEndringBeregningsgrunnlagPerioder,
    getKortvarigeArbeidsforhold,
    getFaktaOmBeregning,
    getBeregningsgrunnlag],
  (aktivePaneler,
    endringBGPerioder,
    kortvarigeArbeidsforhold,
    faktaOmBeregning,
    beregningsgrunnlag) => values => (
    setValuesForVurderFakta(aktivePaneler, values, endringBGPerioder, kortvarigeArbeidsforhold,
      faktaOmBeregning, beregningsgrunnlag)
  ),
);

const getVurderFaktaAksjonspunkt = createSelector([getAksjonspunkter], aksjonspunkter => (aksjonspunkter
  ? aksjonspunkter.find(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN) : undefined));

export const getBuildInitialValuesFaktaForATFLOgSN = createSelector(
  [getEndringBeregningsgrunnlagPerioder, getBeregningsgrunnlag,
    getKortvarigeArbeidsforhold, getVurderFaktaAksjonspunkt, getKunYtelse,
    getFaktaOmBeregningTilfellerKoder, getBehandlingIsRevurdering, getVurderMottarYtelse, getVurderBesteberegning, getAlleKodeverk],
  (endringBGPerioder, beregningsgrunnlag, kortvarigeArbeidsforhold, vurderFaktaAP, kunYtelse,
    tilfeller, isRevurdering, vurderMottarYtelse, vurderBesteberegning, alleKodeverk) => () => ({
    ...TidsbegrensetArbeidsforholdForm.buildInitialValues(kortvarigeArbeidsforhold),
    ...NyIArbeidslivetSNForm.buildInitialValues(beregningsgrunnlag),
    ...FastsettEndretBeregningsgrunnlag.buildInitialValues(endringBGPerioder, tilfeller, beregningsgrunnlag, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
    ...LonnsendringForm.buildInitialValues(beregningsgrunnlag),
    ...NyoppstartetFLForm.buildInitialValues(beregningsgrunnlag),
    ...buildInitialValuesKunYtelse(kunYtelse, endringBGPerioder, isRevurdering, tilfeller, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
    ...VurderEtterlonnSluttpakkeForm.buildInitialValues(beregningsgrunnlag, vurderFaktaAP),
    ...FastsettEtterlonnSluttpakkeForm.buildInitialValues(beregningsgrunnlag),
    ...VurderMottarYtelseForm.buildInitialValues(vurderMottarYtelse),
    ...VurderBesteberegningForm.buildInitialValues(vurderBesteberegning, tilfeller),
    ...VurderOgFastsettATFL.buildInitialValues(beregningsgrunnlag, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
  }),
);


const mapStateToProps = (state) => {
  const aktivePaneler = getFaktaOmBeregningTilfellerKoder(state) ? getFaktaOmBeregningTilfellerKoder(state) : [];
  return {
    aktivePaneler,
  };
};

export default connect(mapStateToProps)(FaktaForATFLOgSNPanelImpl);
