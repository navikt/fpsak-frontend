import React from 'react';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import VedtakKlageProsessIndex from '@fpsak-frontend/prosess-vedtak-klage';
import KlagevurderingProsessIndex from '@fpsak-frontend/prosess-klagevurdering';
import FormkravProsessIndex from '@fpsak-frontend/prosess-formkrav';

import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes as bpc } from '@fpsak-frontend/konstanter';

const getVedtakStatus = (behandlingsresultat, aksjonspunkter) => {
  const harApentAksjonpunkt = aksjonspunkter.some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET);
  if (aksjonspunkter.length === 0 || harApentAksjonpunkt) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  const resultatTypeCode = behandlingsresultat.type.kode;
  if (resultatTypeCode === behandlingResultatType.KLAGE_AVVIST || resultatTypeCode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }
  return vilkarUtfallType.OPPFYLT;
};

const PANEL_ATTRIBUTTER = {
  vilkarCodes: [],
  endpoints: [],
  getData: () => {},
  aksjonspunkterTextCodes: [],
  showComponent: undefined,
  overrideStatus: undefined,
  isOverridable: false,
  overridePanel: undefined,
};

const prosessStegPanelDefinisjoner = [{
  urlCode: bpc.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON,
  textCode: 'Behandlingspunkt.FormkravKlageNFP',
  panels: [{
    aksjonspunkterCodes: [ac.VURDERING_AV_FORMKRAV_KLAGE_NFP],
    renderComponent: (props) => <FormkravProsessIndex {...props} />,
    showComponent: () => true,
    getData: ({ alleBehandlinger, klageVurdering }) => ({
      avsluttedeBehandlinger: alleBehandlinger.filter((b) => b.status.kode === behandlingStatus.AVSLUTTET),
      klageVurdering,
    }),
  }],
}, {
  urlCode: bpc.KLAGE_NAV_FAMILIE_OG_PENSJON,
  textCode: 'Behandlingspunkt.CheckKlageNFP',
  panels: [{
    aksjonspunkterCodes: [ac.BEHANDLE_KLAGE_NFP],
    renderComponent: (props) => <KlagevurderingProsessIndex {...props} />,
    showComponent: () => true,
    getData: ({ saveKlageText, klageVurdering, previewCallback }) => ({
      saveKlage: saveKlageText,
      klageVurdering,
      previewCallback,
    }),
  }],
}, {
  urlCode: bpc.FORMKRAV_KLAGE_NAV_KLAGEINSTANS,
  textCode: 'Behandlingspunkt.FormkravKlageKA',
  panels: [{
    aksjonspunkterCodes: [ac.VURDERING_AV_FORMKRAV_KLAGE_KA],
    renderComponent: (props) => <FormkravProsessIndex {...props} />,
    showComponent: () => true,
    getData: ({ alleBehandlinger, klageVurdering }) => ({
      avsluttedeBehandlinger: alleBehandlinger.filter((b) => b.status.kode === behandlingStatus.AVSLUTTET),
      klageVurdering,
    }),
  }],
}, {
  urlCode: bpc.KLAGE_NAV_KLAGEINSTANS,
  textCode: 'Behandlingspunkt.CheckKlageNK',
  panels: [{
    aksjonspunkterCodes: [ac.BEHANDLE_KLAGE_NK],
    renderComponent: (props) => <KlagevurderingProsessIndex {...props} />,
    showComponent: () => true,
    getData: ({ saveKlageText, klageVurdering, previewCallback }) => ({
      saveKlage: saveKlageText,
      klageVurdering,
      previewCallback,
    }),
  }],
}, {
  urlCode: bpc.KLAGE_RESULTAT,
  textCode: 'Behandlingspunkt.ResultatKlage',
  panels: [{
    aksjonspunkterCodes: [ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL],
    renderComponent: (props) => <VedtakKlageProsessIndex {...props} />,
    showComponent: () => true,
    getData: ({ previewCallback, klageVurdering }) => ({
      previewVedtakCallback: previewCallback,
      klageVurdering,
    }),
    overrideStatus: ({
      behandling, aksjonspunkterForSteg,
    }) => getVedtakStatus(
      behandling.behandlingsresultat, aksjonspunkterForSteg,
    ),
  }],
}];

export default prosessStegPanelDefinisjoner.map((def) => ({
  ...def,
  panels: def.panels.map((p) => ({
    ...PANEL_ATTRIBUTTER,
    ...p,
  })),
}));
