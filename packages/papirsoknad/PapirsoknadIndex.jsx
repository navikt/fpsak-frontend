/**
 * RegistreringIndex
 *
 * Container komponent. Har ansvar for registrering-delen av hovedvinduet. Denne bruker valgt
 * fagsak og behandling for å generere korrekt registreringsskjema.
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ErrorTypes } from 'app/ErrorTypes';
import { FpsakApi } from 'data/fpsakApi';
import { getRestApiFinished, getRestApiError } from 'data/duck';
import PersonIndex from 'person/PersonIndex';
import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import SoknadData from 'papirsoknad/SoknadData';
import requireProps from 'app/data/requireProps';
import {
  getSelectedBehandlingIdentifier, getBehandlingVersjon, getBehandlingIsOnHold, getAksjonspunkter,
}
  from 'behandling/behandlingSelectors';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import { getRettigheter } from 'navAnsatt/duck';
import rettighetPropType from 'navAnsatt/rettighetPropType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import {
  resetRegistrering, submitRegistrering, resetRegistreringSuccess, setSoknadData, getSoknadData,
} from './duck';
import RegistrerPapirsoknad from './components/RegistrerPapirsoknad';
import SoknadRegistrertModal from './components/SoknadRegistrertModal';


export class PapirsoknadIndex extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitUfullstendigsoknad = this.onSubmitUfullstendigsoknad.bind(this);
    this.createManuellRegistrering = this.createManuellRegistrering.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { soknadData, submitRegistreringSuccess } = this.props;
    return (nextProps.submitRegistreringSuccess !== submitRegistreringSuccess
      || nextProps.soknadData !== soknadData);
  }

  componentWillUnmount() {
    const { resetRegistrering: resetReg, resetRegistreringSuccess: resetRegSuccess } = this.props;
    resetReg();
    resetRegSuccess();
  }

  onSubmit(formValues, dispatch, { valuesForRegisteredFieldsOnly }) {
    return this.createManuellRegistrering(valuesForRegisteredFieldsOnly);
  }

  onSubmitUfullstendigsoknad() {
    return this.createManuellRegistrering({ ufullstendigSoeknad: true });
  }


  getApKode() {
    const { aksjonspunkter } = this.props;
    return aksjonspunkter.filter(a => a.erAktivt).map(ap => ap.definisjon.kode)
      .filter(kode => kode === aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD || kode === aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_FORELDREPENGER
        || kode === aksjonspunktCodes.REGISTRER_PAPIR_ENDRINGSØKNAD_FORELDREPENGER)[0];
  }

  createManuellRegistrering(valuesForRegisteredFieldsOnly) {
    const {
      submitRegistrering: submit, behandlingIdentifier, behandlingVersjon, soknadData,
    } = this.props;

    const manuellRegistreringDtoList = [{
      '@type': this.getApKode(),
      tema: soknadData.getFamilieHendelseType(),
      soknadstype: soknadData.getFagsakYtelseType(),
      soker: soknadData.getForeldreType(),
      ...valuesForRegisteredFieldsOnly,
    },
    ];

    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: manuellRegistreringDtoList,
    };
    return submit(params);
  }

  render() {
    const {
      setSoknadData: setData, writeAccess, behandlingPaaVent, soknadData, submitRegistreringSuccess,
    } = this.props;
    return (
      <div>
        <PersonIndex medPanel />
        <RegistrerPapirsoknad
          submitPapirsoknad={this.onSubmit}
          setSoknadData={setData}
          onSubmitUfullstendigsoknad={this.onSubmitUfullstendigsoknad}
          readOnly={!writeAccess.isEnabled || behandlingPaaVent}
          soknadData={soknadData}
        />
        <SoknadRegistrertModal isOpen={submitRegistreringSuccess} />
      </div>
    );
  }
}

PapirsoknadIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType),
  submitRegistrering: PropTypes.func.isRequired,
  submitRegistreringSuccess: PropTypes.bool.isRequired,
  resetRegistrering: PropTypes.func.isRequired,
  writeAccess: rettighetPropType,
  setSoknadData: PropTypes.func.isRequired,
  soknadData: PropTypes.instanceOf(SoknadData),
  resetRegistreringSuccess: PropTypes.func.isRequired,
};

PapirsoknadIndex.defaultProps = {
  writeAccess: {
    employeeHasAccess: false,
    isEnabled: false,
  },
  soknadData: null,
  aksjonspunkter: [],
};

const hasAccessError = error => !!(error && error.type === ErrorTypes.MANGLER_TILGANG_FEIL);

const mapStateToProps = state => ({
  submitRegistreringSuccess: getRestApiFinished(FpsakApi.SAVE_AKSJONSPUNKT)(state) || hasAccessError(getRestApiError(FpsakApi.SAVE_AKSJONSPUNKT)(state)),
  soknadData: getSoknadData(state),
  aksjonspunkter: getAksjonspunkter(state),
  behandlingIdentifier: getSelectedBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  behandlingPaaVent: getBehandlingIsOnHold(state),
  ...getRettigheter(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...routerActions,
    submitRegistrering,
    setSoknadData,
    resetRegistrering,
    resetRegistreringSuccess,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingIdentifier'], <LoadingPanel />)(PapirsoknadIndex));
