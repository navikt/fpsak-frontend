import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { createSelector } from 'reselect';
import {
  getAksjonspunkter, getBeregningsgrunnlag,
  getEndringBeregningsgrunnlagPerioder, getFaktaOmBeregningTilfellerKoder,
  getKortvarigeArbeidsforhold, getFaktaOmBeregning, getTilstøtendeYtelse,
} from 'behandling/behandlingSelectors';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverk } from 'kodeverk/duck';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import TilstotendeYtelseForm, { harKunTilstotendeYtelse, getHelpTextsTY } from './tilstøtendeYtelse/TilstøtendeYtelseForm';
import TilstotendeYtelseIKombinasjon, { erTilstotendeYtelseIKombinasjon } from './tilstøtendeYtelse/TilstotendeYtelseIKombinasjon';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import NyoppstartetFLForm from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import EndringBeregningsgrunnlagForm, { getHelpTextsEndringBG, harKunEndringBG } from './endringBeregningsgrunnlag/EndringBeregningsgrunnlagForm';
import LonnsendringForm from './vurderOgFastsettATFL/forms/LonnsendringForm';
import NyIArbeidslivetSNForm from './nyIArbeidslivet/NyIArbeidslivetSNForm';
import VurderOgFastsettATFL from './vurderOgFastsettATFL/VurderOgFastsettATFL';
import FastsettATFLInntektForm from './vurderOgFastsettATFL/forms/FastsettATFLInntektForm';
import FastsettBBFodendeKvinneForm from './besteberegningFodendeKvinne/FastsettBBFodendeKvinneForm';


const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const vurderOgFastsettATFLTilfeller = [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
  faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
  faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

export const getValidationFaktaForATFLOgSN = createSelector(
  [getFaktaOmBeregningTilfellerKoder, getEndringBeregningsgrunnlagPerioder, getAksjonspunkter],
  (aktivertePaneler, endringBGPerioder, aksjonspunkter) => (values) => {
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && aktivertePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
      return { ...EndringBeregningsgrunnlagForm.validate(values, endringBGPerioder) };
    }
    return null;
  },
);


export const lagHelpTextsForFakta = (aktivertePaneler) => {
  const helpTexts = [];
  if (!harKunEndringBG(aktivertePaneler) && !harKunTilstotendeYtelse(aktivertePaneler)) {
    helpTexts.push(<FormattedMessage key="VurderTidsbegrensetArbeidsforhold" id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning" />);
  }
  return helpTexts;
};

export const getHelpTextsFaktaForATFLOgSN = createSelector(
  [getFaktaOmBeregningTilfellerKoder, getAksjonspunkter, getHelpTextsEndringBG, getHelpTextsTY],
  (aktivertePaneler, aksjonspunkter, helpTextEndringBG, helpTextTY) => (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)
    ? helpTextTY.concat(helpTextEndringBG.concat(lagHelpTextsForFakta(aktivertePaneler)))
    : []),
);

const spacer = (hasShownPanel) => {
  if (hasShownPanel) {
    return <VerticalSpacer twentyPx />;
  }
  return {};
};


const getFaktaPanels = (readOnly, formName, tilfeller, isAksjonspunktClosed) => {
  const faktaPanels = [];
  let hasShownPanel = false;

  if (erTilstotendeYtelseIKombinasjon(tilfeller)) {
    return [<TilstotendeYtelseIKombinasjon
      key="kombinasjonTY"
      readOnly={readOnly}
      formName={formName}
      tilfeller={tilfeller}
      isAksjonspunktClosed={isAksjonspunktClosed}
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
    if (tilfelle === faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG) {
      hasShownPanel = true;
      faktaPanels.push(
        <ElementWrapper key={tilfelle}>
          {spacer(hasShownPanel)}
          <EndringBeregningsgrunnlagForm
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
  formName,
  aktivePaneler,
  isAksjonspunktClosed,
}) => (
  <div>
    {getFaktaPanels(readOnly, formName, aktivePaneler, isAksjonspunktClosed).map(panelOrSpacer => panelOrSpacer)}
  </div>
);


FaktaForATFLOgSNPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aktivePaneler: PropTypes.arrayOf(PropTypes.string).isRequired,
  formName: PropTypes.string.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

export const setInntektValues = (values, faktaOmBeregning, aktivePaneler) => {
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE)) {
    const faktor = faktaOmBeregning.tilstøtendeYtelse.skalReduseres ? parseInt(faktaOmBeregning.tilstøtendeYtelse.dekningsgrad, 10) / 100 : 1;
    return {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE],
      ...TilstotendeYtelseForm.transformValues(values, faktor, faktaOmBeregning.tilstøtendeYtelse.erBesteberegning),
    };
  }
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)) {
    return {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON],
      ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON),
    };
  }
  if (aktivePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE)) {
    return {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE],
      ...FastsettBBFodendeKvinneForm.transformValues(values, faktaOmBeregning),
    };
  }
  return { faktaOmBeregningTilfeller: [] };
};


