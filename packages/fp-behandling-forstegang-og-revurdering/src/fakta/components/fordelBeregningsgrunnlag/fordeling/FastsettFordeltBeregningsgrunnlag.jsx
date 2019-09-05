import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBeregningsgrunnlag, getFordelBeregningsgrunnlagPerioder } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import FordelBeregningsgrunnlagForm from './FordelBeregningsgrunnlagForm';

export const FastsettFordeltBeregningsgrunnlagImpl = ({
  isAksjonspunktClosed,
  readOnly,
  perioder,
  bgPerioder,
}) => (
  <FordelBeregningsgrunnlagForm
    perioder={perioder}
    readOnly={readOnly}
    isAksjonspunktClosed={isAksjonspunktClosed}
    bgPerioder={bgPerioder}
  />
);


FastsettFordeltBeregningsgrunnlagImpl.buildInitialValues = (fordelBGPerioder, bg, getKodeverknavn) => (FordelBeregningsgrunnlagForm
  .buildInitialValues(fordelBGPerioder, bg, getKodeverknavn));

FastsettFordeltBeregningsgrunnlagImpl.transformValues = (values, fordelBGPerioder, bgPerioder) => FordelBeregningsgrunnlagForm.transformValues(values,
  fordelBGPerioder, bgPerioder);


FastsettFordeltBeregningsgrunnlagImpl.validate = (values, fordelBGPerioder, beregningsgrunnlag, getKodeverknavn) => (
  FordelBeregningsgrunnlagForm
    .validate(values, fordelBGPerioder, beregningsgrunnlag, getKodeverknavn));

FastsettFordeltBeregningsgrunnlagImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  bgPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const emptyArray = [];

const mapStateToProps = (state) => {
  const perioder = getFordelBeregningsgrunnlagPerioder(state);
  const bgPerioder = getBeregningsgrunnlag(state).beregningsgrunnlagPeriode;
  return ({
    perioder: perioder || emptyArray,
    bgPerioder,
  });
};


export default connect(mapStateToProps)(FastsettFordeltBeregningsgrunnlagImpl);
