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
  getBehandlingIsOnHold,
  hasReadOnlyBehandling,
} from 'behandlingFpsak/behandlingSelectors';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
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
import FastsettATFLInntektForm from './vurderOgFastsettATFL/forms/FastsettATFLInntektForm';
import FastsettBBFodendeKvinneForm from './besteberegningFodendeKvinne/FastsettBBFodendeKvinneForm';
import VurderEtterlonnSluttpakkeForm from './etterlønnSluttpakke/VurderEtterlonnSluttpakkeForm';
import FastsettEtterlonnSluttpakkeForm from './etterlønnSluttpakke/FastsettEtterlonnSluttpakkeForm';
import VurderMottarYtelseForm from './vurderOgFastsettATFL/forms/VurderMottarYtelseForm';


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

const getValidation = createSelector([mapStateToValidationProps], props => values => ({
  ...FastsettEndretBeregningsgrunnlag.validate(values, props.endringBGPerioder, props.aktivertePaneler, props.faktaOmBeregning, props.beregningsgrunnlag),
  ...TilstotendeYtelseForm.validate(values, props.aktivertePaneler),
  ...TilstotendeYtelseIKombinasjon.validate(values, props.endringBGPerioder, props.aktivertePaneler),
  ...getKunYtelseValidation(values, props.kunYtelse, props.endringBGPerioder, props.aktivertePaneler),
  ...VurderMottarYtelseForm.validate(values, props.vurderMottarYtelse),
}));

export const getValidationFaktaForATFLOgSN = createSelector([getAksjonspunkter, getValidation], (aksjonspunkter, validate) => (values) => {
  if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
    return validate(values);
  }
  return null;
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


const getFaktaPanels = (readOnly, formName, tilfeller, isAksjonspunktClosed, showTableCallback) => {
  const faktaPanels = [];
  let hasShownPanel = false;

  if (erTilstotendeYtelseIKombinasjon(tilfeller)) {
    return [<TilstotendeYtelseIKombinasjon
      key="kombinasjonTY"
      readOnly={readOnly}
      formName={formName}
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
            formName={formName}
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
          formName={formName}
          isAksjonspunktClosed={isAksjonspunktClosed}
          tilfeller={tilfeller}
        />
      </ElementWrapper>,
    );
  }
  if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE)) {
    faktaPanels.push(
      <ElementWrapper key="BBFodendeKvinne">
        {spacer(true)}
        <FastsettBBFodendeKvinneForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          tilfeller={tilfeller}
          formName={formName}
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
  setFaktaPanelForKunYtelse(faktaPanels, tilfeller, readOnly, formName, isAksjonspunktClosed);

  if (harKunTilstotendeYtelse(tilfeller)) {
    faktaPanels.push(
      <ElementWrapper key="TilstotendeYtelse">
        <TilstotendeYtelseForm
          readOnly={readOnly}
          formName={formName}
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
  formName,
  aktivePaneler,
  isAksjonspunktClosed,
  showTableCallback,
}) => (
  <div>
    {getFaktaPanels(readOnly, formName, aktivePaneler, isAksjonspunktClosed, showTableCallback).map(panelOrSpacer => panelOrSpacer)}
  </div>
);


FaktaForATFLOgSNPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aktivePaneler: PropTypes.arrayOf(PropTypes.string).isRequired,
  formName: PropTypes.string.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  showTableCallback: PropTypes.func.isRequired,
};

const kunYtelseTransform = (faktaOmBeregning, endringBGPerioder, aktivePaneler) => values => transformValuesForKunYtelse(values,
  faktaOmBeregning.kunYtelse, endringBGPerioder, aktivePaneler);

const endretBGTransform = endringBGPerioder => values => ({
  faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG],
  ...FastsettEndretBeregningsgrunnlag.transformValues(values, endringBGPerioder),
});

const atflSammeOrgTransform = (faktaOmBeregning, beregningsgrunnlag) => values => ({
  faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON],
  ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
    beregningsgrunnlag),
});

const besteberegningTransform = faktaOmBeregning => values => ({
  faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE],
  ...FastsettBBFodendeKvinneForm.transformValues(values, faktaOmBeregning),
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

const nyoppstartetFLTransform = (aktivePaneler, beregningsgrunnlag) => (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL);
  return {
    ...vurderFaktaValues,
    ...NyoppstartetFLForm.nyOppstartetFLInntekt(values, aktivePaneler, vurderFaktaValues, beregningsgrunnlag),
    ...NyoppstartetFLForm.transformValues(values),
  };
};

const fastsattLonnsendringTransform = (aktivePaneler, beregningsgrunnlag, faktaOmBeregning) => (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_LONNSENDRING);
  return {
    ...vurderFaktaValues,
    ...LonnsendringForm.lonnendringFastsatt(values, aktivePaneler, faktaOmBeregning, vurderFaktaValues, beregningsgrunnlag),
    ...LonnsendringForm.transformValues(values),
  };
};

const etterlonnSluttpakkeTransform = aktivePaneler => (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE);
  return {
    ...vurderFaktaValues,
    ...VurderEtterlonnSluttpakkeForm.etterlonnSluttpakkeInntekt(values, aktivePaneler, vurderFaktaValues),
    ...VurderEtterlonnSluttpakkeForm.transformValues(values),
  };
};

const vurderMottarYtelseTransform = (aktivePaneler, beregningsgrunnlag, faktaOmBeregning) => (vurderFaktaValues, values) => {
  vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE);
  return {
    ...vurderFaktaValues,
    ...VurderMottarYtelseForm.transformValues(values, faktaOmBeregning, aktivePaneler, vurderFaktaValues, beregningsgrunnlag),
  };
};

export const transformValues = (
  aktivePaneler,
  nyIArbTransform,
  kortvarigTransform,
  nyoppstartetTransform,
  lonnsendringTransform,
  etterlonnTransform,
  mottarYtelseTransform,
) => (vurderFaktaValues, values) => {
  let transformed = { ...vurderFaktaValues };
  aktivePaneler.forEach((kode) => {
    if (kode === faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET) {
      transformed = nyIArbTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD) {
      transformed = kortvarigTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL) {
      transformed = nyoppstartetTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_LONNSENDRING) {
      transformed = lonnsendringTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE) {
      transformed = etterlonnTransform(transformed, values);
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE) {
      transformed = mottarYtelseTransform(transformed, values);
    }
  });
  return transformed;
};

export const setInntektValues = (aktivePaneler, fatsettKunYtelseTransform, fastsettEndretTransform,
  fastsettATFLTransform, fastsettBBFodendeKvinneTransform) => (values) => {
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)) {
    return fatsettKunYtelseTransform(values);
  }
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    return fastsettEndretTransform(values);
  }
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)) {
    return fastsettATFLTransform(values);
  }
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE)) {
    return fastsettBBFodendeKvinneTransform(values);
  }
  return { faktaOmBeregningTilfeller: [] };
};

const setValuesForVurderFakta = (aktivePaneler, values, endringBGPerioder, kortvarigeArbeidsforhold, faktaOmBeregning, beregningsgrunnlag) => {
  const beg = values.begrunnelse;

  const vurderFaktaValues = {
    kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
    begrunnelse: beg === undefined ? null : beg,
    ...setInntektValues(
      aktivePaneler,
      kunYtelseTransform(faktaOmBeregning, endringBGPerioder, aktivePaneler),
      endretBGTransform(endringBGPerioder),
      atflSammeOrgTransform(faktaOmBeregning, beregningsgrunnlag),
      besteberegningTransform(faktaOmBeregning),
    )(values),
  };

  return [transformValues(aktivePaneler,
    nyIArbeidslivetTransform,
    kortvarigeArbeidsforholdTransform(kortvarigeArbeidsforhold),
    nyoppstartetFLTransform(aktivePaneler, beregningsgrunnlag),
    fastsattLonnsendringTransform(aktivePaneler, beregningsgrunnlag, faktaOmBeregning),
    etterlonnSluttpakkeTransform(aktivePaneler),
    vurderMottarYtelseTransform(aktivePaneler, beregningsgrunnlag, faktaOmBeregning))(vurderFaktaValues, values)];
};


