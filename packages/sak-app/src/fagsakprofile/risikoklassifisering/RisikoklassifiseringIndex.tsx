import React, {
  FunctionComponent, useEffect, useCallback, useMemo,
} from 'react';
import { Location } from 'history';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import {
  Aksjonspunkt, NavAnsatt, Risikoklassifisering, Kodeverk, Fagsak,
} from '@fpsak-frontend/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';
import { useGlobalStateRestApiData } from '@fpsak-frontend/rest-api-hooks';

import { FpsakApiKeys } from '../../data/fpsakApiNyUtenRedux';
import { getRiskPanelLocationCreator } from '../../app/paths';
import { getBehandlingerErPaaVentStatusMappedById } from '../../behandling/selectors/behandlingerSelectors';
import getAccessRights from '../../app/util/access';
import {
  getBehandlingVersjon, getSelectedBehandlingId, getBehandlingStatus, getBehandlingType,
} from '../../behandling/duck';
import {
  isRiskPanelOpen, resolveAksjonspunkter as resolveAp, setRiskPanelOpen,
} from './duck';
import trackRouteParam from '../../app/trackRouteParam';

const getReadOnly = (navAnsatt: NavAnsatt, rettigheter, erPaaVentMap: boolean, selectedBehandlingId: number) => {
  const erPaaVent = erPaaVentMap && getSelectedBehandlingId ? erPaaVentMap[selectedBehandlingId] : false;
  if (erPaaVent) {
    return true;
  }
  const { kanSaksbehandle } = navAnsatt;
  return !kanSaksbehandle || !rettigheter.writeAccess.isEnabled;
};

interface OwnProps {
  fagsak: Fagsak;
  resolveAksjonspunkter: (params: any) => void;
  push: (location: Location) => void;
  location: Location;
  isPanelOpen: boolean;
  behandlingVersjon?: number;
  kontrollresultat?: Risikoklassifisering;
  risikoAksjonspunkt?: Aksjonspunkt;
  erPaaVentMap: any;
  behandlingId: number;
  behandlingStatus: Kodeverk;
  behandlingType: Kodeverk;
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
  risikoAksjonspunkt,
  kontrollresultat,
  behandlingVersjon,
  resolveAksjonspunkter,
  push: pushLocation,
  location,
  isPanelOpen = false,
  erPaaVentMap,
  behandlingId,
  behandlingStatus,
  behandlingType,
}) => {
  const navAnsatt = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo(() => getAccessRights(navAnsatt, fagsak.status, behandlingStatus, behandlingType),
    [fagsak.status, behandlingStatus, behandlingType]);
  const readOnly = useMemo(() => getReadOnly(navAnsatt, rettigheter, erPaaVentMap, behandlingId),
    [rettigheter, erPaaVentMap, behandlingId]);

  const toggleRiskPanel = useCallback(() => {
    pushLocation(getRiskPanelLocationCreator(location)(!isPanelOpen));
  }, [location, isPanelOpen]);

  const harRisikoAksjonspunkt = !!risikoAksjonspunkt;
  useEffect(() => {
    if (harRisikoAksjonspunkt && risikoAksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !isPanelOpen) {
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

    return resolveAksjonspunkter(params);
  }, [behandlingId, behandlingVersjon]);

  return (
    <RisikoklassifiseringSakIndex
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      aksjonspunkt={risikoAksjonspunkt}
      risikoklassifisering={kontrollresultat}
      isPanelOpen={isPanelOpen}
      readOnly={readOnly}
      submitAksjonspunkt={submitAksjonspunkt}
      toggleRiskPanel={toggleRiskPanel}
    />
  );
};

const mapStateToProps = (state) => ({
  location: state.router.location,
  behandlingVersjon: getBehandlingVersjon(state),
  isPanelOpen: isRiskPanelOpen(state),
  erPaaVentMap: getBehandlingerErPaaVentStatusMappedById(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingStatus: getBehandlingStatus(state),
  behandlingType: getBehandlingType(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    dispatchSubmitFailed,
    setRiskPanelOpen,
    resolveAksjonspunkter: resolveAp,
  }, dispatch),
});

export default trackRouteParam({
  paramName: 'risiko',
  parse: (isOpen) => isOpen === 'true',
  storeParam: setRiskPanelOpen,
  getParamFromStore: isRiskPanelOpen,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(RisikoklassifiseringIndexImpl));
