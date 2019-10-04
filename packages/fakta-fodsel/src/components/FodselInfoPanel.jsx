import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { submit as reduxSubmit } from 'redux-form';
import { connect } from 'react-redux';

import { aksjonspunktPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  faktaPanelCodes, getBehandlingFormPrefix, FaktaSubmitButton, FaktaEkspandertpanel, withDefaultToggling,
} from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FodselSammenligningIndex from '@fpsak-frontend/prosess-fakta-fodsel-sammenligning';

import fodselOriginalBehandlingPropType from '../propTypes/fodselOriginalBehandlingPropType';
import fodselPersonopplysningerPropType from '../propTypes/fodselPersonopplysningerPropType';
import fodselFamilieHendelsePropType from '../propTypes/fodselFamilieHendelsePropType';
import fodselSoknadPropType from '../propTypes/fodselSoknadPropType';
import TermindatoFaktaForm, { termindatoFaktaFormName } from './TermindatoFaktaForm';
import SjekkFodselDokForm, { sjekkFodselDokForm } from './SjekkFodselDokForm';
import SykdomPanel, { sykdomPanelName } from './SykdomPanel';

const {
  TERMINBEKREFTELSE, SJEKK_MANGLENDE_FODSEL, VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT,
} = aksjonspunktCodes;
const fodselAksjonspunkter = [TERMINBEKREFTELSE, SJEKK_MANGLENDE_FODSEL, VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT];

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
      formNames.forEach((formName) => dispatch(reduxSubmit(`${formPrefix}.${formName}`)));
      e.preventDefault();
    };
  }

  submitHandler(values) {
    this.submittedAksjonspunkter = {
      ...this.submittedAksjonspunkter,
      [values.kode]: values,
    };
    const { aksjonspunkter, submitCallback } = this.props;

    return aksjonspunkter.every((ap) => this.submittedAksjonspunkter[ap.definisjon.kode])
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
      avklartBarn,
      termindato,
      vedtaksDatoSomSvangerskapsuke,
      soknad,
      originalBehandling,
      familiehendelse,
      alleMerknaderFraBeslutter,
      personopplysninger,
      behandlingId,
      behandlingVersjon,
      behandlingType,
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
          {hasAksjonspunkt(VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT, aksjonspunkter) && (
            <SykdomPanel
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              readOnly={readOnly}
              aksjonspunkt={aksjonspunkter.find((ap) => ap.definisjon.kode === VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT)}
              submitHandler={this.submitHandler}
              morForSykVedFodsel={familiehendelse.gjeldende.morForSykVedFodsel}
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
            />
          )}
          {hasAksjonspunkt(TERMINBEKREFTELSE, aksjonspunkter) && (
            <TermindatoFaktaForm
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              aksjonspunkt={aksjonspunkter.find((ap) => ap.definisjon.kode === TERMINBEKREFTELSE)}
              readOnly={readOnly}
              submittable={submittable}
              isAksjonspunktOpen={hasOpenAksjonspunkter}
              submitHandler={this.submitHandler}
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
              soknad={soknad}
              gjeldendeFamiliehendelse={familiehendelse.gjeldende}
              personopplysninger={personopplysninger}
            />
          )}
          {hasAksjonspunkt(SJEKK_MANGLENDE_FODSEL, aksjonspunkter) && (
            <SjekkFodselDokForm
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              behandlingType={behandlingType}
              aksjonspunkt={aksjonspunkter.find((ap) => ap.definisjon.kode === SJEKK_MANGLENDE_FODSEL)}
              readOnly={readOnly}
              submittable={submittable}
              isAksjonspunktOpen={hasOpenAksjonspunkter}
              submitHandler={this.submitHandler}
              originalBehandling={originalBehandling}
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
              soknad={soknad}
              avklartBarn={avklartBarn}
              gjeldendeFamiliehendelse={familiehendelse.gjeldende}
              personopplysninger={personopplysninger}
            />
          )}
          {aksjonspunkter.length !== 0 && !readOnly
            && (
              <>
                <VerticalSpacer twentyPx />
                <FaktaSubmitButton
                  behandlingId={behandlingId}
                  behandlingVersjon={behandlingVersjon}
                  formNames={formNames}
                  isSubmittable={submittable}
                  isReadOnly={readOnly}
                  hasOpenAksjonspunkter={hasOpenAksjonspunkter}
                />
              </>
            )}
          {aksjonspunkter.length === 0 && (
            <FodselSammenligningIndex
              behandlingsTypeKode={behandlingType.kode}
              avklartBarn={avklartBarn}
              termindato={termindato}
              vedtaksDatoSomSvangerskapsuke={vedtaksDatoSomSvangerskapsuke}
              soknad={soknad}
              originalBehandling={originalBehandling}
            />
          )}
        </form>
      </FaktaEkspandertpanel>
    );
  }
}

FodselInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
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
  avklartBarn: PropTypes.arrayOf(PropTypes.shape()),
  termindato: PropTypes.string,
  vedtaksDatoSomSvangerskapsuke: PropTypes.string,
  soknad: fodselSoknadPropType.isRequired,
  originalBehandling: fodselOriginalBehandlingPropType,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  familiehendelse: fodselFamilieHendelsePropType.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  personopplysninger: fodselPersonopplysningerPropType.isRequired,
};

FodselInfoPanelImpl.defaultProps = {
  originalBehandling: undefined,
  avklartBarn: [],
  termindato: undefined,
};

const nullSafe = (value) => (value || {});

const mapStateToProps = (state, ownProps) => ({
  formPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
  avklartBarn: nullSafe(ownProps.familiehendelse.register).avklartBarn,
  termindato: nullSafe(ownProps.familiehendelse.gjeldende).termindato,
  vedtaksDatoSomSvangerskapsuke: nullSafe(ownProps.familiehendelse.gjeldende).vedtaksDatoSomSvangerskapsuke,
});

const ConnectedComponent = connect(mapStateToProps)(injectIntl(FodselInfoPanelImpl));
const FodselInfoPanel = withDefaultToggling(faktaPanelCodes.FODSELSVILKARET, fodselAksjonspunkter)(ConnectedComponent);

export default FodselInfoPanel;
