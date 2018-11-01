import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/faktaOmBeregningTilfelle';
import { getFaktaOmBeregning } from 'behandling/behandlingSelectors';
import TilstotendeYtelseForm, { harKunTilstotendeYtelse } from 'fakta/components/beregning/tilstøtendeYtelse/TilstøtendeYtelseForm.jsx';
import InntektstabellPanel from '../InntektstabellPanel';
import NyIArbeidslivetSNForm from '../nyIArbeidslivet/NyIArbeidslivetSNForm';
import TidsbegrensetArbeidsforholdForm from '../tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import LonnsendringForm from '../vurderOgFastsettATFL/forms/LonnsendringForm';
import NyoppstartetFLForm from '../vurderOgFastsettATFL/forms/NyoppstartetFLForm';

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

const tilstotendeYtelseIKombinasjon = (readOnly, formName, tilfeller, isAksjonspunktClosed, manglerInntektsmelding) => (
  <InntektstabellPanel
    key="inntektstabell"
    hjelpeTekstId="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.TilstøtendeYtelseIKombinasjon"
    tabell={<TilstotendeYtelseForm readOnly={readOnly} key="tilstotendeYtelse" />}
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
}) => (
  <ElementWrapper>
    {tilstotendeYtelseIKombinasjon(readOnly, formName, tilfeller, isAksjonspunktClosed, manglerInntektsmelding)}
  </ElementWrapper>
);


TilstotendeYtelseIKombinasjonImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  tilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  formName: PropTypes.string.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  manglerInntektsmelding: PropTypes.bool,
};


TilstotendeYtelseIKombinasjonImpl.defaultProps = {
  manglerInntektsmelding: false,
};


const mapStateToProps = (state) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  let manglerInntektsmelding = false;
  if (faktaOmBeregning.atogFLISammeOrganisasjonListe && faktaOmBeregning.atogFLISammeOrganisasjonListe.length > 0) {
    manglerInntektsmelding = faktaOmBeregning.atogFLISammeOrganisasjonListe.find(forhold => !forhold.inntektPrMnd) !== undefined;
  }
  return {
    manglerInntektsmelding,
  };
};

export default connect(mapStateToProps)(TilstotendeYtelseIKombinasjonImpl);