const setValuesForVurderFakta = (aktivePaneler, values, endringBGPerioder, kortvarigeArbeidsforhold, faktaOmBeregning) => {
  const beg = values.begrunnelse;
  let vurderFaktaValues = {
    kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
    begrunnelse: beg === undefined ? null : beg,
    ...setInntektValues(values, faktaOmBeregning, aktivePaneler),
  };

  aktivePaneler.forEach((kode) => {
    if (kode === faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET) {
      vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET);
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...NyIArbeidslivetSNForm.transformValues(values),
      };
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD) {
      vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD);
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...TidsbegrensetArbeidsforholdForm.transformValues(values, kortvarigeArbeidsforhold),
      };
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL) {
      vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL);
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...NyoppstartetFLForm.nyOppstartetFLInntekt(values, aktivePaneler),
        ...NyoppstartetFLForm.transformValues(values),
      };
    }
    if (kode === faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG) {
      vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG);
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...EndringBeregningsgrunnlagForm.transformValues(values, endringBGPerioder),
      };
    }
    if (kode === faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL && !aktivePaneler.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)) {
      vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL);
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning, kode),
      };
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_LONNSENDRING) {
      vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.VURDER_LONNSENDRING);
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...LonnsendringForm.lonnendringFastsatt(values, aktivePaneler, faktaOmBeregning),
        ...LonnsendringForm.transformValues(values),
      };
    }
  });
  return [vurderFaktaValues];
};


export const transformValuesFaktaForATFLOgSN = createSelector(
  [getFaktaOmBeregningTilfellerKoder, getEndringBeregningsgrunnlagPerioder, getKortvarigeArbeidsforhold, getAksjonspunkter, getFaktaOmBeregning],
  (aktivePaneler, endringBGPerioder, kortvarigeArbeidsforhold, aksjonspunkter, faktaOmBeregning) => (values) => {
    let aksjonspunkterMedValues = [];
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
      aksjonspunkterMedValues = setValuesForVurderFakta(aktivePaneler, values, endringBGPerioder, kortvarigeArbeidsforhold, faktaOmBeregning);
    }
    return aksjonspunkterMedValues;
  },
);


export const buildInitialValuesFaktaForATFLOgSN = createSelector(
  [getEndringBeregningsgrunnlagPerioder, getBeregningsgrunnlag, getKodeverk(kodeverkTyper.AKTIVITET_STATUS),
    getKortvarigeArbeidsforhold, getAksjonspunkter, getTilstøtendeYtelse],
  (endringBGPerioder, beregningsgrunnlag, aktivitetstatuser, kortvarigeArbeidsforhold, aksjonspunkter, tilstotendeYtelse) => {
    if (!hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
      return {};
    }
    return {
      ...TidsbegrensetArbeidsforholdForm.buildInitialValues(kortvarigeArbeidsforhold),
      ...NyIArbeidslivetSNForm.buildInitialValues(beregningsgrunnlag),
      ...EndringBeregningsgrunnlagForm.buildInitialValues(endringBGPerioder, aktivitetstatuser),
      ...LonnsendringForm.buildInitialValues(beregningsgrunnlag),
      ...NyoppstartetFLForm.buildInitialValues(beregningsgrunnlag),
      ...FastsettATFLInntektForm.buildInitialValues(beregningsgrunnlag),
      ...FastsettBBFodendeKvinneForm.buildInitialValues(beregningsgrunnlag),
      ...TilstotendeYtelseForm.buildInitialValues(tilstotendeYtelse, aktivitetstatuser),
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
