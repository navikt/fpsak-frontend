import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { aksjonspunktPropType, rettighetPropType } from '@fpsak-frontend/prop-types';
import {
  PersonIndex, requireProps, BehandlingIdentifier, ErrorTypes,
} from '@fpsak-frontend/fp-felles';

import { getRettigheter } from 'navAnsatt/duck';
import papirsoknadApi from './data/papirsoknadApi';
import SoknadData from './SoknadData';
import behandlingSelectors from './selectors/papirsoknadSelectors';
import {
  resetRegistrering, submitRegistrering, resetRegistreringSuccess, setSoknadData, getSoknadData, getBehandlingIdentifier,
  getFagsakPerson,
} from './duckPapirsoknad';
import RegistrerPapirsoknad from './components/RegistrerPapirsoknad';
import SoknadRegistrertModal from './components/SoknadRegistrertModal';

/**
 * PapirsoknadIndex
 *
 * Container komponent. Har ansvar for registrering-delen av hovedvinduet. Denne bruker valgt
 * fagsak og behandling for å generere korrekt registreringsskjema.
 *
 */
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
      setSoknadData: setData, writeAccess, behandlingPaaVent, soknadData, fagsakPerson, submitRegistreringSuccess,
    } = this.props;
    return (
      <div>
        <PersonIndex medPanel person={fagsakPerson} />
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
  fagsakPerson: PropTypes.shape().isRequired,
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
  submitRegistreringSuccess: papirsoknadApi.SAVE_AKSJONSPUNKT.getRestApiFinished()(state)
  || hasAccessError(papirsoknadApi.SAVE_AKSJONSPUNKT.getRestApiError()(state)),
  soknadData: getSoknadData(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingPaaVent: behandlingSelectors.getBehandlingIsOnHold(state),
  fagsakPerson: getFagsakPerson(state),
  ...getRettigheter(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    submitRegistrering,
    setSoknadData,
    resetRegistrering,
    resetRegistreringSuccess,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingIdentifier'], <LoadingPanel />)(PapirsoknadIndex));
