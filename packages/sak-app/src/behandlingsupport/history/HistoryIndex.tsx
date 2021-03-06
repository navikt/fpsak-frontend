import React, { FunctionComponent, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Location } from 'history';
import { createSelector } from 'reselect';
import moment from 'moment';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';
import { KodeverkMedNavn, Kodeverk } from '@fpsak-frontend/types';
import { DataFetcher, DataFetcherTriggers, EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { pathToBehandling, createLocationForSkjermlenke } from '../../app/paths';
import ApplicationContextPath from '../../behandling/ApplicationContextPath';
import { getEnabledApplicationContexts } from '../../app/duck';
import fpsakApi from '../../data/fpsakApi';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../../behandling/duck';

const historyRestApis = {
  [ApplicationContextPath.FPSAK]: fpsakApi.HISTORY_FPSAK,
  [ApplicationContextPath.FPTILBAKE]: fpsakApi.HISTORY_FPTILBAKE,
};

interface History {
  opprettetTidspunkt: string;
  erTilbakekreving?: boolean;
  type: Kodeverk;
}

const sortAndTagTilbakekreving = createSelector<{ historyFpsak: History[]; historyFptilbake?: History[] }, History[], History[]>(
  [(props) => props.historyFpsak, (props) => props.historyFptilbake],
  (historyFpsak = [], historyFptilbake = []) => {
    const historikkFraTilbakekrevingMedMarkor = historyFptilbake.map((ht) => ({
      ...ht,
      erTilbakekreving: true,
    }));
    return historyFpsak.concat(historikkFraTilbakekrevingMedMarkor).sort((a, b) => moment(b.opprettetTidspunkt).diff(moment(a.opprettetTidspunkt)));
  },
);

interface OwnProps {
  enabledContexts: EndpointOperations[];
  saksnummer: number;
  behandlingId?: number;
  behandlingVersjon?: number;
  location: Location;
  alleKodeverkFpsak: {[key: string]: [KodeverkMedNavn]};
  alleKodeverkFptilbake?: {[key: string]: [KodeverkMedNavn]};
}

/**
 * HistoryIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
export const HistoryIndex: FunctionComponent<OwnProps> = ({
  enabledContexts,
  saksnummer,
  behandlingId,
  behandlingVersjon,
  location,
  alleKodeverkFpsak,
  alleKodeverkFptilbake = {},
}) => {
  const getBehandlingLocation = useCallback((bId) => ({
    ...location,
    pathname: pathToBehandling(saksnummer, bId),
  }), [location]);

  return (
    <DataFetcher
      fetchingTriggers={new DataFetcherTriggers({ behandlingId, behandlingVersion: behandlingVersjon }, false)}
      endpointParams={{ [fpsakApi.HISTORY_FPSAK.name]: { saksnummer }, [fpsakApi.HISTORY_FPTILBAKE.name]: { saksnummer } }}
      showOldDataWhenRefetching
      endpoints={enabledContexts}
      loadingPanel={<LoadingPanel />}
      render={(props) => sortAndTagTilbakekreving(props)
        .map((innslag) => (
          <HistorikkSakIndex
            key={innslag.opprettetTidspunkt + innslag.type.kode}
            historieInnslag={innslag}
            saksnummer={saksnummer}
            alleKodeverk={innslag.erTilbakekreving ? alleKodeverkFptilbake : alleKodeverkFpsak}
            getBehandlingLocation={getBehandlingLocation}
            createLocationForSkjermlenke={createLocationForSkjermlenke}
          />
        ))}
    />
  );
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
