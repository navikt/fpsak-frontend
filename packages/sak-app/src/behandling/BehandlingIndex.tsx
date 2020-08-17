import React, {
  Suspense, FunctionComponent, useEffect, useCallback, useMemo,
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { Location } from 'history';

import { featureToggle } from '@fpsak-frontend/konstanter';
import { Link } from '@fpsak-frontend/rest-api/src/requestApi/LinkTsType';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import {
  FagsakPerson, KodeverkMedNavn, Kodeverk, NavAnsatt, Fagsak,
} from '@fpsak-frontend/types';

import BehandlingAppKontekst from './behandlingAppKontekstTsType';
import getAccessRights from '../app/util/access';
import {
  getProsessStegLocation, getFaktaLocation, getLocationWithDefaultProsessStegAndFakta,
} from '../app/paths';
import { FpsakApiKeys, requestApi, restApiHooks } from '../data/fpsakApi';
import {
  setUrlBehandlingId, setSelectedBehandlingIdOgVersjon, getUrlBehandlingId,
  oppdaterBehandlingVersjon as oppdaterVersjon, resetBehandlingContext as resetBehandlingContextActionCreator,
} from './duck';
import behandlingEventHandler from './BehandlingEventHandler';
import ErrorBoundary from './ErrorBoundary';
import trackRouteParam from '../app/trackRouteParam';

const BehandlingEngangsstonadIndex = React.lazy(() => import('@fpsak-frontend/behandling-es'));
const BehandlingForeldrepengerIndex = React.lazy(() => import('@fpsak-frontend/behandling-fp'));
const BehandlingSvangerskapspengerIndex = React.lazy(() => import('@fpsak-frontend/behandling-svp'));
const BehandlingInnsynIndex = React.lazy(() => import('@fpsak-frontend/behandling-innsyn'));
const BehandlingKlageIndex = React.lazy(() => import('@fpsak-frontend/behandling-klage'));
const BehandlingTilbakekrevingIndex = React.lazy(() => import('@fpsak-frontend/behandling-tilbakekreving'));
const BehandlingAnkeIndex = React.lazy(() => import('@fpsak-frontend/behandling-anke'));
const BehandlingPapirsoknadIndex = React.lazy(() => import('@fpsak-frontend/behandling-papirsoknad'));

const erTilbakekreving = (behandlingTypeKode) => behandlingTypeKode === BehandlingType.TILBAKEKREVING
  || behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING;
const formatName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

const getOppdaterProsessStegOgFaktaPanelIUrl = (pushLocation, location) => (prosessStegId, faktaPanelId) => {
  let newLocation;
  if (prosessStegId === 'default') {
    newLocation = getLocationWithDefaultProsessStegAndFakta(location);
  } else if (prosessStegId) {
    newLocation = getProsessStegLocation(location)(formatName(prosessStegId));
  } else {
    newLocation = getProsessStegLocation(location)(null);
  }

  if (faktaPanelId === 'default') {
    newLocation = getFaktaLocation(newLocation)('default');
  } else if (faktaPanelId) {
    newLocation = getFaktaLocation(newLocation)(formatName(faktaPanelId));
  } else {
    newLocation = getFaktaLocation(newLocation)(null);
  }

  pushLocation(newLocation);
};

interface FagsakInfo {
  saksnummer: number;
  fagsakYtelseType: Kodeverk;
  fagsakPerson: FagsakPerson;
  fagsakStatus: Kodeverk;
}

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  behandlingType: Kodeverk;
  behandlingStatus: Kodeverk;
  location: Location & { query: { punkt?: string; fakta?: string } };
  oppdaterBehandlingVersjon: (behandlingVersjon: number) => void;
  erAktivPapirsoknad?: boolean;
  resetBehandlingContext: () => void;
  setBehandlingIdOgVersjon: (behandlingVersjon: number) => void;
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingLinks: Link[];
  push: (location: Location | string) => void;
  visFeilmelding: (data: any) => void;
  rettigheter: {
    writeAccess: {
      employeeHasAccess: boolean;
      isEnabled: boolean;
    };
    kanOverstyreAccess: {
      employeeHasAccess: boolean;
      isEnabled: boolean;
    };
  };
}

/**
 * BehandlingIndex
 *
 * Container-komponent. Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 *
 * Komponenten har ansvar å legge valgt behandlingId fra URL-en i staten.
 */
