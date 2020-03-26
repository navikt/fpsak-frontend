import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import { getRequestPollingMessage } from '@fpsak-frontend/rest-api-redux';
import { DataFetchPendingModal, requireProps } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn, Kodeverk, Fagsak } from '@fpsak-frontend/types';

import DataFetcher from '../app/DataFetcher';
import { getSelectedFagsak, getSelectedSaksnummer } from './fagsakSelectors';
import BehandlingerIndex from '../behandling/BehandlingerIndex';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import { setSelectedSaksnummer } from './duck';

import { behandlingerPath, pathToAnnenPart } from '../app/paths';
import FagsakResolver from './FagsakResolver';
import FagsakGrid from './components/FagsakGrid';
import {
  getSelectedBehandlingId, getBehandlingVersjon, getBehandlingSprak, getUrlBehandlingId,
} from '../behandling/duck';
import fpsakApi from '../data/fpsakApi';
import { getAlleFpSakKodeverk } from '../kodeverk/duck';
import trackRouteParam from '../app/trackRouteParam';

const endepunkter = [fpsakApi.BEHANDLING_PERSONOPPLYSNINGER, fpsakApi.BEHANDLING_FAMILIE_HENDELSE, fpsakApi.ANNEN_PART_BEHANDLING];
const ingenEndepunkter = [];

const finnLenkeTilAnnenPart = (annenPartBehandling) => pathToAnnenPart(annenPartBehandling.saksnr.verdi, annenPartBehandling.behandlingId);

interface OwnProps {
  harValgtBehandling: boolean;
  behandlingId?: number;
  behandlingVersjon?: number;
  selectedSaksnummer: number;
  requestPendingMessage?: string;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
  sprakkode?: Kodeverk;
  fagsak?: Fagsak;
}

/**
 * FagsakIndex
 *
 * Container komponent. Er rot for for fagsakdelen av hovedvinduet, og har ansvar å legge valgt saksnummer fra URL-en i staten.
 */
export const FagsakIndex: FunctionComponent<OwnProps> = ({
  harValgtBehandling,
  selectedSaksnummer,
  requestPendingMessage,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  sprakkode,
  fagsak,
}) => (
  <>
    <FagsakResolver key={selectedSaksnummer}>
      <FagsakGrid
        behandlingContent={<Route strict path={behandlingerPath} component={BehandlingerIndex} />}
        profileAndNavigationContent={<FagsakProfileIndex />}
        supportContent={<BehandlingSupportIndex />}
        visittkortContent={() => {
          if (harValgtBehandling && !behandlingId) {
            return null;
          }

          return (
            <DataFetcher
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              showLoadingIcon
              behandlingNotRequired
              endpointParams={{ [fpsakApi.ANNEN_PART_BEHANDLING.name]: { saksnummer: selectedSaksnummer } }}
              endpoints={endepunkter.every((endepunkt) => endepunkt.isEndpointEnabled()) ? endepunkter : ingenEndepunkter}
              render={(dataProps) => (
                <VisittkortSakIndex
                  personopplysninger={dataProps.behandlingPersonopplysninger}
                  familieHendelse={dataProps.behandlingFamilieHendelse}
                  lenkeTilAnnenPart={dataProps.annenPartBehandling ? finnLenkeTilAnnenPart(dataProps.annenPartBehandling) : undefined}
                  alleKodeverk={alleKodeverk}
                  sprakkode={sprakkode}
                  fagsak={fagsak}
                />
              )}
            />
          );
        }}
      />
    </FagsakResolver>
    {requestPendingMessage && <DataFetchPendingModal pendingMessage={requestPendingMessage} />}
  </>
);

const mapStateToProps = (state) => ({
  harValgtBehandling: !!getUrlBehandlingId(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  selectedSaksnummer: getSelectedSaksnummer(state),
  requestPendingMessage: getRequestPollingMessage(state),
  alleKodeverk: getAlleFpSakKodeverk(state),
  sprakkode: getBehandlingSprak(state),
  fagsak: getSelectedFagsak(state),
});

export default trackRouteParam({
  paramName: 'saksnummer',
  parse: (saksnummerFromUrl) => Number.parseInt(saksnummerFromUrl, 10),
  storeParam: setSelectedSaksnummer,
  getParamFromStore: getSelectedSaksnummer,
})(connect(mapStateToProps)(requireProps(['selectedSaksnummer'])(FagsakIndex)));
