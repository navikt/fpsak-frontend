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
  getFaktaOmBeregningTilfellerKoder,
  getBehandlingIsOnHold,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { AksjonspunktHelpText, ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getHelpTextsFaktaForATFLOgSN } from './fellesFaktaForATFLogSN/FaktaForATFLOgSNPanel';
import VurderFaktaBeregningPanel, {
  transformValuesVurderFaktaBeregning,
  buildInitialValuesVurderFaktaBeregning,
  getValidationVurderFaktaBeregning,
} from './fellesFaktaForATFLogSN/VurderFaktaBeregningPanel';
import AvklareAktiviteterForm, {
  getHelpTextsAvklarAktiviteter,
  getValidationAvklarAktiviteter,
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

const getHelpText = createSelector([getHelpTextsAvklarAktiviteter, getHelpTextsFaktaForATFLOgSN],
  (helpTextAvklareAktiviteter, helpTextFaktaATFLSN) => {
    if (helpTextAvklareAktiviteter.length > 0) {
      return helpTextAvklareAktiviteter;
    }
    return helpTextFaktaATFLSN;
  });

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const createRelevantForms = (readOnly, aksjonspunkter, verdiForAvklartErEndret, submittable, isDirty) => (
  <div>
    {hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
      && (
        <AvklareAktiviteterForm
          readOnly={readOnly}
          formName={formName}
          submittable={submittable}
          isDirty={isDirty}
        />
      )
    }
    {hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)
    && (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) || !verdiForAvklartErEndret)
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
        initialValues,
        helpText,
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
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>{helpText}</AksjonspunktHelpText>
        <VerticalSpacer sixteenPx />
        <VerticalSpacer sixteenPx />
        <form onSubmit={formProps.handleSubmit}>
          {createRelevantForms(readOnly, aksjonspunkter, verdiForAvklarAktivitetErEndret, submittable, formProps.dirty)}
          <ElementWrapper>
            <VerticalSpacer twentyPx />
            <FaktaSubmitButton
              formName={formProps.form}
              isSubmittable={submittable && submitEnabled}
              isReadOnly={readOnly}
              hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            />
          </ElementWrapper>
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
  helpText: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  faktaTilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  [getValidationVurderFaktaBeregning, getValidationAvklarAktiviteter],
  (validationForVurderFakta, validationAvklarAktiviteter) => values => ({
    ...validationAvklarAktiviteter(values),
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
  const faktaTilfeller = getFaktaOmBeregningTilfellerKoder(state) ? getFaktaOmBeregningTilfellerKoder(state) : [];
  const isOnHold = getBehandlingIsOnHold(state);
  return {
    faktaTilfeller,
    isOnHold,
    helpText: getHelpText(state),
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
