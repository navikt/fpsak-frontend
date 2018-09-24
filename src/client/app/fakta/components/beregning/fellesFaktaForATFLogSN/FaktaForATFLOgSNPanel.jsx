import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { createSelector } from 'reselect';
import {
  getAksjonspunkter, getBeregningsgrunnlag,
  getEndringBeregningsgrunnlagPerioder, getFaktaOmBeregningTilfellerKoder,
  getKortvarigeArbeidsforhold, getFaktaOmBeregning,
} from 'behandling/behandlingSelectors';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverk } from 'kodeverk/duck';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import NyoppstartetFLForm from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import EndringBeregningsgrunnlagForm, { getHelpTextsEndringBG } from './endringBeregningsgrunnlag/EndringBeregningsgrunnlagForm';
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
  if (aktivertePaneler
    && (!aktivertePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)
    || aktivertePaneler.length > 1)) {
    helpTexts.push(<FormattedMessage key="VurderTidsbegrensetArbeidsforhold" id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning" />);
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

const getFaktaPanels = (readOnly, formName, tilfeller, isAksjonspunktClosed, skalViseATFLTabell) => {
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
          skalViseATFLTabell={skalViseATFLTabell}
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
  skalViseATFLTabell,
}) => (
  <div>
    {getFaktaPanels(readOnly, formName, aktivePaneler, isAksjonspunktClosed, skalViseATFLTabell).map(panelOrSpacer => panelOrSpacer)}
  </div>
);


FaktaForATFLOgSNPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aktivePaneler: PropTypes.arrayOf(PropTypes.string).isRequired,
  formName: PropTypes.string.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalViseATFLTabell: PropTypes.bool.isRequired,
};

const setValuesForVurderFakta = (aktivePaneler, values, endringBGPerioder, kortvarigeArbeidsforhold, faktaOmBeregning) => {
  const beg = values.begrunnelse;
  let vurderFaktaValues = {
    kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
    begrunnelse: beg === undefined ? null : beg,
    faktaOmBeregningTilfeller: aktivePaneler,
  };
  aktivePaneler.forEach((kode) => {
    if (kode === faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET) {
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...NyIArbeidslivetSNForm.transformValues(values),
      };
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD) {
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...TidsbegrensetArbeidsforholdForm.transformValues(values, kortvarigeArbeidsforhold),
      };
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL) {
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...NyoppstartetFLForm.nyOppstartetFLInntekt(values, aktivePaneler),
        ...NyoppstartetFLForm.transformValues(values),
      };
    }
    if (kode === faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG) {
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...EndringBeregningsgrunnlagForm.transformValues(values, endringBGPerioder),
      };
    }
    if (kode === faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL && !aktivePaneler.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)) {
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning, kode),
      };
    }
    if (kode === faktaOmBeregningTilfelle.VURDER_LONNSENDRING) {
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...LonnsendringForm.lonnendringFastsatt(values, aktivePaneler, faktaOmBeregning),
        ...LonnsendringForm.transformValues(values),
      };
    }
    // Dersom vi har tilfellet for besteberegning skal alle inntekter fastsettes der
    if (kode === faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON) {
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning, kode),
      };
    }
    if (kode === faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE) {
      vurderFaktaValues = {
        ...vurderFaktaValues,
        ...FastsettBBFodendeKvinneForm.transformValues(values, faktaOmBeregning),
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
    getKortvarigeArbeidsforhold, getAksjonspunkter],
  (endringBGPerioder, beregningsgrunnlag, aktivitetstatuser, kortvarigeArbeidsforhold, aksjonspunkter) => {
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
