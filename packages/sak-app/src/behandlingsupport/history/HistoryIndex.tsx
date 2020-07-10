import React, {
  FunctionComponent, useCallback, useMemo,
} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Location } from 'history';
import moment from 'moment';

import { useGlobalStateRestApiData, RestApiState } from '@fpsak-frontend/rest-api-hooks';
import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';
import { KodeverkMedNavn, Kodeverk } from '@fpsak-frontend/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { FpsakApiKeys, useRestApi } from '../../data/fpsakApiNyUtenRedux';
import { pathToBehandling, createLocationForSkjermlenke } from '../../app/paths';
import ApplicationContextPath from '../../app/ApplicationContextPath';
import useGetEnabledApplikasjonContext from '../../app/useGetEnabledApplikasjonContext';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../../behandling/duck';

interface History {
  opprettetTidspunkt: string;
  erTilbakekreving?: boolean;
  type: Kodeverk;
}

const sortAndTagTilbakekreving = (historyFpsak = [], historyFptilbake = []) => {
  const historikkFraTilbakekrevingMedMarkor = historyFptilbake.map((ht) => ({
    ...ht,
    erTilbakekreving: true,
  }));
  return historyFpsak.concat(historikkFraTilbakekrevingMedMarkor).sort((a, b) => moment(b.opprettetTidspunkt).diff(moment(a.opprettetTidspunkt)));
};

interface OwnProps {
  saksnummer: number;
  behandlingId?: number;
  behandlingVersjon?: number;
  location: Location;
}

/**
 * HistoryIndex
 *
 * Container komponent. Har ansvar for å hente historiken for en fagsak fra state og vise den
 */
export const HistoryIndex: FunctionComponent<OwnProps> = ({
  saksnummer,
  behandlingId,
  behandlingVersjon,
  location,
}) => {
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();

  const alleKodeverkFpSak = useGlobalStateRestApiData<{[key: string]: KodeverkMedNavn[]}>(FpsakApiKeys.KODEVERK);
  const alleKodeverkFpTilbake = useGlobalStateRestApiData<{[key: string]: KodeverkMedNavn[]}>(FpsakApiKeys.KODEVERK_FPTILBAKE);

  const getBehandlingLocation = useCallback((bId) => ({
    ...location,
    pathname: pathToBehandling(saksnummer, bId),
  }), [location]);

  const skalBrukeFpTilbakeHistorikk = enabledApplicationContexts.includes(ApplicationContextPath.FPTILBAKE);

  const { data: historikkFpSak, state: historikkFpSakState } = useRestApi<History[]>(FpsakApiKeys.HISTORY_FPSAK, { saksnummer }, {
    updateTriggers: [behandlingId, behandlingVersjon],
  });
  const { data: historikkFpTilbake, state: historikkFpTilbakeState } = useRestApi<History[]>(FpsakApiKeys.HISTORY_FPTILBAKE, { saksnummer }, {
    updateTriggers: [behandlingId, behandlingVersjon],
    suspendRequest: !skalBrukeFpTilbakeHistorikk,
  });

  const historikkInnslag = useMemo(() => sortAndTagTilbakekreving(historikkFpSak, historikkFpTilbake), [historikkFpSak, historikkFpTilbake]);

  if (historikkFpSakState === RestApiState.LOADING || (skalBrukeFpTilbakeHistorikk && historikkFpTilbakeState === RestApiState.LOADING)) {
    return <LoadingPanel />;
  }

  return historikkInnslag.map((innslag) => (
    <HistorikkSakIndex
      key={innslag.opprettetTidspunkt + innslag.type.kode}
      historieInnslag={innslag}
      saksnummer={saksnummer}
      alleKodeverk={innslag.erTilbakekreving ? alleKodeverkFpTilbake : alleKodeverkFpSak}
      getBehandlingLocation={getBehandlingLocation}
      createLocationForSkjermlenke={createLocationForSkjermlenke}
    />
  ));
};

const mapStateToProps = (state) => ({
  saksnummer: getSelectedSaksnummer(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
});

export default withRouter(connect(mapStateToProps)(HistoryIndex));
