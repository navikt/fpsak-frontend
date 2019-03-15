import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import faktaOmBeregningTilfelle,
{
  vurderOgFastsettATFLTilfeller,
  harFastsettATFLInntektTilfelle,
} from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { createSelector, createStructuredSelector } from 'reselect';
import { getRettigheter } from 'navAnsatt/duck';
import {
  getAksjonspunkter,
  getBeregningsgrunnlag,
  getEndringBeregningsgrunnlagPerioder,
  getFaktaOmBeregning,
  getFaktaOmBeregningTilfellerKoder,
  getKortvarigeArbeidsforhold,
  getTilstøtendeYtelse,
  getKunYtelse,
  getBehandlingIsRevurdering,
  getVurderMottarYtelse,
  getVurderBesteberegning,
  getBehandlingIsOnHold,
  hasReadOnlyBehandling,
} from 'behandlingFpsak/src/behandlingSelectors';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import TilstotendeYtelseForm, { harKunTilstotendeYtelse } from './tilstøtendeYtelse/TilstøtendeYtelseForm';
import TilstotendeYtelseIKombinasjon, { erTilstotendeYtelseIKombinasjon } from './tilstøtendeYtelse/TilstotendeYtelseIKombinasjon';
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
import { getFormValuesForBeregning } from '../BeregningFormUtils';


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

export const getValidationFaktaForATFLOgSN = createSelector([mapStateToValidationProps], props => values => ({
  ...FastsettEndretBeregningsgrunnlag.validate(values, props.endringBGPerioder, props.aktivertePaneler, props.faktaOmBeregning, props.beregningsgrunnlag),
  ...TilstotendeYtelseForm.validate(values, props.aktivertePaneler),
  ...TilstotendeYtelseIKombinasjon.validate(values, props.endringBGPerioder, props.aktivertePaneler),
  ...getKunYtelseValidation(values, props.kunYtelse, props.endringBGPerioder, props.aktivertePaneler),
  ...VurderMottarYtelseForm.validate(values, props.vurderMottarYtelse),
  ...VurderBesteberegningForm.validate(values, props.aktivertePaneler),
}));

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


const getFaktaPanels = (readOnly, tilfeller, isAksjonspunktClosed, showTableCallback) => {
  const faktaPanels = [];
  let hasShownPanel = false;

  if (erTilstotendeYtelseIKombinasjon(tilfeller)) {
    return [<TilstotendeYtelseIKombinasjon
      key="kombinasjonTY"
      readOnly={readOnly}
      tilfeller={tilfeller}
      isAksjonspunktClosed={isAksjonspunktClosed}
      showTableCallback={showTableCallback}
    />];
  }
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
  if (tilfeller.filter(tilfelle => vurderOgFastsettATFLTilfeller.indexOf(tilfelle) !== -1).length !== 0) {
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
  }
  if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)
  && !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)
  && !harFastsettATFLInntektTilfelle(tilfeller)) {
    hasShownPanel = true;
    faktaPanels.push(
      <ElementWrapper key={faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG}>
        {spacer(hasShownPanel)}
        <FastsettEndretBeregningsgrunnlag
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
        />
      </ElementWrapper>,
    );
  }
  setFaktaPanelForKunYtelse(faktaPanels, tilfeller, readOnly, isAksjonspunktClosed);

  if (harKunTilstotendeYtelse(tilfeller)) {
    faktaPanels.push(
      <ElementWrapper key="TilstotendeYtelse">
        <TilstotendeYtelseForm
          readOnly={readOnly}
        />
      </ElementWrapper>,
    );
  }
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
  showTableCallback,
}) => (
  <div>
    {getFaktaPanels(readOnly, aktivePaneler, isAksjonspunktClosed, showTableCallback).map(panelOrSpacer => panelOrSpacer)}
  </div>
);


FaktaForATFLOgSNPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aktivePaneler: PropTypes.arrayOf(PropTypes.string).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  showTableCallback: PropTypes.func.isRequired,
};