const BehandlingIndex: FunctionComponent<OwnProps> = ({
  behandlingId,
  erAktivPapirsoknad = false,
  setBehandlingIdOgVersjon,
  behandlingLinks,
  push: pushLocation,
  location,
  behandlingType,
  behandlingStatus,
  oppdaterBehandlingVersjon,
  fagsak,
  alleBehandlinger,
  visFeilmelding,
}) => {
  const behandlingVersjon = alleBehandlinger.some((b) => b.id === behandlingId)
    ? alleBehandlinger.find((b) => b.id === behandlingId).versjon : undefined;

  useEffect(() => {
    requestApi.injectPaths(behandlingLinks);
    setBehandlingIdOgVersjon(behandlingVersjon);
  }, [behandlingId]);

  const fagsakInfo = {
    saksnummer: fagsak.saksnummer,
    fagsakStatus: fagsak.status,
    fagsakPerson: fagsak.person,
    fagsakYtelseType: fagsak.sakstype,
    kanRevurderingOpprettes: fagsak.kanRevurderingOpprettes,
    skalBehandlesAvInfotrygd: fagsak.skalBehandlesAvInfotrygd,
    isForeldrepengerFagsak: fagsak.sakstype.kode === FagsakYtelseType.FORELDREPENGER,
  };

  const kodeverk = restApiHooks.useGlobalStateRestApiData<{[key: string]: [KodeverkMedNavn]}>(FpsakApiKeys.KODEVERK);

  const featureToggles = restApiHooks.useGlobalStateRestApiData<{[key: string]: boolean}>(FpsakApiKeys.FEATURE_TOGGLE);
  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo(() => getAccessRights(navAnsatt, fagsak.status, behandlingStatus, behandlingType),
    [fagsak.status, behandlingId, behandlingStatus, behandlingType]);

  const opneSokeside = useCallback(() => { pushLocation('/'); }, []);
  const oppdaterProsessStegOgFaktaPanelIUrl = useCallback(getOppdaterProsessStegOgFaktaPanelIUrl(pushLocation, location), [location]);

  const defaultProps = {
    behandlingId,
    oppdaterBehandlingVersjon,
    behandlingEventHandler,
    kodeverk,
    fagsak: fagsakInfo,
    rettigheter,
    opneSokeside,
    valgtProsessSteg: location.query.punkt,
  };
  const behandlingTypeKode = behandlingType ? behandlingType.kode : undefined;

  if (erAktivPapirsoknad) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={visFeilmelding}>
          <BehandlingPapirsoknadIndex
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (behandlingTypeKode === BehandlingType.DOKUMENTINNSYN) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={visFeilmelding}>
          <BehandlingInnsynIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  const fagsakBehandlingerInfo = alleBehandlinger
    .map((behandling) => ({
      id: behandling.id,
      uuid: behandling.uuid,
      type: behandling.type,
      status: behandling.status,
      opprettet: behandling.opprettet,
      avsluttet: behandling.avsluttet,
    }));

  if (behandlingTypeKode === BehandlingType.KLAGE) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={visFeilmelding}>
          <BehandlingKlageIndex
            skalBenytteFritekstBrevmal={featureToggles[featureToggle.BENYTT_FRITEKST_BREVMAL_FOR_KLAGE]}
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            alleBehandlinger={fagsakBehandlingerInfo}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (behandlingTypeKode === BehandlingType.ANKE) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={visFeilmelding}>
          <BehandlingAnkeIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            alleBehandlinger={fagsakBehandlingerInfo}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (erTilbakekreving(behandlingTypeKode)) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={visFeilmelding}>
          <BehandlingTilbakekrevingIndex
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            harApenRevurdering={fagsakBehandlingerInfo
              .some((b) => b.type.kode === BehandlingType.REVURDERING && b.status.kode !== BehandlingStatus.AVSLUTTET)}
            valgtFaktaSteg={location.query.fakta}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (fagsak.sakstype.kode === FagsakYtelseType.ENGANGSSTONAD) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={visFeilmelding}>
          <BehandlingEngangsstonadIndex
            featureToggles={featureToggles}
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={location.query.fakta}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (fagsak.sakstype.kode === FagsakYtelseType.FORELDREPENGER) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={visFeilmelding}>
          <BehandlingForeldrepengerIndex
            featureToggles={featureToggles}
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={location.query.fakta}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  if (fagsak.sakstype.kode === FagsakYtelseType.SVANGERSKAPSPENGER) {
    return (
      <Suspense fallback={<LoadingPanel />}>
        <ErrorBoundary errorMessageCallback={visFeilmelding}>
          <BehandlingSvangerskapspengerIndex
            featureToggles={featureToggles}
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={location.query.fakta}
            {...defaultProps}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  // Not supported
  return null;
};

const mapStateToProps = (state, ownProps) => {
  const { alleBehandlinger } = ownProps;
  const behandlingId = getUrlBehandlingId(state);
  const behandling = alleBehandlinger.find((b) => b.id === behandlingId);
  return {
    behandlingId,
    behandlingType: behandling?.type,
    behandlingStatus: behandling?.status,
    location: state.router.location,
    erAktivPapirsoknad: behandling?.erAktivPapirsoknad,
    behandlingLinks: behandling?.links,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  oppdaterBehandlingVersjon: oppdaterVersjon,
  resetBehandlingContext: resetBehandlingContextActionCreator,
  setBehandlingIdOgVersjon: setSelectedBehandlingIdOgVersjon,
  visFeilmelding: errorHandler.getErrorActionCreator(),
  push,
}, dispatch);

export default trackRouteParam({
  paramName: 'behandlingId',
  parse: (behandlingFromUrl) => Number.parseInt(behandlingFromUrl, 10),
  storeParam: setUrlBehandlingId,
  getParamFromStore: getUrlBehandlingId,
})(connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingId', 'behandlingType'])(BehandlingIndex)));
