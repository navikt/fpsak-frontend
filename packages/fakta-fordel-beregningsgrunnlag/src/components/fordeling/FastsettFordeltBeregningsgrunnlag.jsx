import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import FordelBeregningsgrunnlagForm from './FordelBeregningsgrunnlagForm';

export const FastsettFordeltBeregningsgrunnlagImpl = ({
  isAksjonspunktClosed,
  readOnly,
  perioder,
  bgPerioder,
  beregningsgrunnlag,
  alleKodeverk,
  behandlingType,
}) => (
  <FordelBeregningsgrunnlagForm
    perioder={perioder}
    readOnly={readOnly}
    isAksjonspunktClosed={isAksjonspunktClosed}
    bgPerioder={bgPerioder}
    beregningsgrunnlag={beregningsgrunnlag}
    alleKodeverk={alleKodeverk}
    behandlingType={behandlingType}
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
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
};

const emptyArray = [];

const getFordelPerioder = (beregningsgrunnlag) => {
  if (beregningsgrunnlag && beregningsgrunnlag.faktaOmFordeling
    && beregningsgrunnlag.faktaOmFordeling.fordelBeregningsgrunnlag) {
    return beregningsgrunnlag.faktaOmFordeling.fordelBeregningsgrunnlag.fordelBeregningsgrunnlagPerioder;
  }
  return undefined;
};

const mapStateToProps = (state, ownProps) => {
  const bgPerioder = ownProps.beregningsgrunnlag.beregningsgrunnlagPeriode;
  const perioder = getFordelPerioder(ownProps.beregningsgrunnlag);
  return ({
    perioder: perioder || emptyArray,
    bgPerioder,
  });
};

export default connect(mapStateToProps)(FastsettFordeltBeregningsgrunnlagImpl);
