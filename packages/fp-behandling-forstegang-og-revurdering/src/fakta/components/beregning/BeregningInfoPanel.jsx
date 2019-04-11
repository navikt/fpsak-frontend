import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  getBehandlingIsOnHold,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import VurderFaktaBeregningPanel, {
  transformValuesVurderFaktaBeregning,
  buildInitialValuesVurderFaktaBeregning,
  getValidationVurderFaktaBeregning,
} from './fellesFaktaForATFLogSN/VurderFaktaBeregningPanel';
import AvklareAktiviteterPanel, {
  buildInitialValuesAvklarAktiviteter,
  transformValuesAvklarAktiviteter,
  erAvklartAktivitetEndret,
}
  from './avklareAktiviteter/AvklareAktiviteterPanel';
import { formName } from './BeregningFormUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_AKTIVITETER,
} = aksjonspunktCodes;

const faktaOmBeregningAksjonspunkter = [VURDER_FAKTA_FOR_ATFL_SN, AVKLAR_AKTIVITETER];

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const createRelevantForms = (readOnly, aksjonspunkter, submittable, isDirty, submitEnabled) => (
  <div>
    {hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
      && (
        <AvklareAktiviteterPanel
          readOnly={readOnly}
          formName={formName}
          submittable={submittable}
          isDirty={isDirty}
          submitEnabled={submitEnabled}
          harAndreAksjonspunkterIPanel={hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)}
        />
      )
    }
    {hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)
    && (
      <VurderFaktaBeregningPanel
        readOnly={readOnly}
        formName={formName}
        submittable={submittable}
        isDirty={isDirty}
      />
    )
    }
  </div>
);

export const harIkkeEndringerIAvklarMedFlereAksjonspunkter = (verdiForAvklarAktivitetErEndret, aksjonspunkter) => {
  if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
    return !verdiForAvklarAktivitetErEndret;
  }
  return true;
};

/**
 * BeregningInfoPanel
 *
 * Container komponent.. Har ansvar for å sette opp Redux Formen for "avklar fakta om beregning" panel.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export class BeregningInfoPanelImpl extends Component {
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
        aksjonspunkter,
        submittable,
        verdiForAvklarAktivitetErEndret,
        isOnHold,
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
        title={intl.formatMessage({ id: 'BeregningInfoPanel.Title' })}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.BEREGNING)}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        faktaId={faktaPanelCodes.BEREGNING}
        readOnly={readOnly}
      >
        <form onSubmit={formProps.handleSubmit}>
          {createRelevantForms(readOnly, aksjonspunkter, submittable, formProps.dirty, submitEnabled)}
          <React.Fragment>
            <VerticalSpacer twentyPx />
            <FaktaSubmitButton
              formName={formProps.form}
              isSubmittable={submittable && submitEnabled && harIkkeEndringerIAvklarMedFlereAksjonspunkter(verdiForAvklarAktivitetErEndret, aksjonspunkter)}
              isReadOnly={readOnly}
              hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            />
          </React.Fragment>
        </form>
      </FaktaEkspandertpanel>
    );
  }
}

BeregningInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  initialValues: PropTypes.shape(),
  submittable: PropTypes.bool.isRequired,
  verdiForAvklarAktivitetErEndret: PropTypes.bool.isRequired,
  isOnHold: PropTypes.bool.isRequired,
  ...formPropTypes,
};

BeregningInfoPanelImpl.defaultProps = {
  initialValues: {},
};

const buildInitialValues = createSelector(
  [buildInitialValuesVurderFaktaBeregning, buildInitialValuesAvklarAktiviteter],
  (initialValuesVurderFakta, initialValuesAvklarAktiviteter) => ({
    ...initialValuesAvklarAktiviteter,
    ...initialValuesVurderFakta,
  }),
);

const getValidate = createSelector(
  [getValidationVurderFaktaBeregning],
  validationForVurderFakta => values => ({
    ...validationForVurderFakta(values),
  }),
);

export const transformValues = createSelector(
  [transformValuesVurderFaktaBeregning, transformValuesAvklarAktiviteter],
  (transformVurderFakta, transformAvklarAktiviteter) => (values) => {
    const avklareAktiviteterValues = transformAvklarAktiviteter(values);
    if (avklareAktiviteterValues) {
      return avklareAktiviteterValues;
    }
    return transformVurderFakta(values);
  },
);

const mapStateToProps = (state, initialProps) => {
  const isOnHold = getBehandlingIsOnHold(state);
  return {
    isOnHold,
    initialValues: buildInitialValues(state),
    validate: getValidate(state),
    verdiForAvklarAktivitetErEndret: erAvklartAktivitetEndret(state),
    onSubmit: values => initialProps.submitCallback(transformValues(state)(values)),
  };
};

const BeregningInfoPanel = withDefaultToggling(faktaPanelCodes.BEREGNING, faktaOmBeregningAksjonspunkter)(connect(mapStateToProps)(behandlingForm({
  form: formName,
})(injectIntl(BeregningInfoPanelImpl))));

BeregningInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => faktaOmBeregningAksjonspunkter.includes(ap.definisjon.kode));

export default BeregningInfoPanel;
