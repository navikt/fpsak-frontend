import React, {
  FunctionComponent, useMemo, useState, useCallback,
} from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { Location } from 'history';

import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import {
  KodeverkMedNavn, Personopplysninger, FamilieHendelseSamling, Fagsak,
} from '@fpsak-frontend/types';

import { LoadingPanel, DataFetchPendingModal } from '@fpsak-frontend/shared-components';
import { getRequestPollingMessage } from '@fpsak-frontend/rest-api-redux';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import BehandlingerIndex from '../behandling/BehandlingerIndex';
import useBehandlingEndret from '../behandling/useBehandligEndret';
import useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import ApplicationContextPath from '../app/ApplicationContextPath';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import {
  pathToMissingPage, erUrlUnderBehandling, erBehandlingValgt, behandlingerPath, pathToAnnenPart,
} from '../app/paths';
import FagsakGrid from './components/FagsakGrid';
import { FpsakApiKeys, restApiHooks } from '../data/fpsakApi';
import {
  getSelectedBehandlingId,
  getBehandlingVersjon,
} from '../behandling/duck';
import BehandlingAppKontekst from '../behandling/behandlingAppKontekstTsType';

const finnLenkeTilAnnenPart = (annenPartBehandling) => pathToAnnenPart(annenPartBehandling.saksnr.verdi, annenPartBehandling.behandlingId);

const erTilbakekreving = (behandlingType) => behandlingType && (BehandlingType.TILBAKEKREVING === behandlingType.kode
  || BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType.kode);

const NO_PARAMS = undefined;

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  requestPendingMessage?: string;
  location: Location;
}

interface AnnenPartBehandling {
  saksnr: {
    verdi: string;
  };
  behandlingId: number;
}

/**
 * FagsakIndex
 *
 * Container komponent. Er rot for for fagsakdelen av hovedvinduet, og har ansvar å legge valgt saksnummer fra URL-en i staten.
 */
export const FagsakIndex: FunctionComponent<OwnProps> = ({
  requestPendingMessage,
  behandlingId,
  behandlingVersjon,
  location,
}) => {
  const [behandlingerTeller, setBehandlingTeller] = useState(0);
  const oppfriskBehandlinger = useCallback(() => setBehandlingTeller(behandlingerTeller + 1), [behandlingerTeller]);

  const { selected: selectedSaksnummer } = useTrackRouteParam<number>({
    paramName: 'saksnummer',
    parse: (saksnummerFromUrl) => Number.parseInt(saksnummerFromUrl, 10),
  });

  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<{[key: string]: [KodeverkMedNavn]}>(FpsakApiKeys.KODEVERK);

  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);

  const { data: fagsak, state: fagsakState } = restApiHooks.useRestApi<Fagsak>(FpsakApiKeys.FETCH_FAGSAK, { saksnummer: selectedSaksnummer }, {
    updateTriggers: [selectedSaksnummer, behandlingId, behandlingVersjon],
    suspendRequest: !selectedSaksnummer || erBehandlingEndretFraUndefined,
    keepData: true,
  });

  const enabledApplicationContexts = useGetEnabledApplikasjonContext();

  const { data: behandlingerFpSak, state: behandlingerFpSakState } = restApiHooks.useRestApi<BehandlingAppKontekst[]>(
    FpsakApiKeys.BEHANDLINGER_FPSAK, { saksnummer: selectedSaksnummer }, {
      updateTriggers: [selectedSaksnummer, behandlingId, behandlingVersjon, behandlingerTeller],
      suspendRequest: !selectedSaksnummer || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );
  const { data: behandlingerFpTilbake } = restApiHooks.useRestApi<BehandlingAppKontekst[]>(
    FpsakApiKeys.BEHANDLINGER_FPTILBAKE, { saksnummer: selectedSaksnummer }, {
      updateTriggers: [selectedSaksnummer, behandlingId, behandlingVersjon, behandlingerTeller],
      suspendRequest: !selectedSaksnummer || !enabledApplicationContexts.includes(ApplicationContextPath.FPTILBAKE)
      || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const alleBehandlinger = useMemo(() => [...(behandlingerFpSak || []), ...(behandlingerFpTilbake || [])],
    [behandlingerFpSak, behandlingerFpTilbake]);

  const skalIkkeHenteData = !selectedSaksnummer || erUrlUnderBehandling(location) || (erBehandlingValgt(location) && !behandlingId);

  const options = {
    updateTriggers: [skalIkkeHenteData, behandlingId, behandlingVersjon],
    suspendRequest: skalIkkeHenteData,
    keepData: true,
  };

  const {
    data: behandlingPersonopplysninger, state: personopplysningerState,
  } = restApiHooks.useRestApi<Personopplysninger>(FpsakApiKeys.BEHANDLING_PERSONOPPLYSNINGER, NO_PARAMS, options);
  const {
    data: behandlingFamilieHendelse, state: familieHendelseState,
  } = restApiHooks.useRestApi<FamilieHendelseSamling>(FpsakApiKeys.BEHANDLING_FAMILIE_HENDELSE, NO_PARAMS, options);
  const {
    data: annenPartBehandling, state: annenPartState,
  } = restApiHooks.useRestApi<AnnenPartBehandling>(FpsakApiKeys.ANNEN_PART_BEHANDLING, { saksnummer: selectedSaksnummer }, options);

  if (!fagsak) {
    if (fagsakState === RestApiState.NOT_STARTED || fagsakState === RestApiState.LOADING) {
      return <LoadingPanel />;
    }
    return <Redirect to={pathToMissingPage()} />;
  }
  if (fagsak.saksnummer !== selectedSaksnummer) {
    return <Redirect to={pathToMissingPage()} />;
  }

  const behandling = alleBehandlinger.find((b) => b.id === behandlingId);
  const harVerge = behandling ? behandling.harVerge : false;

  return (
    <>
      <FagsakGrid
        behandlingContent={
          <Route strict path={behandlingerPath} render={(props) => <BehandlingerIndex {...props} fagsak={fagsak} alleBehandlinger={alleBehandlinger} />} />
        }
        profileAndNavigationContent={(
          <FagsakProfileIndex
            fagsak={fagsak}
            alleBehandlinger={alleBehandlinger}
            harHentetBehandlinger={!!behandlingerFpSak || behandlingerFpSakState === RestApiState.SUCCESS}
            oppfriskBehandlinger={oppfriskBehandlinger}
          />
        )}
        supportContent={<BehandlingSupportIndex fagsak={fagsak} alleBehandlinger={alleBehandlinger} />}
        visittkortContent={() => {
          if (skalIkkeHenteData) {
            return null;
          }

          if (personopplysningerState === RestApiState.LOADING || familieHendelseState === RestApiState.LOADING || annenPartState === RestApiState.LOADING) {
            return <LoadingPanel />;
          }

          return (
            <VisittkortSakIndex
              personopplysninger={behandlingPersonopplysninger}
              familieHendelse={behandlingFamilieHendelse}
              lenkeTilAnnenPart={annenPartBehandling ? finnLenkeTilAnnenPart(annenPartBehandling) : undefined}
              alleKodeverk={alleKodeverk}
              sprakkode={behandling?.sprakkode}
              fagsak={fagsak}
              harTilbakekrevingVerge={erTilbakekreving(behandling?.type) && harVerge}
            />
          );
        }}
      />
      {requestPendingMessage && <DataFetchPendingModal pendingMessage={requestPendingMessage} />}
    </>
  );
};

const mapStateToProps = (state) => ({
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  requestPendingMessage: getRequestPollingMessage(state),
});

export default connect(mapStateToProps)(FagsakIndex);
