import React, {
  FunctionComponent, useEffect, useCallback, useMemo,
} from 'react';
import { Location } from 'history';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import {
  Aksjonspunkt, NavAnsatt, Risikoklassifisering, Fagsak,
} from '@fpsak-frontend/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';
import { useGlobalStateRestApiData } from '@fpsak-frontend/rest-api-hooks';

import BehandlingAppKontekst from '../../behandling/behandlingAppKontekstTsType';
import behandlingEventHandler from '../../behandling/BehandlingEventHandler';
import useTrackRouteParam from '../../app/useTrackRouteParam';
import { FpsakApiKeys } from '../../data/fpsakApi';
import { getRiskPanelLocationCreator } from '../../app/paths';
import getAccessRights from '../../app/util/access';
import {
  getBehandlingVersjon, getSelectedBehandlingId,
} from '../../behandling/duck';

const getReadOnly = (navAnsatt: NavAnsatt, rettigheter, erPaaVent: boolean) => {
  if (erPaaVent) {
    return true;
  }
  const { kanSaksbehandle } = navAnsatt;
  return !kanSaksbehandle || !rettigheter.writeAccess.isEnabled;
};

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  push: (location: Location) => void;
  location: Location;
  behandlingVersjon?: number;
  kontrollresultat?: Risikoklassifisering;
  risikoAksjonspunkt?: Aksjonspunkt;
  behandlingId: number;
}

/**
 * RisikoklassifiseringIndex
 *
 * Container komponent. Har ansvar for å vise risikoklassifisering for valgt behandling
 * Viser en av tre komponenter avhengig av: Om ingen klassifisering er utført,
 * om klassifisering er utført og ingen faresignaler er funnet og om klassifisering er utført og faresignaler er funnet
 */
export const RisikoklassifiseringIndexImpl: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger,
  risikoAksjonspunkt,
  kontrollresultat,
  behandlingVersjon,
  push: pushLocation,
  location,
  behandlingId,
}) => {
  const behandling = alleBehandlinger.find((b) => b.id === behandlingId);
  const erPaaVent = behandling ? behandling.behandlingPaaVent : false;
  const behandlingStatus = behandling?.status;
  const behandlingType = behandling?.type;

  const { selected: isRiskPanelOpen = false } = useTrackRouteParam<boolean>({
    paramName: 'risiko',
    parse: (isOpen) => isOpen === 'true',
    isQueryParam: true,
  });

  const navAnsatt = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo(() => getAccessRights(navAnsatt, fagsak.status, behandlingStatus, behandlingType),
    [fagsak.status, behandlingStatus, behandlingType]);
  const readOnly = useMemo(() => getReadOnly(navAnsatt, rettigheter, erPaaVent),
    [rettigheter, erPaaVent]);

  const toggleRiskPanel = useCallback(() => {
    pushLocation(getRiskPanelLocationCreator(location)(!isRiskPanelOpen));
  }, [location, isRiskPanelOpen]);

  const harRisikoAksjonspunkt = !!risikoAksjonspunkt;
  useEffect(() => {
    if (harRisikoAksjonspunkt && risikoAksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !isRiskPanelOpen) {
      toggleRiskPanel();
    }
  }, [harRisikoAksjonspunkt, behandlingId, behandlingVersjon]);

  const submitAksjonspunkt = useCallback((aksjonspunkt) => {
    const params = {
      behandlingId,
      saksnummer: fagsak.saksnummer,
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: [{
        '@type': aksjonspunkt.kode,
        ...aksjonspunkt,
      }],
    };

    return behandlingEventHandler.lagreRisikoklassifiseringAksjonspunkt(params);
  }, [behandlingId, behandlingVersjon]);

  return (
    <RisikoklassifiseringSakIndex
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      aksjonspunkt={risikoAksjonspunkt}
      risikoklassifisering={kontrollresultat}
      isPanelOpen={isRiskPanelOpen}
      readOnly={readOnly}
      submitAksjonspunkt={submitAksjonspunkt}
      toggleRiskPanel={toggleRiskPanel}
    />
  );
};

const mapStateToProps = (state) => ({
  location: state.router.location,
  behandlingVersjon: getBehandlingVersjon(state),
  behandlingId: getSelectedBehandlingId(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    dispatchSubmitFailed,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RisikoklassifiseringIndexImpl);
