import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getEndringBeregningsgrunnlagPerioder, getBeregningsgrunnlag } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import EndringBeregningsgrunnlagForm from './EndringBeregningsgrunnlagForm';

export const FastsettEndretBeregningsgrunnlagImpl = ({
  isAksjonspunktClosed,
  readOnly,
  perioder,
  bgPerioder,
}) => (
  <EndringBeregningsgrunnlagForm
    perioder={perioder}
    readOnly={readOnly}
    isAksjonspunktClosed={isAksjonspunktClosed}
    bgPerioder={bgPerioder}
  />
);


FastsettEndretBeregningsgrunnlagImpl.buildInitialValues = (endringBGPerioder, bg, getKodeverknavn) => (EndringBeregningsgrunnlagForm
    .buildInitialValues(endringBGPerioder, bg, getKodeverknavn));

FastsettEndretBeregningsgrunnlagImpl.transformValues = (values, endringBGPerioder, bgPerioder) => EndringBeregningsgrunnlagForm.transformValues(values,
  endringBGPerioder, bgPerioder);


FastsettEndretBeregningsgrunnlagImpl.validate = (values, endringBGPerioder, beregningsgrunnlag, getKodeverknavn) => (
  EndringBeregningsgrunnlagForm
    .validate(values, endringBGPerioder, beregningsgrunnlag, getKodeverknavn));

FastsettEndretBeregningsgrunnlagImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  bgPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const emptyArray = [];

const mapStateToProps = (state) => {
  const perioder = getEndringBeregningsgrunnlagPerioder(state);
  const bgPerioder = getBeregningsgrunnlag(state).beregningsgrunnlagPeriode;
  return ({
    perioder: perioder || emptyArray,
    bgPerioder,
  });
};


export default connect(mapStateToProps)(FastsettEndretBeregningsgrunnlagImpl);
