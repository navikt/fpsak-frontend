import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getEndringBeregningsgrunnlagPerioder, getFaktaOmBeregningTilfellerKoder } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import EndringBeregningsgrunnlagForm from './EndringBeregningsgrunnlagForm';
import { harKunTilfellerSomStøtterEndringBG, skalViseHelptextForEndretBg } from './EndretBeregningsgrunnlagUtils';

export const FastsettEndretBeregningsgrunnlagImpl = ({
  isAksjonspunktClosed,
  readOnly,
  perioder,
  skalHaEndretInformasjonIHeader,
}) => (
  <EndringBeregningsgrunnlagForm
    perioder={perioder}
    readOnly={readOnly}
    isAksjonspunktClosed={isAksjonspunktClosed}
    skalHaEndretInformasjonIHeader={skalHaEndretInformasjonIHeader}
  />
);

export const buildValues = (tilfeller, build) => {
  if (!harKunTilfellerSomStøtterEndringBG(tilfeller)) {
    return {};
  }
  return build();
};

FastsettEndretBeregningsgrunnlagImpl.buildInitialValues = (endringBGPerioder, tilfeller, readOnly) => {
  const build = () => EndringBeregningsgrunnlagForm
    .buildInitialValues(endringBGPerioder, readOnly);
  return buildValues(tilfeller, build);
};

FastsettEndretBeregningsgrunnlagImpl.transformValues = (values, endringBGPerioder) => EndringBeregningsgrunnlagForm.transformValues(values, endringBGPerioder);

export const validateValues = (tilfeller, validateBg) => {
  if (!harKunTilfellerSomStøtterEndringBG(tilfeller)) {
    return {};
  }
  return validateBg();
};

FastsettEndretBeregningsgrunnlagImpl.validate = (values, endringBGPerioder, tilfeller, faktaOmBeregning, beregningsgrunnlag) => {
  const validateBg = () => EndringBeregningsgrunnlagForm
    .validate(values, endringBGPerioder, faktaOmBeregning, beregningsgrunnlag);
  return validateValues(tilfeller, validateBg);
};

FastsettEndretBeregningsgrunnlagImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalHaEndretInformasjonIHeader: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const tilfeller = getFaktaOmBeregningTilfellerKoder(state);
  const perioder = getEndringBeregningsgrunnlagPerioder(state);
  return ({
    skalHaEndretInformasjonIHeader: !skalViseHelptextForEndretBg(tilfeller),
    perioder: perioder || [],
  });
};


export default connect(mapStateToProps)(FastsettEndretBeregningsgrunnlagImpl);
