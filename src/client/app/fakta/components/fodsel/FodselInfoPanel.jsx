import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { submit as reduxSubmit } from 'redux-form';
import { connect } from 'react-redux';

import FaktaSubmitButton from 'fakta/components/FaktaSubmitButton';
import { getBehandlingFormPrefix } from 'behandling/behandlingForm';
import { getBehandlingVersjon } from 'behandling/behandlingSelectors';
import { getSelectedBehandlingId } from 'behandling/duck';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import { fodselsvilkarene } from 'kodeverk/vilkarType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import withDefaultToggling from 'fakta/withDefaultToggling';
import FodselSammenligningPanel from 'behandling/components/fodselSammenligning/FodselSammenligningPanel';
import TermindatoFaktaForm, { termindatoFaktaFormName } from 'fakta/components/fodsel/TermindatoFaktaForm';
import SjekkFodselDokForm, { sjekkFodselDokForm } from 'fakta/components/fodsel/SjekkFodselDokForm';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import faktaPanelCodes from 'fakta/faktaPanelCodes';
import SykdomPanel, { sykdomPanelName } from './SykdomPanel';

const {
  TERMINBEKREFTELSE, SJEKK_MANGLENDE_FODSEL, VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT,
} = aksjonspunktCodes;
const fodselAksjonspunkter = [TERMINBEKREFTELSE, SJEKK_MANGLENDE_FODSEL, VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT];

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const getHelpTexts = (aksjonspunkter) => {
  const helpTexts = [];
  if (hasAksjonspunkt(VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="VurderVilkarForSykdom" id="FodselInfoPanel.VurderVilkarForSykdom" />);
  }
  if (hasAksjonspunkt(TERMINBEKREFTELSE, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="KontrollerMotTerminbekreftelsen" id="FodselInfoPanel.KontrollerMotTerminbekreftelsen" />);
  }
  if (hasAksjonspunkt(SJEKK_MANGLENDE_FODSEL, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="KontrollerMotFodselsdokumentasjon" id="FodselInfoPanel.KontrollerMotFodselsdokumentasjon" />);
  }
  return helpTexts;
};

const formNames = [sykdomPanelName, termindatoFaktaFormName, sjekkFodselDokForm];

/**
 * FodselInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for faktapenelet til Fødselsvilkåret.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */

export class FodselInfoPanelImpl extends Component {
  constructor() {
    super();

    this.submittedAksjonspunkter = {};

    this.submitHandler = this.submitHandler.bind(this);
    this.getSubmitFunction = this.getSubmitFunction.bind(this);
  }

  getSubmitFunction(dispatch, formPrefix) {
    return (e) => {
      this.submittedAksjonspunkter = {};
      formNames.forEach(formName => dispatch(reduxSubmit(`${formPrefix}.${formName}`)));
      e.preventDefault();
    };
  }

  submitHandler(values) {
    this.submittedAksjonspunkter = {
      ...this.submittedAksjonspunkter,
      [values.kode]: values,
    };
    const { aksjonspunkter, submitCallback } = this.props;

    return aksjonspunkter.every(ap => this.submittedAksjonspunkter[ap.definisjon.kode])
      ? submitCallback(Object.values(this.submittedAksjonspunkter))
      : undefined;
  }

  render() {
    const {
      intl,
      aksjonspunkter,
      openInfoPanels,
      toggleInfoPanelCallback,
      hasOpenAksjonspunkter,
      submittable,
      formPrefix,
      readOnly,
      dispatch,
    } = this.props;
    return (
      <FaktaEkspandertpanel
        title={intl.formatMessage({ id: 'FodselInfoPanel.Fodsel' })}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.FODSELSVILKARET)}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        faktaId={faktaPanelCodes.FODSELSVILKARET}
        readOnly={readOnly}
      >
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>{getHelpTexts(aksjonspunkter)}</AksjonspunktHelpText>
        <form onSubmit={this.getSubmitFunction(dispatch, formPrefix)}>
          {hasAksjonspunkt(VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT, aksjonspunkter)
            && (
            <SykdomPanel
              readOnly={readOnly}
              aksjonspunkt={aksjonspunkter.find(ap => ap.definisjon.kode === VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT)}
              submitHandler={this.submitHandler}
            />
            )
          }
          {hasAksjonspunkt(TERMINBEKREFTELSE, aksjonspunkter)
            && (
            <TermindatoFaktaForm
              readOnly={readOnly}
              submittable={submittable}
              isAksjonspunktOpen={hasOpenAksjonspunkter}
              submitHandler={this.submitHandler}
            />
            )
          }
          {hasAksjonspunkt(SJEKK_MANGLENDE_FODSEL, aksjonspunkter)
            && (
            <SjekkFodselDokForm
              readOnly={readOnly}
              submittable={submittable}
              isAksjonspunktOpen={hasOpenAksjonspunkter}
              submitHandler={this.submitHandler}
            />
            )
          }
          {aksjonspunkter.length !== 0 && !readOnly
            && (
            <ElementWrapper>
              <VerticalSpacer twentyPx />
              <FaktaSubmitButton formNames={formNames} isSubmittable={submittable} isReadOnly={readOnly} hasOpenAksjonspunkter={hasOpenAksjonspunkter} />
            </ElementWrapper>
            )
          }
          {aksjonspunkter.length === 0
            && <FodselSammenligningPanel />
          }
        </form>
      </FaktaEkspandertpanel>
    );
  }
}

FodselInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  formPrefix: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
});

const ConnectedComponent = connect(mapStateToProps)(injectIntl(FodselInfoPanelImpl));
const FodselInfoPanel = withDefaultToggling(faktaPanelCodes.FODSELSVILKARET, fodselAksjonspunkter)(ConnectedComponent);

FodselInfoPanel.supports = (
  vilkarCodes, aksjonspunkter,
) => aksjonspunkter.some(ap => fodselAksjonspunkter.includes(ap.definisjon.kode)) || vilkarCodes.some(code => fodselsvilkarene.includes(code));

export default FodselInfoPanel;
