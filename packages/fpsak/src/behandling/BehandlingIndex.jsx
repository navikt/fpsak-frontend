import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import trackRouteParam from 'app/data/trackRouteParam';
import requireProps from 'app/data/requireProps';
import { updateFagsakInfo } from 'fagsak/duck';
import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingTilbakekrevingIndex from 'behandlingTilbakekreving/BehandlingTilbakekrevingIndex';
import BehandlingFpsakIndex from 'behandlingFpsak/BehandlingFpsakIndex';
import { setSelectedBehandlingId, getSelectedBehandlingId } from './duck';
import { getBehandlingerVersjonMappedById, getBehandlingerTypesMappedById } from './selectors/behandlingerSelectors';

/**
 * BehandlingIndex
 *
 * Container-komponent. Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 *
 * Komponenten har ansvar å legge valgt behandlingId fra URL-en i staten.
 */
const BehandlingIndex = ({
  saksnummer,
  behandlingId,
  behandlingVersjon,
  behandlingType,
  behandlingerVersjonMappedById,
  location,
}) => {
  if (behandlingType === BehandlingType.TILBAKEKREVING) {
    return (
      <BehandlingTilbakekrevingIndex
        saksnummer={saksnummer}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        updateFagsakInfo={updateFagsakInfo}
        behandlingerVersjonMappedById={behandlingerVersjonMappedById}
        location={location}
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
    />
  );
};

BehandlingIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number,
  behandlingType: PropTypes.string.isRequired,
  behandlingerVersjonMappedById: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

BehandlingIndex.defaultProps = {
  behandlingVersjon: undefined,
};

const mapStateToProps = (state) => {
  const behandlingId = getSelectedBehandlingId(state);
  return {
    behandlingId,
    saksnummer: getSelectedSaksnummer(state),
    behandlingerVersjonMappedById: getBehandlingerVersjonMappedById(state),
    behandlingVersjon: getBehandlingerVersjonMappedById(state)[behandlingId],
    behandlingType: getBehandlingerTypesMappedById(state)[behandlingId],
    location: state.router.location,
  };
};

export default trackRouteParam({
  paramName: 'behandlingId',
  parse: saksnummerFromUrl => Number.parseInt(saksnummerFromUrl, 10),
  paramPropType: PropTypes.number,
  storeParam: setSelectedBehandlingId,
  getParamFromStore: getSelectedBehandlingId,
})(connect(mapStateToProps)(requireProps(['behandlingId'])(BehandlingIndex)));
