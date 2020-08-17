import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { push } from 'connected-react-router';
import { Location } from 'history';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Fagsak } from '@fpsak-frontend/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';

import { getBehandlingVersjon, getSelectedBehandlingId } from '../behandling/duck';
import BehandlingAppKontekst from '../behandling/behandlingAppKontekstTsType';
import { fjernVerge, opprettVerge } from './behandlingMenuOperations';
import BehandlingMenuIndex from './BehandlingMenuIndex';
import { FpsakApiKeys, restApiHooks } from '../data/fpsakApi';

const YTELSE_BEHANDLINGTYPER = [BehandlingType.FORSTEGANGSSOKNAD, BehandlingType.REVURDERING,
  BehandlingType.TILBAKEKREVING, BehandlingType.TILBAKEKREVING_REVURDERING];

const NO_PARAMS = {};

const VERGE_MENYVALG = {
  FJERN: 'FJERN',
  OPPRETT: 'OPPRETT',
};

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  oppfriskBehandlinger: () => void;
  location: Location;
}

interface StateProps {
  behandlingId?: number;
  behandlingVersion?: number;
}

interface DispatchProps {
  pushLocation: (location: string) => void;
}

const BehandlingMenuDataResolver: FunctionComponent<OwnProps & StateProps & DispatchProps> = ({
  fagsak,
  alleBehandlinger,
  oppfriskBehandlinger,
  location,
  behandlingId,
  behandlingVersion,
  pushLocation,
}) => {
  const behandling = alleBehandlinger.find((b) => b.id === behandlingId);
  const skalHenteVergeMenyvalg = behandling && YTELSE_BEHANDLINGTYPER.includes(behandling.type.kode);
  const { data: vergeMenyvalgData, state: stateVerge } = restApiHooks.useRestApi<{ vergeBehandlingsmeny: string }>(
    FpsakApiKeys.VERGE_MENYVALG, { saksnummer: fagsak.saksnummer, behandlingId }, {
      updateTriggers: [behandlingId, behandlingVersion],
      suspendRequest: !skalHenteVergeMenyvalg,
    },
  );

  const { data: menyhandlingRettigheter, state } = restApiHooks.useRestApi<{ harSoknad: boolean }>(
    FpsakApiKeys.MENYHANDLING_RETTIGHETER, NO_PARAMS, {
      updateTriggers: [behandlingId, behandlingVersion],
      suspendRequest: !behandlingId,
      keepData: true,
    },
  );

  if ((skalHenteVergeMenyvalg && stateVerge === RestApiState.LOADING) || (behandlingId && state === RestApiState.LOADING)) {
    return <LoadingPanel />;
  }

  const vergeMenyvalg = vergeMenyvalgData?.vergeBehandlingsmeny;
  const fjernVergeFn = vergeMenyvalg === VERGE_MENYVALG.FJERN
    ? fjernVerge(location, pushLocation, fagsak.saksnummer, behandlingId, behandlingVersion) : undefined;
  const opprettVergeFn = vergeMenyvalg === VERGE_MENYVALG.OPPRETT
    ? opprettVerge(location, pushLocation, fagsak.saksnummer, behandlingId, behandlingVersion) : undefined;

  return (
    <BehandlingMenuIndex
      fagsak={fagsak}
      alleBehandlinger={alleBehandlinger}
      saksnummer={fagsak.saksnummer}
      behandlingId={behandlingId}
      behandlingVersion={behandlingVersion}
      fjernVerge={fjernVergeFn}
      opprettVerge={opprettVergeFn}
      pushLocation={pushLocation}
      location={location}
      menyhandlingRettigheter={menyhandlingRettigheter}
      oppfriskBehandlinger={oppfriskBehandlinger}
    />
  );
};

const mapStateToProps = (state): StateProps => ({
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersion: getBehandlingVersjon(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => bindActionCreators({
  pushLocation: push,
}, dispatch);

export default withRouter<any, FunctionComponent<OwnProps & StateProps & DispatchProps>>(connect(
  mapStateToProps, mapDispatchToProps,
)(BehandlingMenuDataResolver));
