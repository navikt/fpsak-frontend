import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Route, useLocation } from 'react-router-dom';

import { DataFetchPendingModal, requireProps } from '@fpsak-frontend/shared-components';
import {
  Kodeverk, KodeverkMedNavn, Personopplysninger, FamilieHendelseSamling, Fagsak,
} from '@fpsak-frontend/types';
import { getRequestPollingMessage } from '@fpsak-frontend/rest-api-redux';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { getSelectedFagsak, getSelectedSaksnummer } from './fagsakSelectors';
import BehandlingerIndex from '../behandling/BehandlingerIndex';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import { setSelectedSaksnummer } from './duck';

import { erUrlUnderBehandling, erBehandlingValgt, behandlingerPath } from '../app/paths';
import FagsakResolver from './FagsakResolver';
import VisittkortIndex from './VisittkortIndex';
import FagsakGrid from './components/FagsakGrid';
import {
  getSelectedBehandlingId,
  getBehandlingVersjon,
  getBehandlingSprak,
  getBehandlingType, finnesVerge,
} from '../behandling/duck';
import { getAlleFpSakKodeverk } from '../kodeverk/duck';
import trackRouteParam from '../app/trackRouteParam';

const erTilbakekreving = (behandlingType) => behandlingType && (BehandlingType.TILBAKEKREVING === behandlingType.kode
  || BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType.kode);

interface OwnProps {
  harValgtBehandling: boolean;
  behandlingId?: number;
  behandlingVersjon?: number;
  behandlingType?: Kodeverk;
  selectedSaksnummer: number;
  requestPendingMessage?: string;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
  sprakkode?: Kodeverk;
  fagsak?: Fagsak;
  harVerge: boolean;
}

interface DataProps {
  behandlingPersonopplysninger?: Personopplysninger;
  behandlingFamilieHendelse?: FamilieHendelseSamling;
  annenPartBehandling?: {
    saksnr: {
      verdi: string;
    };
    behandlingId: number;
  };
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
}) => {
  const location = useLocation();

  return (
    <>
      <FagsakResolver key={selectedSaksnummer}>
        <FagsakGrid
          behandlingContent={<Route strict path={behandlingerPath} component={BehandlingerIndex} />}
          profileAndNavigationContent={<FagsakProfileIndex />}
          supportContent={<BehandlingSupportIndex />}
          visittkortContent={() => {
            if (erUrlUnderBehandling(location) || (erBehandlingValgt(location) && !behandlingId)) {
              return null;
            }

            return (
              <VisittkortIndex
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                alleKodeverk={alleKodeverk}
                sprakkode={sprakkode}
                fagsak={fagsak}
                harTilbakekrevingVerge={erTilbakekreving(behandlingType) && harVerge}
                selectedSaksnummer={selectedSaksnummer}
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
