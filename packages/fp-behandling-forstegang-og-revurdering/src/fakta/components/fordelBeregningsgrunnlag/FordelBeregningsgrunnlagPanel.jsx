import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector, createStructuredSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn, faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import { FaktaEkspandertpanel, withDefaultToggling, FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';

import {
 getBehandlingIsOnHold, getEndringBeregningsgrunnlagPerioder,
  getBeregningsgrunnlag, getAksjonspunkter, getBeregningsgrunnlagPerioder,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import FastsettEndretBeregningsgrunnlag from './endringBeregningsgrunnlag/FastsettEndretBeregningsgrunnlag';
import FordelingHelpText from './FordelingHelpText';

const {
  FORDEL_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;


const FORM_NAME_FORDEL_BEREGNING = 'fordelBeregningsgrunnlagForm';

const faktaOmFordelingAksjonspunkter = [FORDEL_BEREGNINGSGRUNNLAG];

const findAksjonspunktMedBegrunnelse = aksjonspunkter => aksjonspunkter
  .find(ap => ap.definisjon.kode === FORDEL_BEREGNINGSGRUNNLAG && ap.begrunnelse !== null);

export const BEGRUNNELSE_FORDELING_NAME = 'begrunnelseFordeling';

/**
 * FordelBeregningsgrunnlagPanel
 *
 * Container komponent. Har ansvar for å sette opp Redux Formen for "avklar fakta om fordeling" panel.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export class FordelBeregningsgrunnlagPanelImpl extends Component {
  constructor() {
    super();
    this.state = {
      submitEnabled: false,
    };
  }

  componentDidMount() {
    const { submitEnabled } = this.state;
    if (!submitEnabled) {
      this.setState({
        submitEnabled: true,
      });
    }
  }

  render() {
    const {
      props: {
        intl,
        openInfoPanels,
        toggleInfoPanelCallback,
        hasOpenAksjonspunkter,
        readOnly,
        submittable,
        isOnHold,
        isAksjonspunktClosed,
        hasBegrunnelse,
        ...formProps
      },
      state: {
        submitEnabled,
      },
    } = this;
    if (isOnHold) {
      return null;
    }
    return (
      <FaktaEkspandertpanel
        title={intl.formatMessage({ id: 'FordelBeregningsgrunnlag.Title' })}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.FORDELING)}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        faktaId={faktaPanelCodes.FORDELING}
        readOnly={readOnly}
      >
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
      </FaktaEkspandertpanel>
    );
}
}

FordelBeregningsgrunnlagPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  submittable: PropTypes.bool.isRequired,
  isOnHold: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

export const transformValuesFordelBeregning = createSelector(
  [getAksjonspunkter, getEndringBeregningsgrunnlagPerioder, getBeregningsgrunnlagPerioder],
  (aksjonspunkter, endringBGPerioder, bgPerioder) => (values) => {
    if (hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      const faktaBeregningValues = values;
      const beg = faktaBeregningValues[BEGRUNNELSE_FORDELING_NAME];
      return [{
        kode: FORDEL_BEREGNINGSGRUNNLAG,
        begrunnelse: beg === undefined ? null : beg,
        ...FastsettEndretBeregningsgrunnlag.transformValues(values, endringBGPerioder, bgPerioder),
      }];
    }
    return {};
  },
);

export const buildInitialValuesFordelBeregning = createSelector(
  [getEndringBeregningsgrunnlagPerioder, getBeregningsgrunnlag, getAlleKodeverk, getAksjonspunkter],
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

export const getValidationFordelBeregning = createSelector([mapStateToValidationProps, getAlleKodeverk, getAksjonspunkter],
  (props, alleKodeverk, aksjonspunkter) => (values) => {
    if (hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)) {
      return {
        ...FastsettEndretBeregningsgrunnlag.validate(values, props.endringBGPerioder,
          props.beregningsgrunnlag, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
};
    }
    return null;
  });


const mapStateToProps = (state, initialProps) => {
  const isOnHold = getBehandlingIsOnHold(state);
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp.find(ap => ap.definisjon.kode === FORDEL_BEREGNINGSGRUNNLAG);
  const isAksjonspunktClosed = !isAksjonspunktOpen(relevantAp.status.kode);
  const initialValues = buildInitialValuesFordelBeregning(state);
  const hasBegrunnelse = initialValues
  && !!initialValues[BEGRUNNELSE_FORDELING_NAME];
  return {
    isOnHold,
    isAksjonspunktClosed,
    hasBegrunnelse,
    initialValues,
    aksjonspunkter: alleAp,
    validate: getValidationFordelBeregning(state),
    onSubmit: values => initialProps.submitCallback(transformValuesFordelBeregning(state)(values)),
  };
};

const FordelBeregningsgrunnlagPanel = withDefaultToggling(faktaPanelCodes.FORDELING,
  faktaOmFordelingAksjonspunkter)(
    connect(mapStateToProps)(
      behandlingForm({ form: FORM_NAME_FORDEL_BEREGNING })(
          injectIntl(FordelBeregningsgrunnlagPanelImpl),
          ),
),
);

  FordelBeregningsgrunnlagPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => faktaOmFordelingAksjonspunkter.includes(ap.definisjon.kode));

export default FordelBeregningsgrunnlagPanel;
