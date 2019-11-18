import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';

import { DataFetcher } from '@fpsak-frontend/fp-felles';
import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';

import ApplicationContextPath from '../../behandling/ApplicationContextPath';
import { getEnabledApplicationContexts } from '../../app/duck';
import fpsakApi from '../../data/fpsakApi';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../../behandling/duck';

import styles from './historyIndex.less';

const historyRestApis = {
  [ApplicationContextPath.FPSAK]: fpsakApi.HISTORY_FPSAK,
  [ApplicationContextPath.FPTILBAKE]: fpsakApi.HISTORY_FPTILBAKE,
};

/**
 * HistoryIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
export const HistoryIndex = ({
  restApis,
  saksnummer,
  behandlingId,
  behandlingVersjon,
  location,
  alleKodeverkFpsak,
  alleKodeverkFptilbake,
}) => (
  <div className={styles.historyContainer}>
    <DataFetcher
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      showLoadingIcon
      behandlingNotRequired
      dataParams={{ saksnummer }}
      keepDataWhenRefetching
      data={restApis}
      render={(props) => Object.values(props)
        .reduce((acc, value) => acc.concat(value), [])
        .sort((a, b) => moment(b.opprettetTidspunkt) - moment(a.opprettetTidspunkt))
        .map((innslag) => (
          <HistorikkSakIndex
            key={innslag.opprettetTidspunkt}
            historieInnslag={innslag}
            saksnummer={saksnummer}
            location={location}
            alleKodeverk={innslag.erTilbakekreving ? alleKodeverkFptilbake : alleKodeverkFpsak}
          />
        ))}
    />
  </div>
);

HistoryIndex.propTypes = {
  restApis: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  saksnummer: PropTypes.number.isRequired,
  behandlingId: PropTypes.number,
  behandlingVersjon: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  alleKodeverkFpsak: PropTypes.shape().isRequired,
  alleKodeverkFptilbake: PropTypes.shape(),
};

HistoryIndex.defaultProps = {
  alleKodeverkFptilbake: {},
  behandlingId: undefined,
  behandlingVersjon: undefined,
};

export const getEnabledRestApis = createSelector(
  [getEnabledApplicationContexts],
  (enabledApplicationContexts) => enabledApplicationContexts.map((c) => historyRestApis[c]),
);

const mapStateToProps = (state) => ({
  restApis: getEnabledRestApis(state),
  saksnummer: getSelectedSaksnummer(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  alleKodeverkFpsak: fpsakApi.KODEVERK.getRestApiData()(state),
  alleKodeverkFptilbake: fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()(state),
});

export default withRouter(connect(mapStateToProps)(HistoryIndex));
