/**
 * HistoryIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { getSelectedBehandlingId } from 'behandling/duck';
import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';
import requireProps from 'app/data/requireProps';
import fpsakApi from 'data/fpsakApi';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import History from './components/History';

export const HistoryIndex = ({
  history,
  selectedBehandlingId,
  saksnummer,
  location,
}) => (
  <History
    historyList={history}
    selectedBehandlingId={selectedBehandlingId ? `${selectedBehandlingId}` : null}
    saksNr={saksnummer}
    location={location}
  />
);

HistoryIndex.propTypes = {
  selectedBehandlingId: PropTypes.number,
  saksnummer: PropTypes.number.isRequired,
  history: PropTypes.arrayOf(PropTypes.object).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

HistoryIndex.defaultProps = {
  selectedBehandlingId: undefined,
};

const mapStateToProps = state => ({
  selectedBehandlingId: getSelectedBehandlingId(state),
  saksnummer: getSelectedSaksnummer(state),
  history: fpsakApi.HISTORY.getRestApiData()(state),
});

export default withRouter(connect(mapStateToProps)(requireProps(['history'], <LoadingPanel />)(HistoryIndex)));
