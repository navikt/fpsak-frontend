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
import { requireProps } from '@fpsak-frontend/fp-felles';
import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';

import fpsakApi from '../../data/fpsakApi';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';
import { getAllHistory } from '../behandlingsupportSelectors';

export const HistoryIndex = ({
  history,
  saksnummer,
  location,
  alleKodeverkFpsak,
  alleKodeverkFptilbake,
}) => (
  <HistorikkSakIndex
    historyList={history}
    saksnummer={saksnummer}
    location={location}
    alleKodeverkFpsak={alleKodeverkFpsak}
    alleKodeverkFptilbake={alleKodeverkFptilbake}
  />
);

HistoryIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  history: PropTypes.arrayOf(PropTypes.object).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  alleKodeverkFpsak: PropTypes.shape().isRequired,
  alleKodeverkFptilbake: PropTypes.shape(),
};

HistoryIndex.defaultProps = {
  alleKodeverkFptilbake: {},
};

const mapStateToProps = (state) => ({
  alleKodeverkFpsak: fpsakApi.KODEVERK.getRestApiData()(state),
  alleKodeverkFptilbake: fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()(state),
  saksnummer: getSelectedSaksnummer(state),
  history: getAllHistory(state),
});

export default withRouter(connect(mapStateToProps)(requireProps(['history'], <LoadingPanel />)(HistoryIndex)));
