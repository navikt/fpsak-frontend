import React, {
  FunctionComponent, useState, useEffect, useCallback, useMemo,
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Location } from 'history';
import { createSelector } from 'reselect';
import { Redirect, withRouter } from 'react-router-dom';

import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import BehandlingVelgerSakIndex from '@fpsak-frontend/sak-behandling-velger';
import FagsakProfilSakIndex from '@fpsak-frontend/sak-fagsak-profil';
import {
  KodeverkMedNavn, Behandling, Fagsak,
} from '@fpsak-frontend/types';
import { DataFetcher, DataFetcherTriggers, EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';

import {
  getLocationWithDefaultProsessStegAndFakta,
  pathToBehandling,
  pathToBehandlinger,
} from '../app/paths';
import BehandlingMenuDataResolver from '../behandlingmenu/BehandlingMenuDataResolver';
import fpsakApi from '../data/fpsakApi';
import { getNoExistingBehandlinger } from '../behandling/selectors/behandlingerSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../behandling/duck';
import RisikoklassifiseringIndex from './risikoklassifisering/RisikoklassifiseringIndex';
import ApplicationContextPath from '../app/ApplicationContextPath';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import { FpsakApiKeys, useRestApi, requestApi } from '../data/fpsakApiNyUtenRedux';
import { useFpSakKodeverkMedNavn, useGetKodeverkFn } from '../data/useKodeverk';

import styles from './fagsakProfileIndex.less';

const behandlingerRestApis = {
  [ApplicationContextPath.FPSAK]: fpsakApi.BEHANDLINGER_FPSAK,
  [ApplicationContextPath.FPTILBAKE]: fpsakApi.BEHANDLINGER_FPTILBAKE,
};

export const getAlleBehandlinger = createSelector<{ behandlingerFpsak?: Behandling[]; behandlingerFptilbake?: Behandling[] }, Behandling[], Behandling[]>(
  [(props) => props.behandlingerFpsak, (props) => props.behandlingerFptilbake],
  (behandlingerFpsak = [], behandlingerFptilbake = []) => behandlingerFpsak.concat(behandlingerFptilbake),
);

const findPathToBehandling = (saksnummer, location, alleBehandlinger) => {
  if (alleBehandlinger.length === 1) {
    return getLocationWithDefaultProsessStegAndFakta({
      ...location,
      pathname: pathToBehandling(saksnummer, alleBehandlinger[0].id),
    });
  }
  return pathToBehandlinger(saksnummer);
};

const NO_PARAMS = {};

interface OwnProps {
  fagsak: Fagsak;
  enabledApis: EndpointOperations[];
  selectedBehandlingId?: number;
  noExistingBehandlinger: boolean;
  behandlingVersjon?: number;
  shouldRedirectToBehandlinger: boolean;
  location: Location;
}

export const FagsakProfileIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  selectedBehandlingId,
  behandlingVersjon,
  noExistingBehandlinger,
  location,
  shouldRedirectToBehandlinger,
}) => {
  const [showAll, setShowAll] = useState(!selectedBehandlingId);
  const toggleShowAll = useCallback(() => setShowAll(!showAll), [showAll]);

  const getKodeverkFn = useGetKodeverkFn();

  const fagsakStatusMedNavn = useFpSakKodeverkMedNavn<KodeverkMedNavn>(fagsak.status);
  const fagsakYtelseTypeMedNavn = useFpSakKodeverkMedNavn<KodeverkMedNavn>(fagsak.sakstype);

  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const enabledApis = useMemo(() => enabledApplicationContexts.map((api) => behandlingerRestApis[api]), [enabledApplicationContexts]);

  const { data: risikoAksjonspunkt, state: risikoAksjonspunktState } = useRestApi(FpsakApiKeys.RISIKO_AKSJONSPUNKT, NO_PARAMS, {
    updateTriggers: [selectedBehandlingId, behandlingVersjon],
    suspendRequest: !requestApi.hasPath(FpsakApiKeys.RISIKO_AKSJONSPUNKT),
  });
  const { data: kontrollresultat, state: kontrollresultatState } = useRestApi(FpsakApiKeys.KONTROLLRESULTAT, NO_PARAMS, {
    updateTriggers: [selectedBehandlingId, behandlingVersjon],
    suspendRequest: !requestApi.hasPath(FpsakApiKeys.KONTROLLRESULTAT),
  });

  useEffect(() => {
    setShowAll(!selectedBehandlingId);
  }, [selectedBehandlingId]);

  const getBehandlingLocation = useCallback((behandlingId) => getLocationWithDefaultProsessStegAndFakta({
    ...location,
    pathname: pathToBehandling(fagsak.saksnummer, behandlingId),
  }), [fagsak.saksnummer]);

  return (
    <div className={styles.panelPadding}>
      <DataFetcher
        fetchingTriggers={new DataFetcherTriggers({ behandlingId: selectedBehandlingId, behandlingVersion: behandlingVersjon }, false)}
        endpointParams={{
          [fpsakApi.BEHANDLINGER_FPSAK.name]: { saksnummer: fagsak.saksnummer },
          [fpsakApi.BEHANDLINGER_FPTILBAKE.name]: { saksnummer: fagsak.saksnummer },
        }}
        showOldDataWhenRefetching
        endpoints={enabledApis}
        loadingPanel={<LoadingPanel />}
        render={(dataProps) => {
          const alleBehandlinger = getAlleBehandlinger(dataProps);
          if (shouldRedirectToBehandlinger) {
            return <Redirect to={findPathToBehandling(fagsak.saksnummer, location, alleBehandlinger)} />;
          }
          return (
            <FagsakProfilSakIndex
              saksnummer={fagsak.saksnummer}
              fagsakYtelseType={fagsakYtelseTypeMedNavn}
              fagsakStatus={fagsakStatusMedNavn}
              dekningsgrad={fagsak.dekningsgrad}
              renderBehandlingMeny={() => <BehandlingMenuDataResolver fagsak={fagsak} />}
              renderBehandlingVelger={() => (
                <BehandlingVelgerSakIndex
                  behandlinger={alleBehandlinger}
                  getBehandlingLocation={getBehandlingLocation}
                  noExistingBehandlinger={noExistingBehandlinger}
                  behandlingId={selectedBehandlingId}
                  showAll={showAll}
                  toggleShowAll={toggleShowAll}
                  getKodeverkFn={getKodeverkFn}
                />
              )}
            />
          );
        }}
      />
      {(kontrollresultatState === RestApiState.LOADING || risikoAksjonspunktState === RestApiState.LOADING) && (
        <LoadingPanel />
      )}
      {(kontrollresultatState === RestApiState.SUCCESS && risikoAksjonspunktState === RestApiState.SUCCESS) && (
        <RisikoklassifiseringIndex
          fagsak={fagsak}
          risikoAksjonspunkt={risikoAksjonspunkt}
          kontrollresultat={kontrollresultat}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  selectedBehandlingId: getSelectedBehandlingId(state),
  noExistingBehandlinger: getNoExistingBehandlinger(state),
  behandlingVersjon: getBehandlingVersjon(state),
  shouldRedirectToBehandlinger: ownProps.match.isExact,
});

export default withRouter(
  connect(
    mapStateToProps,
  )(requireProps(['fagsak'], <LoadingPanel />)(FagsakProfileIndex)),
);
