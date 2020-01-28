import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import {
  behandlingForm, FaktaSubmitButton, getKodeverknavnFn, FaktaBegrunnelseTextField,
} from '@fpsak-frontend/fp-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FastsettFordeltBeregningsgrunnlag from './fordeling/FastsettFordeltBeregningsgrunnlag';
import FordelingHelpText from './FordelingHelpText';
import fordelBeregningsgrunnlagAksjonspunkterPropType from '../propTypes/fordelBeregningsgrunnlagAksjonspunkterPropType';

const {
  FORDEL_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;


const FORM_NAME_FORDEL_BEREGNING = 'fordelBeregningsgrunnlagForm';


const findAksjonspunktMedBegrunnelse = (aksjonspunkter) => aksjonspunkter
  .find((ap) => ap.definisjon.kode === FORDEL_BEREGNINGSGRUNNLAG && ap.begrunnelse !== null);

export const BEGRUNNELSE_FORDELING_NAME = 'begrunnelseFordeling';

/**
 * FordelingForm
 *
 * Container komponent. Har ansvar for å sette opp Redux Formen for "avklar fakta om fordeling" panel.
 */
const FordelingFormImpl = ({
  readOnly,
  submittable,
  isAksjonspunktClosed,
  hasBegrunnelse,
  submitEnabled,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
  alleKodeverk,
  behandlingType,
  aksjonspunkter,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FordelingHelpText
      isAksjonspunktClosed={isAksjonspunktClosed}
      alleKodeverk={alleKodeverk}
      aksjonspunkter={aksjonspunkter}
      beregningsgrunnlag={beregningsgrunnlag}
    />
    <VerticalSpacer twentyPx />
    <FastsettFordeltBeregningsgrunnlag
      readOnly={readOnly}
      isAksjonspunktClosed={isAksjonspunktClosed}
      beregningsgrunnlag={beregningsgrunnlag}
      alleKodeverk={alleKodeverk}
      behandlingType={behandlingType}
    />
    <VerticalSpacer twentyPx />
    <FaktaBegrunnelseTextField
      name={BEGRUNNELSE_FORDELING_NAME}
      isDirty={formProps.dirty}
      isSubmittable={submittable}
      isReadOnly={readOnly}
      hasBegrunnelse={hasBegrunnelse}
    />
    <>
      <VerticalSpacer twentyPx />
      <FaktaSubmitButton
        formName={formProps.form}
        isSubmittable={submittable && submitEnabled}
        isReadOnly={readOnly}
        hasOpenAksjonspunkter={!isAksjonspunktClosed}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
    </>
  </form>
);

FordelingFormImpl.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  submitEnabled: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(fordelBeregningsgrunnlagAksjonspunkterPropType).isRequired,
  ...formPropTypes,
};

export const transformValuesFordelBeregning = createSelector(
  [(ownProps) => ownProps.beregningsgrunnlag,
    (ownProps) => ownProps.aksjonspunkter],
  (beregningsgrunnlag, aksjonspunkter) => (values) => {
    const bgPerioder = beregningsgrunnlag.beregningsgrunnlagPeriode;
    const fordelBGPerioder = beregningsgrunnlag.faktaOmFordeling.fordelBeregningsgrunnlag.fordelBeregningsgrunnlagPerioder;
    if (hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      const faktaBeregningValues = values;
      const begrunnelse = faktaBeregningValues[BEGRUNNELSE_FORDELING_NAME];
      return [{
        begrunnelse,
        kode: FORDEL_BEREGNINGSGRUNNLAG,
        ...FastsettFordeltBeregningsgrunnlag.transformValues(values, fordelBGPerioder, bgPerioder),
      }];
    }
    return {};
  },
);

export const buildInitialValuesFordelBeregning = createSelector(
  [(ownProps) => ownProps.beregningsgrunnlag,
    (ownProps) => ownProps.alleKodeverk,
    (ownProps) => ownProps.aksjonspunkter],
  (beregningsgrunnlag, alleKodeverk, aksjonspunkter) => {
    const fordelBGPerioder = beregningsgrunnlag.faktaOmFordeling.fordelBeregningsgrunnlag.fordelBeregningsgrunnlagPerioder;
    if (!hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      return {};
    }
    return ({
      ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter), BEGRUNNELSE_FORDELING_NAME),
      ...FastsettFordeltBeregningsgrunnlag.buildInitialValues(fordelBGPerioder, beregningsgrunnlag, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
    });
  },
);

export const getValidationFordelBeregning = createSelector(
  [(ownProps) => ownProps.beregningsgrunnlag,
    (ownProps) => ownProps.alleKodeverk,
    (ownProps) => ownProps.aksjonspunkter],
  (beregningsgrunnlag, alleKodeverk, aksjonspunkter) => (values) => {
    const fordelBGPerioder = beregningsgrunnlag.faktaOmFordeling.fordelBeregningsgrunnlag.fordelBeregningsgrunnlagPerioder;
    if (hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      return {
        ...FastsettFordeltBeregningsgrunnlag.validate(values, fordelBGPerioder,
          beregningsgrunnlag, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
      };
    }
    return null;
  },
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback(transformValuesFordelBeregning(initialOwnProps)(values));
  return (state, ownProps) => {
    const relevantAp = ownProps.aksjonspunkter.find((ap) => ap.definisjon.kode === FORDEL_BEREGNINGSGRUNNLAG);
    const isAksjonspunktClosed = !isAksjonspunktOpen(relevantAp.status.kode);
    const initialValues = buildInitialValuesFordelBeregning(ownProps);
    const hasBegrunnelse = initialValues && !!initialValues[BEGRUNNELSE_FORDELING_NAME];
    return {
      isAksjonspunktClosed,
      hasBegrunnelse,
      initialValues,
      validate: getValidationFordelBeregning(ownProps),
      onSubmit,
    };
  };
};


const FordelingForm = connect(mapStateToPropsFactory)(behandlingForm({ form: FORM_NAME_FORDEL_BEREGNING })(FordelingFormImpl));

export default FordelingForm;
