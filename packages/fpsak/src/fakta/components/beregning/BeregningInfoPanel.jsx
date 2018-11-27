import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import {
  getAksjonspunkter,
  getFaktaOmBeregningTilfellerKoder,
} from 'behandling/behandlingSelectors';
import withDefaultToggling from 'fakta/withDefaultToggling';
import faktaPanelCodes from 'fakta/faktaPanelCodes';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { behandlingForm } from 'behandling/behandlingForm';
import FaktaBegrunnelseTextField from 'fakta/components/FaktaBegrunnelseTextField';
import FaktaSubmitButton from 'fakta/components/FaktaSubmitButton';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import { erSpesialtilfelleMedEkstraKnapp } from 'kodeverk/faktaOmBeregningTilfelle';
import FaktaForATFLOgSNPanel, {
  getHelpTextsFaktaForATFLOgSN, transformValuesFaktaForATFLOgSN,
  buildInitialValuesFaktaForATFLOgSN, getValidationFaktaForATFLOgSN,
} from './fellesFaktaForATFLogSN/FaktaForATFLOgSNPanel';


export const formName = 'faktaOmBeregningForm';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const faktaOmBeregningAksjonspunkter = [VURDER_FAKTA_FOR_ATFL_SN];

const findAksjonspunktMedBegrunnelse = aksjonspunkter => aksjonspunkter
  .filter(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN && ap.begrunnelse !== null)[0];

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);


const createRelevantForms = (readOnly, aksjonspunkter, showTableCallback) => (
  <div>
    {hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)
    && (
      <FaktaForATFLOgSNPanel
        readOnly={readOnly}
        formName={formName}
        showTableCallback={showTableCallback}
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
    this.showTableCallback = this.showTableCallback.bind(this);
  }

  componentDidMount() {
    const { faktaTilfeller } = this.props;
    const { submitEnabled } = this.state;
    if (!erSpesialtilfelleMedEkstraKnapp(faktaTilfeller) && !submitEnabled) {
      this.setState({
        submitEnabled: true,
      });
    }
  }

  showTableCallback() {
    this.setState({
      submitEnabled: true,
    });
  }

  render() {
    const {
      showTableCallback,
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
        ...formProps
      },
      state: {
        submitEnabled,
      },
    } = this;
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
          {createRelevantForms(readOnly, aksjonspunkter, showTableCallback)}
          <ElementWrapper>
            <VerticalSpacer eightPx />
            <VerticalSpacer twentyPx />
            <FaktaBegrunnelseTextField
              isDirty={formProps.dirty}
              isSubmittable={submittable}
              isReadOnly={readOnly}
              hasBegrunnelse={!!initialValues.begrunnelse}
            />
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
  ...formPropTypes,
};

BeregningInfoPanelImpl.defaultProps = {
  initialValues: {},
};

const buildInitialValues = createSelector(
  [getAksjonspunkter, buildInitialValuesFaktaForATFLOgSN],
  (aksjonspunkter, initialValuesFelles) => ({
    ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter)),
    ...initialValuesFelles,
  }),
);

const getValidate = createSelector(
  [getValidationFaktaForATFLOgSN],
  validationForVurderFakta => values => ({
    ...validationForVurderFakta(values),
  }),
);


const mapStateToProps = (state, initialProps) => {
  const faktaTilfeller = getFaktaOmBeregningTilfellerKoder(state) ? getFaktaOmBeregningTilfellerKoder(state) : [];
  return {
    faktaTilfeller,
    helpText: getHelpTextsFaktaForATFLOgSN(state),
    initialValues: buildInitialValues(state),
    validate: getValidate(state),
    onSubmit: values => initialProps.submitCallback(transformValuesFaktaForATFLOgSN(state)(values)),
  };
};

const BeregningInfoPanel = withDefaultToggling(faktaPanelCodes.BEREGNING, faktaOmBeregningAksjonspunkter)(connect(mapStateToProps)(behandlingForm({
  form: formName,
})(injectIntl(BeregningInfoPanelImpl))));

BeregningInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => faktaOmBeregningAksjonspunkter.includes(ap.definisjon.kode));

export default BeregningInfoPanel;
