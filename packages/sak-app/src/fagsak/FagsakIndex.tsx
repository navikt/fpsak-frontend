import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { Location } from 'history';

import { RestApiState, useGlobalStateRestApiData } from '@fpsak-frontend/rest-api-hooks';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import {
  Kodeverk, KodeverkMedNavn, Personopplysninger, FamilieHendelseSamling, Fagsak,
} from '@fpsak-frontend/types';

import { LoadingPanel, DataFetchPendingModal } from '@fpsak-frontend/shared-components';
import { getRequestPollingMessage } from '@fpsak-frontend/rest-api-redux';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import useTrackRouteParam from '../app/useTrackRouteParam';
import BehandlingerIndex from '../behandling/BehandlingerIndex';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';

import {
  pathToMissingPage, erUrlUnderBehandling, erBehandlingValgt, behandlingerPath, pathToAnnenPart,
} from '../app/paths';
import FagsakGrid from './components/FagsakGrid';
import { FpsakApiKeys, useRestApi } from '../data/fpsakApiNyUtenRedux';
import {
  getSelectedBehandlingId,
  getBehandlingVersjon,
  getBehandlingSprak,
  getBehandlingType, finnesVerge,
} from '../behandling/duck';

const finnLenkeTilAnnenPart = (annenPartBehandling) => pathToAnnenPart(annenPartBehandling.saksnr.verdi, annenPartBehandling.behandlingId);

const erTilbakekreving = (behandlingType) => behandlingType && (BehandlingType.TILBAKEKREVING === behandlingType.kode
  || BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType.kode);

const NO_PARAMS = undefined;

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  behandlingType?: Kodeverk;
  requestPendingMessage?: string;
  sprakkode?: Kodeverk;
  harVerge: boolean;
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
  behandlingType,
  sprakkode,
  harVerge,
  location,
}) => {
  const { selected: selectedSaksnummer } = useTrackRouteParam<number>({
    paramName: 'saksnummer',
    parse: (saksnummerFromUrl) => Number.parseInt(saksnummerFromUrl, 10),
  });

  const alleKodeverk = useGlobalStateRestApiData<{[key: string]: [KodeverkMedNavn]}>(FpsakApiKeys.KODEVERK);

  const { data: fagsak, state: fagsakState } = useRestApi<Fagsak>(FpsakApiKeys.FETCH_FAGSAK, { saksnummer: selectedSaksnummer }, {
    updateTriggers: [selectedSaksnummer, behandlingId, behandlingVersjon],
    suspendRequest: !selectedSaksnummer,
    keepData: true,
  });

  const skalIkkeHenteData = !selectedSaksnummer || erUrlUnderBehandling(location) || (erBehandlingValgt(location) && !behandlingId);

  const options = {
    updateTriggers: [skalIkkeHenteData, behandlingId, behandlingVersjon],
    suspendRequest: skalIkkeHenteData,
    keepData: true,
  };

  const {
    data: behandlingPersonopplysninger, state: personopplysningerState,
  } = useRestApi<Personopplysninger>(FpsakApiKeys.BEHANDLING_PERSONOPPLYSNINGER, NO_PARAMS, options);
  const {
    data: behandlingFamilieHendelse, state: familieHendelseState,
  } = useRestApi<FamilieHendelseSamling>(FpsakApiKeys.BEHANDLING_FAMILIE_HENDELSE, NO_PARAMS, options);
  const {
    data: annenPartBehandling, state: annenPartState,
  } = useRestApi<AnnenPartBehandling>(FpsakApiKeys.ANNEN_PART_BEHANDLING, { saksnummer: selectedSaksnummer }, options);

  if (!fagsak) {
    if (fagsakState === RestApiState.NOT_STARTED || fagsakState === RestApiState.LOADING) {
      return <LoadingPanel />;
    }
    return <Redirect to={pathToMissingPage()} />;
  }
  if (fagsak.saksnummer !== selectedSaksnummer) {
    return <Redirect to={pathToMissingPage()} />;
  }

  return (
    <>
      <FagsakGrid
        behandlingContent={
          <Route strict path={behandlingerPath} render={(props) => <BehandlingerIndex {...props} fagsak={fagsak} />} />
        }
        profileAndNavigationContent={<FagsakProfileIndex fagsak={fagsak} />}
        supportContent={<BehandlingSupportIndex fagsak={fagsak} />}
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
              sprakkode={sprakkode}
              fagsak={fagsak}
              harTilbakekrevingVerge={erTilbakekreving(behandlingType) && harVerge}
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
  behandlingType: getBehandlingType(state),
  requestPendingMessage: getRequestPollingMessage(state),
  sprakkode: getBehandlingSprak(state),
  harVerge: finnesVerge(state),
});

export default connect(mapStateToProps)(FagsakIndex);
