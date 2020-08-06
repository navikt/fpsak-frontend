import React, {
  FunctionComponent, useState, useEffect, useCallback,
} from 'react';
import { connect } from 'react-redux';
import { Location } from 'history';
import { Redirect, withRouter } from 'react-router-dom';

import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import BehandlingVelgerSakIndex from '@fpsak-frontend/sak-behandling-velger';
import FagsakProfilSakIndex from '@fpsak-frontend/sak-fagsak-profil';
import {
  KodeverkMedNavn, Fagsak, Aksjonspunkt, Risikoklassifisering,
} from '@fpsak-frontend/types';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';

import {
  getLocationWithDefaultProsessStegAndFakta,
  pathToBehandling,
  pathToBehandlinger,
} from '../app/paths';
import BehandlingMenuDataResolver from '../behandlingmenu/BehandlingMenuDataResolver';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../behandling/duck';
import RisikoklassifiseringIndex from './risikoklassifisering/RisikoklassifiseringIndex';
import { FpsakApiKeys, useRestApi, requestApi } from '../data/fpsakApi';
import { useFpSakKodeverkMedNavn, useGetKodeverkFn } from '../data/useKodeverk';

import styles from './fagsakProfileIndex.less';
import BehandlingAppKontekst from '../behandling/behandlingAppKontekstTsType';

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
  alleBehandlinger: BehandlingAppKontekst[];
  selectedBehandlingId?: number;
  behandlingVersjon?: number;
  shouldRedirectToBehandlinger: boolean;
  location: Location;
  harHentetBehandlinger: boolean;
  oppfriskBehandlinger: () => void;
}

export const FagsakProfileIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger,
  harHentetBehandlinger,
  selectedBehandlingId,
  behandlingVersjon,
  location,
  shouldRedirectToBehandlinger,
  oppfriskBehandlinger,
}) => {
  const [showAll, setShowAll] = useState(!selectedBehandlingId);
  const toggleShowAll = useCallback(() => setShowAll(!showAll), [showAll]);

  const getKodeverkFn = useGetKodeverkFn();

  const fagsakStatusMedNavn = useFpSakKodeverkMedNavn<KodeverkMedNavn>(fagsak.status);
  const fagsakYtelseTypeMedNavn = useFpSakKodeverkMedNavn<KodeverkMedNavn>(fagsak.sakstype);

  const { data: risikoAksjonspunkt, state: risikoAksjonspunktState } = useRestApi<Aksjonspunkt>(FpsakApiKeys.RISIKO_AKSJONSPUNKT, NO_PARAMS, {
    updateTriggers: [selectedBehandlingId, behandlingVersjon],
    suspendRequest: !requestApi.hasPath(FpsakApiKeys.RISIKO_AKSJONSPUNKT),
  });
  const { data: kontrollresultat, state: kontrollresultatState } = useRestApi<Risikoklassifisering>(FpsakApiKeys.KONTROLLRESULTAT, NO_PARAMS, {
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
      {!harHentetBehandlinger && (
        <LoadingPanel />
      )}
      {harHentetBehandlinger && shouldRedirectToBehandlinger && (
        <Redirect to={findPathToBehandling(fagsak.saksnummer, location, alleBehandlinger)} />
      )}
      {harHentetBehandlinger && !shouldRedirectToBehandlinger && (
        <FagsakProfilSakIndex
          saksnummer={fagsak.saksnummer}
          fagsakYtelseType={fagsakYtelseTypeMedNavn}
          fagsakStatus={fagsakStatusMedNavn}
          dekningsgrad={fagsak.dekningsgrad}
          renderBehandlingMeny={() => (
            <BehandlingMenuDataResolver
              fagsak={fagsak}
              alleBehandlinger={alleBehandlinger}
              oppfriskBehandlinger={oppfriskBehandlinger}
            />
          )}
          renderBehandlingVelger={() => (
            <BehandlingVelgerSakIndex
              behandlinger={alleBehandlinger}
              getBehandlingLocation={getBehandlingLocation}
              noExistingBehandlinger={alleBehandlinger.length === 0}
              behandlingId={selectedBehandlingId}
              showAll={showAll}
              toggleShowAll={toggleShowAll}
              getKodeverkFn={getKodeverkFn}
            />
          )}
        />
      )}
      {(kontrollresultatState === RestApiState.LOADING || risikoAksjonspunktState === RestApiState.LOADING) && (
        <LoadingPanel />
      )}
      {(kontrollresultatState === RestApiState.SUCCESS && risikoAksjonspunktState === RestApiState.SUCCESS) && (
        <RisikoklassifiseringIndex
          fagsak={fagsak}
          alleBehandlinger={alleBehandlinger}
          risikoAksjonspunkt={risikoAksjonspunkt}
          kontrollresultat={kontrollresultat}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  selectedBehandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  shouldRedirectToBehandlinger: ownProps.match.isExact,
});

export default withRouter(
  connect(
    mapStateToProps,
  )(requireProps(['fagsak'], <LoadingPanel />)(FagsakProfileIndex)),
);
