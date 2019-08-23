import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import {
  getEndringBeregningsgrunnlagPerioder,
  getBeregningsgrunnlag,
  getBeregningsgrunnlagPerioder,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import FastsettEndretBeregningsgrunnlag from './endringBeregningsgrunnlag/FastsettEndretBeregningsgrunnlag';
import FordelingHelpText from './FordelingHelpText';

const {
  FORDEL_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;


const FORM_NAME_FORDEL_BEREGNING = 'fordelBeregningsgrunnlagForm';


const findAksjonspunktMedBegrunnelse = aksjonspunkter => aksjonspunkter
  .find(ap => ap.definisjon.kode === FORDEL_BEREGNINGSGRUNNLAG && ap.begrunnelse !== null);

export const BEGRUNNELSE_FORDELING_NAME = 'begrunnelseFordeling';

/**
 * FordelingForm
 *
 * Container komponent. Har ansvar for å sette opp Redux Formen for "avklar fakta om fordeling" panel.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
const FordelingFormImpl = ({
  readOnly,
  submittable,
  isAksjonspunktClosed,
  hasBegrunnelse,
  submitEnabled,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FordelingHelpText isAksjonspunktClosed={isAksjonspunktClosed} />
    <VerticalSpacer twentyPx />
    <FastsettEndretBeregningsgrunnlag
      readOnly={readOnly}
      isAksjonspunktClosed={isAksjonspunktClosed}
    />
    <VerticalSpacer twentyPx />
    <FaktaBegrunnelseTextField
      name={BEGRUNNELSE_FORDELING_NAME}
      isDirty={formProps.dirty}
      isSubmittable={submittable}
      isReadOnly={readOnly}
      hasBegrunnelse={hasBegrunnelse}
    />
    <React.Fragment>
      <VerticalSpacer twentyPx />
      <FaktaSubmitButton
        formName={formProps.form}
        isSubmittable={submittable && submitEnabled}
        isReadOnly={readOnly}
        hasOpenAksjonspunkter={!isAksjonspunktClosed}
      />
    </React.Fragment>
  </form>
);

FordelingFormImpl.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  submitEnabled: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  ...formPropTypes,
};

export const transformValuesFordelBeregning = createSelector(
  [behandlingSelectors.getAksjonspunkter, getEndringBeregningsgrunnlagPerioder, getBeregningsgrunnlagPerioder],
  (aksjonspunkter, endringBGPerioder, bgPerioder) => (values) => {
    if (hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      const faktaBeregningValues = values;
      const begrunnelse = faktaBeregningValues[BEGRUNNELSE_FORDELING_NAME];
      return [{
        begrunnelse,
        kode: FORDEL_BEREGNINGSGRUNNLAG,
        ...FastsettEndretBeregningsgrunnlag.transformValues(values, endringBGPerioder, bgPerioder),
      }];
    }
    return {};
  },
);

export const buildInitialValuesFordelBeregning = createSelector(
  [getEndringBeregningsgrunnlagPerioder, getBeregningsgrunnlag, getAlleKodeverk, behandlingSelectors.getAksjonspunkter],
  (endringBGPerioder, beregningsgrunnlag, alleKodeverk, aksjonspunkter) => {
    if (!hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      return {};
    }
    return ({
      ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter), BEGRUNNELSE_FORDELING_NAME),
      ...FastsettEndretBeregningsgrunnlag.buildInitialValues(endringBGPerioder, beregningsgrunnlag, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
    });
  },
);

export const mapStateToValidationProps = createStructuredSelector({
  endringBGPerioder: getEndringBeregningsgrunnlagPerioder,
  beregningsgrunnlag: getBeregningsgrunnlag,
});

export const getValidationFordelBeregning = createSelector([mapStateToValidationProps, getAlleKodeverk, behandlingSelectors.getAksjonspunkter],
  (props, alleKodeverk, aksjonspunkter) => (values) => {
    if (hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      return {
        ...FastsettEndretBeregningsgrunnlag.validate(values, props.endringBGPerioder,
          props.beregningsgrunnlag, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
      };
    }
    return null;
  });


const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback(transformValuesFordelBeregning(initialState)(values));
  return (state) => {
    const isOnHold = behandlingSelectors.getBehandlingIsOnHold(state);
    const alleAp = behandlingSelectors.getAksjonspunkter(state);
    const relevantAp = alleAp.find(ap => ap.definisjon.kode === FORDEL_BEREGNINGSGRUNNLAG);
    const isAksjonspunktClosed = !isAksjonspunktOpen(relevantAp.status.kode);
    const initialValues = buildInitialValuesFordelBeregning(state);
    const hasBegrunnelse = initialValues && !!initialValues[BEGRUNNELSE_FORDELING_NAME];
    return {
      isOnHold,
      isAksjonspunktClosed,
      hasBegrunnelse,
      initialValues,
      aksjonspunkter: alleAp,
      validate: getValidationFordelBeregning(state),
      onSubmit,
    };
  };
};


const FordelingForm = connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({ form: FORM_NAME_FORDEL_BEREGNING })(FordelingFormImpl));

export default FordelingForm;
