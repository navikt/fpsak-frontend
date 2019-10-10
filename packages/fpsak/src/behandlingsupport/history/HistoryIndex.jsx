import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { requireProps } from '@fpsak-frontend/fp-felles';
import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';

import fpsakApi from '../../data/fpsakApi';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';

import styles from './historyIndex.less';

/**
 * HistoryIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
export const HistoryIndex = ({
  alleHistorikkInnslag,
  saksnummer,
  location,
  alleKodeverkFpsak,
  alleKodeverkFptilbake,
}) => (
  <div className={styles.historyContainer}>
    {alleHistorikkInnslag.map((innslag) => (
      <HistorikkSakIndex
        key={innslag.opprettetTidspunkt}
        historieInnslag={innslag}
        saksnummer={saksnummer}
        location={location}
        alleKodeverk={innslag.erTilbakekreving ? alleKodeverkFptilbake : alleKodeverkFpsak}
      />
    ))}
  </div>
);

HistoryIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  alleHistorikkInnslag: PropTypes.arrayOf(PropTypes.object).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  alleKodeverkFpsak: PropTypes.shape().isRequired,
  alleKodeverkFptilbake: PropTypes.shape(),
};

HistoryIndex.defaultProps = {
  alleKodeverkFptilbake: {},
};

export const getAllHistorikk = createSelector(
  [fpsakApi.HISTORY_FPSAK.getRestApiData(), fpsakApi.HISTORY_FPTILBAKE.getRestApiData()],
  (historyFpsak = [], historyTilbake = []) => {
    const historikkFraTilbakekrevingMedMarkor = historyTilbake.map((ht) => ({
      ...ht,
      erTilbakekreving: true,
    }));
    return historyFpsak.concat(historikkFraTilbakekrevingMedMarkor).sort((a, b) => moment(b.opprettetTidspunkt) - moment(a.opprettetTidspunkt));
  },
);

const mapStateToProps = (state) => ({
  alleKodeverkFpsak: fpsakApi.KODEVERK.getRestApiData()(state),
  alleKodeverkFptilbake: fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()(state),
  saksnummer: getSelectedSaksnummer(state),
  alleHistorikkInnslag: getAllHistorikk(state),
});

export default withRouter(connect(mapStateToProps)(requireProps(['alleHistorikkInnslag'], <LoadingPanel />)(HistoryIndex)));
