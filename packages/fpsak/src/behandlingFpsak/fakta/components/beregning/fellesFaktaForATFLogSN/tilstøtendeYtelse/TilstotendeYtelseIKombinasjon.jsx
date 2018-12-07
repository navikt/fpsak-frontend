import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { getFaktaOmBeregning } from 'behandlingFpsak/behandlingSelectors';
import InntektstabellPanel from '../InntektstabellPanel';
import NyIArbeidslivetSNForm from '../nyIArbeidslivet/NyIArbeidslivetSNForm';
import TilstotendeYtelseForm, { harKunTilstotendeYtelse } from './TilstøtendeYtelseForm';
import TidsbegrensetArbeidsforholdForm from '../tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import LonnsendringForm from '../vurderOgFastsettATFL/forms/LonnsendringForm';
import NyoppstartetFLForm from '../vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import TilstotendeYtelseOgEndretBeregningsgrunnlag from './TilstotendeYtelseOgEndretBeregningsgrunnlag';

export const erTilstotendeYtelseIKombinasjon = tilfeller => tilfeller.includes(faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE)
  && !harKunTilstotendeYtelse(tilfeller);


const getChildren = (tilfeller, readOnly, isAksjonspunktClosed, manglerInntektsmelding, formName) => {
  const children = [];
  if (tilfeller.includes(faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD)) {
    children.push(<TidsbegrensetArbeidsforholdForm readOnly={readOnly} isAksjonspunktClosed={isAksjonspunktClosed} key="kortvarig" />);
  }
  if (tilfeller.includes(faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET)) {
    children.push(<NyIArbeidslivetSNForm readOnly={readOnly} isAksjonspunktClosed={isAksjonspunktClosed} key="nyIArbeidslivet" />);
  }
  if (tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)) {
    children.push(<LonnsendringForm
      readOnly={readOnly}
      isAksjonspunktClosed={isAksjonspunktClosed}
      formName={formName}
      tilfeller={tilfeller}
      manglerIM={manglerInntektsmelding}
      skalViseInntektstabell={false}
      key="lonnsendring"
    />);
  }
  if (tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)) {
    children.push(<NyoppstartetFLForm
      readOnly={readOnly}
      isAksjonspunktClosed={isAksjonspunktClosed}
      formName={formName}
      tilfeller={tilfeller}
      skalViseInntektstabell={false}
      manglerIM={manglerInntektsmelding}
      key="vurderNyoppstartetFL"
    />);
  }
  return children;
};

const getTilstotendeYtelseForm = (tilfeller, readOnly, formName, showTableCallback, isAksjonspunktClosed) => {
  if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    return (
      <TilstotendeYtelseOgEndretBeregningsgrunnlag
        key="TilstotendeYtelseOgEndretBG"
        readOnly={readOnly}
        formName={formName}
        showTableCallback={showTableCallback}
        isAksjonspunktClosed={isAksjonspunktClosed}
      />
    );
  }
  return <TilstotendeYtelseForm readOnly={readOnly} formName={formName} key="tilstotendeYtelse" />;
};

const tilstotendeYtelseIKombinasjon = (readOnly, formName, tilfeller, isAksjonspunktClosed, manglerInntektsmelding, showTableCallback) => (
  <InntektstabellPanel
    key="inntektstabell"
    tabell={getTilstotendeYtelseForm(tilfeller, readOnly, formName, showTableCallback, isAksjonspunktClosed)}
  >
    {getChildren(tilfeller, readOnly, isAksjonspunktClosed, manglerInntektsmelding, formName)}
  </InntektstabellPanel>
);


/**
 * TilstotendeYtelseIKombinasjon
 *
 * Komponent som håndterer kombinasjoner av fakta om beregning tilfeller sammen med tilstøtende ytelse
 */
export const TilstotendeYtelseIKombinasjonImpl = ({
  readOnly,
  formName,
  tilfeller,
  isAksjonspunktClosed,
  manglerInntektsmelding,
  showTableCallback,
}) => (
  <ElementWrapper>
    {tilstotendeYtelseIKombinasjon(readOnly, formName, tilfeller, isAksjonspunktClosed, manglerInntektsmelding, showTableCallback)}
  </ElementWrapper>
);


TilstotendeYtelseIKombinasjonImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  tilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  formName: PropTypes.string.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  manglerInntektsmelding: PropTypes.bool,
  showTableCallback: PropTypes.func,
};


TilstotendeYtelseIKombinasjonImpl.defaultProps = {
  manglerInntektsmelding: false,
  showTableCallback: undefined,
};

TilstotendeYtelseIKombinasjonImpl.buildInitialValues = (tilstotendeYtelse, endringBGPerioder, tilfeller) => {
  if (!harKunTilstotendeYtelse(tilfeller) && tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    return ({
      ...TilstotendeYtelseOgEndretBeregningsgrunnlag.buildInitialValues(tilstotendeYtelse, endringBGPerioder),
    });
  }
  return {};
};

TilstotendeYtelseIKombinasjonImpl.validate = (values, endringBGPerioder, tilfeller) => {
  if (tilfeller.includes(faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE) && tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    return TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
  }
  return null;
};

TilstotendeYtelseIKombinasjonImpl.transformValues = (values, faktor, gjelderBesteberegning, endringBGPerioder, tilfeller) => {
  if (tilfeller.includes(faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE) && tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    return TilstotendeYtelseOgEndretBeregningsgrunnlag.transformValues(values, faktor, gjelderBesteberegning, endringBGPerioder);
  }
  return {};
};


const mapStateToProps = (state) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  let manglerInntektsmelding = false;
  if (faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe && faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.length > 0) {
    manglerInntektsmelding = faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.find(forhold => !forhold.inntektPrMnd) !== undefined;
  }
  return {
    manglerInntektsmelding,
  };
};

export default connect(mapStateToProps)(TilstotendeYtelseIKombinasjonImpl);