const kunYtelseTransform = (faktaOmBeregning, endringBGPerioder, aktivePaneler) => values => transformValuesForKunYtelse(values,
  faktaOmBeregning.kunYtelse, endringBGPerioder, aktivePaneler);

const endretBGTransform = endringBGPerioder => values => ({
  faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG],
  ...FastsettEndretBeregningsgrunnlag.transformValues(values, endringBGPerioder),
});

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

export const setInntektValues = (aktivePaneler, fatsettKunYtelseTransform, fastsettEndretTransform,
  vurderOgFastsettATFLTransform) => (values) => {
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)) {
    return fatsettKunYtelseTransform(values);
  }
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    return fastsettEndretTransform(values);
  }
  return { ...vurderOgFastsettATFLTransform(values) };
};

const setValuesForVurderFakta = (aktivePaneler, values, endringBGPerioder, kortvarigeArbeidsforhold, faktaOmBeregning, beregningsgrunnlag) => {
  const vurderFaktaValues = setInntektValues(
    aktivePaneler,
    kunYtelseTransform(faktaOmBeregning, endringBGPerioder, aktivePaneler),
    endretBGTransform(endringBGPerioder),
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

export const isReadOnly = createSelector([getRettigheter, getBehandlingIsOnHold, hasReadOnlyBehandling],
  (rettigheter, isOnHold, hasReadOnly) => !rettigheter.writeAccess.isEnabled || isOnHold || hasReadOnly);

const getVurderFaktaAksjonspunkt = createSelector([getAksjonspunkter], aksjonspunkter => (aksjonspunkter
  ? aksjonspunkter.find(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN) : undefined));

export const getBuildInitialValuesFaktaForATFLOgSN = createSelector(
  [getEndringBeregningsgrunnlagPerioder, getBeregningsgrunnlag,
    getKortvarigeArbeidsforhold, getVurderFaktaAksjonspunkt, getTilstøtendeYtelse, getKunYtelse,
    getFaktaOmBeregningTilfellerKoder, getBehandlingIsRevurdering, getVurderMottarYtelse, getVurderBesteberegning,
    isReadOnly, getFormValuesForBeregning],
  (endringBGPerioder, beregningsgrunnlag, kortvarigeArbeidsforhold, vurderFaktaAP, tilstotendeYtelse, kunYtelse,
    tilfeller, isRevurdering, vurderMottarYtelse, vurderBesteberegning, readOnly, values) => () => ({
    ...TidsbegrensetArbeidsforholdForm.buildInitialValues(kortvarigeArbeidsforhold),
    ...NyIArbeidslivetSNForm.buildInitialValues(beregningsgrunnlag),
    ...FastsettEndretBeregningsgrunnlag.buildInitialValues(endringBGPerioder, tilfeller, readOnly),
    ...LonnsendringForm.buildInitialValues(beregningsgrunnlag),
    ...NyoppstartetFLForm.buildInitialValues(beregningsgrunnlag),
    ...TilstotendeYtelseForm.buildInitialValues(tilstotendeYtelse, endringBGPerioder),
    ...TilstotendeYtelseIKombinasjon.buildInitialValues(tilstotendeYtelse, endringBGPerioder, tilfeller),
    ...buildInitialValuesKunYtelse(kunYtelse, endringBGPerioder, isRevurdering, tilfeller),
    ...VurderEtterlonnSluttpakkeForm.buildInitialValues(beregningsgrunnlag, vurderFaktaAP),
    ...FastsettEtterlonnSluttpakkeForm.buildInitialValues(beregningsgrunnlag),
    ...VurderMottarYtelseForm.buildInitialValues(vurderMottarYtelse),
    ...VurderBesteberegningForm.buildInitialValues(vurderBesteberegning, tilfeller),
    ...VurderOgFastsettATFL.buildInitialValues(beregningsgrunnlag, values),
  }),
);


const mapStateToProps = (state) => {
  const aktivePaneler = getFaktaOmBeregningTilfellerKoder(state) ? getFaktaOmBeregningTilfellerKoder(state) : [];
  return {
    aktivePaneler,
  };
};

export default connect(mapStateToProps)(FaktaForATFLOgSNPanelImpl);
