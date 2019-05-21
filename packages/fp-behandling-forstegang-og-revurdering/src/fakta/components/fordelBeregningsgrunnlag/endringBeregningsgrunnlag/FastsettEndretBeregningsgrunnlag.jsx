import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getEndringBeregningsgrunnlagPerioder } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import EndringBeregningsgrunnlagForm from './EndringBeregningsgrunnlagForm';

export const FastsettEndretBeregningsgrunnlagImpl = ({
  isAksjonspunktClosed,
  readOnly,
  perioder,
}) => (
  <EndringBeregningsgrunnlagForm
    perioder={perioder}
    readOnly={readOnly}
    isAksjonspunktClosed={isAksjonspunktClosed}
  />
);


FastsettEndretBeregningsgrunnlagImpl.buildInitialValues = (endringBGPerioder, bg, getKodeverknavn) => (EndringBeregningsgrunnlagForm
    .buildInitialValues(endringBGPerioder, bg, getKodeverknavn));

FastsettEndretBeregningsgrunnlagImpl.transformValues = (values, endringBGPerioder) => EndringBeregningsgrunnlagForm.transformValues(values,
  endringBGPerioder);


FastsettEndretBeregningsgrunnlagImpl.validate = (values, endringBGPerioder, beregningsgrunnlag, getKodeverknavn) => (
  EndringBeregningsgrunnlagForm
    .validate(values, endringBGPerioder, beregningsgrunnlag, getKodeverknavn));

FastsettEndretBeregningsgrunnlagImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const perioder = getEndringBeregningsgrunnlagPerioder(state);
  return ({
    perioder: perioder || [],
  });
};


export default connect(mapStateToProps)(FastsettEndretBeregningsgrunnlagImpl);
