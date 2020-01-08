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

const sortAndTagTilbakekreving = createSelector(
  [(props) => props.historyFpsak, (props) => props.historyFptilbake],
  (historyFpsak = [], historyFptilbake = []) => {
    const historikkFraTilbakekrevingMedMarkor = historyFptilbake.map((ht) => ({
      ...ht,
      erTilbakekreving: true,
    }));
    return historyFpsak.concat(historikkFraTilbakekrevingMedMarkor).sort((a, b) => moment(b.opprettetTidspunkt) - moment(a.opprettetTidspunkt));
  },
);


/**
 * HistoryIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
export const HistoryIndex = ({
  enabledContexts,
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
      endpointParams={{ saksnummer }}
      keepDataWhenRefetching
      endpoints={enabledContexts}
      allowErrors
      render={(props) => sortAndTagTilbakekreving(props)
        .map((innslag) => (
          <HistorikkSakIndex
            key={innslag.opprettetTidspunkt + innslag.type.kode}
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
  enabledContexts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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

const getEnabledContexts = createSelector(
  [getEnabledApplicationContexts],
  (enabledApplicationContexts) => enabledApplicationContexts.map((c) => historyRestApis[c]),
);

const mapStateToProps = (state) => ({
  enabledContexts: getEnabledContexts(state),
  saksnummer: getSelectedSaksnummer(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  alleKodeverkFpsak: fpsakApi.KODEVERK.getRestApiData()(state),
  alleKodeverkFptilbake: fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()(state),
});

export default withRouter(connect(mapStateToProps)(HistoryIndex));
