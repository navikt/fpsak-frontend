import React from 'react';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import innsynResultatTypeKV from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';
import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';
import { ProsessStegPanelDefinisjon } from '@fpsak-frontend/behandling-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes as bpc } from '@fpsak-frontend/konstanter';

const getVedtakStatus = (innsynResultatType, aksjonspunkter) => {
  const harApentAksjonpunkt = aksjonspunkter.some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET);
  if (aksjonspunkter.length === 0 || harApentAksjonpunkt) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  return innsynResultatType.kode === innsynResultatTypeKV.INNVILGET ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_OPPFYLT;
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
  urlCode: bpc.BEHANDLE_INNSYN,
  textCode: 'Behandlingspunkt.Innsyn',
  panels: [{
    aksjonspunkterCodes: [ac.VURDER_INNSYN],
    renderComponent: (props) => <InnsynProsessIndex {...props} />,
    getData: ({ innsyn, alleDokumenter, fagsak }) => ({
      innsyn,
      alleDokumenter,
      saksnummer: fagsak.saksnummer,
    }),
    showComponent: () => true,
  }],
}, {
  urlCode: bpc.VEDTAK,
  textCode: 'Behandlingspunkt.Vedtak',
  panels: [{
    aksjonspunkterCodes: [ac.FORESLA_VEDTAK],
    renderComponent: (props) => <VedtakInnsynProsessIndex {...props} />,
    showComponent: () => true,
    getData: ({
      innsyn, alleDokumenter, fagsak, previewCallback, aksjonspunkter,
    }) => ({
      innsyn,
      alleDokumenter,
      previewCallback,
      aksjonspunkter,
      saksnummer: fagsak.saksnummer,
    }),
    overrideStatus: ({
      innsyn, aksjonspunkterForSteg,
    }) => (innsyn ? getVedtakStatus(
      innsyn.innsynResultatType, aksjonspunkterForSteg,
    ) : vilkarUtfallType.IKKE_VURDERT),
    vilkarCodes: [],
    isOverridable: false,
    endpoints: [],
  }],
}];

export default prosessStegPanelDefinisjoner.map((def) => ({
  ...def,
  panels: (def.panels as ProsessStegPanelDefinisjon[]).map((p) => ({
    ...PANEL_ATTRIBUTTER,
    ...p,
  })),
}));
