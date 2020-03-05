import React from 'react';

import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-tilbakekreving';
import TilbakekrevingProsessIndex from '@fpsak-frontend/prosess-tilbakekreving';
import ForeldelseProsessIndex from '@fpsak-frontend/prosess-foreldelse';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { getAlleMerknaderFraBeslutter } from '@fpsak-frontend/behandling-felles';

import tilbakekrevingApi from '../data/tilbakekrevingBehandlingApi';
import VedtakResultatType from '../kodeverk/vedtakResultatType';

export const getForeldelseStatus = ({ perioderForeldelse }) => (perioderForeldelse ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT);
const getVedtakStatus = ({ beregningsresultat }) => {
  if (!beregningsresultat) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  const { vedtakResultatType } = beregningsresultat;
  return vedtakResultatType.kode === VedtakResultatType.INGEN_TILBAKEBETALING ? vilkarUtfallType.IKKE_OPPFYLT : vilkarUtfallType.OPPFYLT;
};

const PANEL_ATTRIBUTTER = {
  vilkarCodes: [],
  endpoints: [],
  getData: () => ({}),
  aksjonspunkterTextCodes: [],
  showComponent: undefined,
  overrideStatus: undefined,
  isOverridable: false,
  overridePanel: undefined,
};

const prosessStegPanelDefinisjoner = [{
  urlCode: bpc.FORELDELSE,
  textCode: 'Behandlingspunkt.Foreldelse',
  panels: [{
    aksjonspunkterCodes: [ac.VURDER_FORELDELSE],
    renderComponent: (props) => <ForeldelseProsessIndex {...props} />,
    getData: ({
      behandling, aksjonspunkterForSteg, perioderForeldelse, fagsak, beregnBelop,
    }) => ({
      perioderForeldelse,
      beregnBelop,
      navBrukerKjonn: fagsak.fagsakPerson.erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
      alleMerknaderFraBeslutter: getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForSteg),
    }),
    showComponent: () => true,
    overrideStatus: getForeldelseStatus,
  }],
}, {
  urlCode: bpc.TILBAKEKREVING,
  textCode: 'Behandlingspunkt.Tilbakekreving',
  panels: [{
    aksjonspunkterCodes: [ac.VURDER_TILBAKEKREVING],
    renderComponent: (props) => <TilbakekrevingProsessIndex {...props} />,
    endpoints: [tilbakekrevingApi.VILKARVURDERINGSPERIODER, tilbakekrevingApi.VILKARVURDERING],
    getData: ({
      behandling, aksjonspunkterForSteg, perioderForeldelse, fagsak, beregnBelop,
    }) => ({
      perioderForeldelse,
      beregnBelop,
      navBrukerKjonn: fagsak.fagsakPerson.erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
      alleMerknaderFraBeslutter: getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForSteg),
    }),
    showComponent: () => true,
  }],
}, {
  urlCode: bpc.VEDTAK,
  textCode: 'Behandlingspunkt.Vedtak',
  panels: [{
    aksjonspunkterCodes: [ac.FORESLA_VEDTAK],
    renderComponent: (props) => <VedtakTilbakekrevingProsessIndex {...props} />,
    endpoints: [tilbakekrevingApi.VEDTAKSBREV],
    getData: ({ behandling, beregningsresultat, fetchPreviewVedtaksbrev }) => ({
      beregningsresultat,
      fetchPreviewVedtaksbrev,
      aksjonspunktKodeForeslaVedtak: ac.FORESLA_VEDTAK,
      isBehandlingHenlagt: behandling.behandlingHenlagt,
    }),
    showComponent: () => true,
    overrideStatus: getVedtakStatus,
  }],
}];

export default prosessStegPanelDefinisjoner.map((def) => ({
  ...def,
  panels: def.panels.map((p) => ({
    ...PANEL_ATTRIBUTTER,
    ...p,
  })),
}));
