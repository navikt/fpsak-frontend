/**
 * HistoryIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { getSelectedBehandlingId } from 'behandling/duck';
import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';
import requireProps from 'app/data/requireProps';

import History from './components/History';
import { getAllHistory } from '../behandlingsupportSelectors';

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
  history: getAllHistory(state),
});

export default withRouter(connect(mapStateToProps)(requireProps(['history'], <LoadingPanel />)(HistoryIndex)));