export const transformValuesFaktaForATFLOgSN = createSelector(
  [getFaktaOmBeregningTilfellerKoder, getEndringBeregningsgrunnlagPerioder, getKortvarigeArbeidsforhold, getAksjonspunkter, getFaktaOmBeregning,
    getBeregningsgrunnlag],
  (aktivePaneler, endringBGPerioder, kortvarigeArbeidsforhold, aksjonspunkter, faktaOmBeregning, beregningsgrunnlag) => (values) => {
    let aksjonspunkterMedValues = [];
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
      aksjonspunkterMedValues = setValuesForVurderFakta(aktivePaneler, values, endringBGPerioder, kortvarigeArbeidsforhold,
        faktaOmBeregning, beregningsgrunnlag);
    }
    return aksjonspunkterMedValues;
  },
);

export const isReadOnly = createSelector([getRettigheter, getBehandlingIsOnHold, hasReadOnlyBehandling],
  (rettigheter, isOnHold, hasReadOnly) => !rettigheter.writeAccess.isEnabled || isOnHold || hasReadOnly);

export const buildInitialValuesFaktaForATFLOgSN = createSelector(
  [getEndringBeregningsgrunnlagPerioder, getBeregningsgrunnlag,
    getKortvarigeArbeidsforhold, getAksjonspunkter, getTilstøtendeYtelse, getKunYtelse,
    getFaktaOmBeregningTilfellerKoder, getBehandlingIsRevurdering, getVurderMottarYtelse,
    isReadOnly],
  (endringBGPerioder, beregningsgrunnlag, kortvarigeArbeidsforhold, aksjonspunkter, tilstotendeYtelse, kunYtelse,
    tilfeller, isRevurdering, vurderMottarYtelse, readOnly) => {
    const vurderFaktaAP = aksjonspunkter ? aksjonspunkter.find(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN) : undefined;
    if (!vurderFaktaAP) {
      return {};
    }
    return {
      ...TidsbegrensetArbeidsforholdForm.buildInitialValues(kortvarigeArbeidsforhold),
      ...NyIArbeidslivetSNForm.buildInitialValues(beregningsgrunnlag),
      ...FastsettEndretBeregningsgrunnlag.buildInitialValues(endringBGPerioder, tilfeller, readOnly),
      ...LonnsendringForm.buildInitialValues(beregningsgrunnlag),
      ...NyoppstartetFLForm.buildInitialValues(beregningsgrunnlag),
      ...FastsettATFLInntektForm.buildInitialValues(beregningsgrunnlag),
      ...FastsettBBFodendeKvinneForm.buildInitialValues(beregningsgrunnlag),
      ...TilstotendeYtelseForm.buildInitialValues(tilstotendeYtelse, endringBGPerioder),
      ...TilstotendeYtelseIKombinasjon.buildInitialValues(tilstotendeYtelse, endringBGPerioder, tilfeller),
      ...buildInitialValuesKunYtelse(kunYtelse, endringBGPerioder, isRevurdering, tilfeller),
      ...VurderEtterlonnSluttpakkeForm.buildInitialValues(beregningsgrunnlag, vurderFaktaAP),
      ...FastsettEtterlonnSluttpakkeForm.buildInitialValues(beregningsgrunnlag),
      ...VurderMottarYtelseForm.buildInitialValues(vurderMottarYtelse),
    };
  },
);


const mapStateToProps = (state) => {
  const aktivePaneler = getFaktaOmBeregningTilfellerKoder(state) ? getFaktaOmBeregningTilfellerKoder(state) : [];
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp.filter(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  return {
    isAksjonspunktClosed,
    aktivePaneler,
  };
};

export default connect(mapStateToProps)(FaktaForATFLOgSNPanelImpl);
