import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Location } from 'history';

import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import {
  Kodeverk, KodeverkMedNavn, Personopplysninger, FamilieHendelseSamling, Fagsak,
} from '@fpsak-frontend/types';

import { LoadingPanel, DataFetchPendingModal, requireProps } from '@fpsak-frontend/shared-components';
import { getRequestPollingMessage } from '@fpsak-frontend/rest-api-redux';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { getSelectedFagsak, getSelectedSaksnummer } from './fagsakSelectors';
import BehandlingerIndex from '../behandling/BehandlingerIndex';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import { setSelectedSaksnummer } from './duck';

import {
  erUrlUnderBehandling, erBehandlingValgt, behandlingerPath, pathToAnnenPart,
} from '../app/paths';
import FagsakResolver from './FagsakResolver';
import FagsakGrid from './components/FagsakGrid';
import { FpsakApiKeys, useRestApi } from '../data/fpsakApiNyUtenRedux';
import {
  getSelectedBehandlingId,
  getBehandlingVersjon,
  getBehandlingSprak,
  getBehandlingType, finnesVerge,
} from '../behandling/duck';
import { getAlleFpSakKodeverk } from '../kodeverk/duck';
import trackRouteParam from '../app/trackRouteParam';

const finnLenkeTilAnnenPart = (annenPartBehandling) => pathToAnnenPart(annenPartBehandling.saksnr.verdi, annenPartBehandling.behandlingId);

const erTilbakekreving = (behandlingType) => behandlingType && (BehandlingType.TILBAKEKREVING === behandlingType.kode
  || BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType.kode);

const NO_PARAMS = undefined;

interface OwnProps {
  selectedSaksnummer: number;
  behandlingId?: number;
  behandlingVersjon?: number;
  behandlingType?: Kodeverk;
  requestPendingMessage?: string;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
  sprakkode?: Kodeverk;
  fagsak?: Fagsak;
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
  selectedSaksnummer,
  requestPendingMessage,
  behandlingId,
  behandlingVersjon,
  behandlingType,
  alleKodeverk,
  sprakkode,
  fagsak,
  harVerge,
  location,
}) => {
  const skalIkkeHenteData = erUrlUnderBehandling(location) || (erBehandlingValgt(location) && !behandlingId);

  const options = {
    updateTriggers: [behandlingId, behandlingVersjon],
    keepData: true,
    suspendRequest: skalIkkeHenteData,
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

  return (
    <>
      <FagsakResolver key={selectedSaksnummer}>
        <FagsakGrid
          behandlingContent={<Route strict path={behandlingerPath} component={BehandlingerIndex} />}
          profileAndNavigationContent={<FagsakProfileIndex />}
          supportContent={<BehandlingSupportIndex />}
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
      </FagsakResolver>
      {requestPendingMessage && <DataFetchPendingModal pendingMessage={requestPendingMessage} />}
    </>
  );
};

const mapStateToProps = (state) => ({
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  behandlingType: getBehandlingType(state),
  selectedSaksnummer: getSelectedSaksnummer(state),
  requestPendingMessage: getRequestPollingMessage(state),
  alleKodeverk: getAlleFpSakKodeverk(state),
  sprakkode: getBehandlingSprak(state),
  fagsak: getSelectedFagsak(state),
  harVerge: finnesVerge(state),
});

export default trackRouteParam({
  paramName: 'saksnummer',
  parse: (saksnummerFromUrl) => Number.parseInt(saksnummerFromUrl, 10),
  storeParam: setSelectedSaksnummer,
  getParamFromStore: getSelectedSaksnummer,
})(connect(mapStateToProps)(requireProps(['selectedSaksnummer'])(FagsakIndex)));
