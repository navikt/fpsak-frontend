import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { aksjonspunktPropType, rettighetPropType } from '@fpsak-frontend/prop-types';
import {
  PersonIndex, requireProps, BehandlingIdentifier,
} from '@fpsak-frontend/fp-felles';
import { getRettigheter } from 'navAnsatt/duck';
import SoknadData from './SoknadData';
import {
  getBehandlingVersjon, getBehandlingIsOnHold, getAksjonspunkter,
} from './selectors/papirsoknadSelectors';
import {
  resetRegistrering, submitRegistrering, resetRegistreringSuccess, setSoknadData, getSoknadData, getBehandlingIdentifier,
  getFagsakPerson,
} from './duck';
import RegistrerPapirsoknad from './components/RegistrerPapirsoknad';
import SoknadRegistrertModal from './components/SoknadRegistrertModal';

// TODO (TOR) Slå saman med BehandlingPapirsoknadIndex?

/**
 * RegistreringIndex
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

    this.state = {
      showRegistrertModal: false,
    };
  }

  componentWillUnmount() {
    const { resetRegistrering: resetReg, resetRegistreringSuccess: resetRegSuccess } = this.props;
    resetReg();
    resetRegSuccess();
  }

  onSubmit(formValues, dispatch, { valuesForRegisteredFieldsOnly }) {
    this.setState({
      showRegistrertModal: true,
    }, () => this.createManuellRegistrering(valuesForRegisteredFieldsOnly));
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
      setSoknadData: setData, writeAccess, behandlingPaaVent, soknadData, fagsakPerson,
    } = this.props;
    const { showRegistrertModal } = this.state;
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
        <SoknadRegistrertModal isOpen={showRegistrertModal} />
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

const mapStateToProps = state => ({
  soknadData: getSoknadData(state),
  aksjonspunkter: getAksjonspunkter(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  behandlingPaaVent: getBehandlingIsOnHold(state),
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
