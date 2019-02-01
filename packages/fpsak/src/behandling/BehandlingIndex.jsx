import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BehandlingPapirsoknadIndex from 'papirsoknad/BehandlingPapirsoknadIndex';
import trackRouteParam from 'app/data/trackRouteParam';
import requireProps from 'app/data/requireProps';
import { updateFagsakInfo } from 'fagsak/duck';
import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingTilbakekrevingIndex from 'behandlingTilbakekreving/BehandlingTilbakekrevingIndex';
import BehandlingFpsakIndex from 'behandlingFpsak/BehandlingFpsakIndex';
import {
  setSelectedBehandlingId, getSelectedBehandlingId, setBehandlingInfoHolder, resetBehandlingContext as resetBehandlingContextActionCreator,
} from './duck';
import {
  getBehandlingerVersjonMappedById, getBehandlingerTypesMappedById, getBehandlingerAktivPapirsoknadMappedById,
} from './selectors/behandlingerSelectors';
import behandlingUpdater from './BehandlingUpdater';

/**
 * BehandlingIndex
 *
 * Container-komponent. Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 *
 * Komponenten har ansvar å legge valgt behandlingId fra URL-en i staten.
 */
export class BehandlingIndex extends Component {
  static propTypes = {
    saksnummer: PropTypes.number.isRequired,
    behandlingId: PropTypes.number.isRequired,
    behandlingType: PropTypes.string.isRequired,
    behandlingerVersjonMappedById: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    setHolder: PropTypes.func.isRequired,
    erAktivPapirsoknad: PropTypes.bool.isRequired,
    resetBehandlingContext: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    const { resetBehandlingContext } = this.props;
    resetBehandlingContext();
  }

  render() {
    const {
      saksnummer,
      behandlingId,
      behandlingType,
      behandlingerVersjonMappedById,
      location,
      setHolder,
      erAktivPapirsoknad,
    } = this.props;
    if (erAktivPapirsoknad) {
      return (
        <BehandlingPapirsoknadIndex
          key={behandlingId}
          saksnummer={saksnummer}
          behandlingId={behandlingId}
          updateFagsakInfo={updateFagsakInfo}
          behandlingerVersjonMappedById={behandlingerVersjonMappedById}
          location={location}
          setBehandlingInfoHolder={setHolder}
          behandlingUpdater={behandlingUpdater}
        />
      );
    }

    if (behandlingType === BehandlingType.TILBAKEKREVING) {
      return (
        <BehandlingTilbakekrevingIndex
          key={behandlingId}
          saksnummer={saksnummer}
          behandlingId={behandlingId}
          updateFagsakInfo={updateFagsakInfo}
          behandlingerVersjonMappedById={behandlingerVersjonMappedById}
          location={location}
          setBehandlingInfoHolder={setHolder}
          behandlingUpdater={behandlingUpdater}
        />
      );
    }

    return (
      <BehandlingFpsakIndex
        key={behandlingId}
        saksnummer={saksnummer}
        behandlingId={behandlingId}
        updateFagsakInfo={updateFagsakInfo}
        behandlingerVersjonMappedById={behandlingerVersjonMappedById}
        location={location}
        setBehandlingInfoHolder={setHolder}
        behandlingUpdater={behandlingUpdater}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const behandlingId = getSelectedBehandlingId(state);
  return {
    behandlingId,
    saksnummer: getSelectedSaksnummer(state),
    behandlingerVersjonMappedById: getBehandlingerVersjonMappedById(state),
    behandlingType: getBehandlingerTypesMappedById(state)[behandlingId],
    location: state.router.location,
    erAktivPapirsoknad: getBehandlingerAktivPapirsoknadMappedById(state)[behandlingId],
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  setHolder: setBehandlingInfoHolder,
  resetBehandlingContext: resetBehandlingContextActionCreator,
}, dispatch);

export default trackRouteParam({
  paramName: 'behandlingId',
  parse: saksnummerFromUrl => Number.parseInt(saksnummerFromUrl, 10),
  paramPropType: PropTypes.number,
  storeParam: setSelectedBehandlingId,
  getParamFromStore: getSelectedBehandlingId,
})(connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingId'])(BehandlingIndex)));
