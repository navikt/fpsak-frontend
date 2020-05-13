import React from 'react';

import AnkeResultatProsessIndex from '@fpsak-frontend/prosess-anke-resultat';
import AnkeProsessIndex from '@fpsak-frontend/prosess-anke';
import AnkeMerknaderProsessIndex from '@fpsak-frontend/prosess-anke-merknader';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes as bpc } from '@fpsak-frontend/konstanter';

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
  urlCode: bpc.ANKEBEHANDLING,
  textCode: 'Behandlingspunkt.Ankebehandling',
  panels: [{
    aksjonspunkterCodes: [ac.MANUELL_VURDERING_AV_ANKE],
    renderComponent: (props) => <AnkeProsessIndex {...props} />,
    getData: ({
      alleBehandlinger, ankeVurdering, saveAnke, previewCallback,
    }) => ({
      behandlinger: alleBehandlinger,
      previewVedtakCallback: previewCallback,
      ankeVurdering,
      saveAnke,
      previewCallback,
    }),
    showComponent: () => true,
  }],
}, {
  urlCode: bpc.ANKE_RESULTAT,
  textCode: 'Behandlingspunkt.AnkeResultat',
  panels: [{
    aksjonspunkterCodes: [ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL],
    renderComponent: (props) => <AnkeResultatProsessIndex {...props} />,
    getData: ({
      ankeVurdering, saveAnke, previewCallback,
    }) => ({
      previewVedtakCallback: previewCallback,
      previewCallback,
      ankeVurdering,
      saveAnke,
    }),
    showComponent: () => true,
  }],
}, {
  urlCode: bpc.ANKE_MERKNADER,
  textCode: 'Behandlingspunkt.AnkeMerknader',
  panels: [{
    aksjonspunkterCodes: [ac.MANUELL_VURDERING_AV_ANKE_MERKNADER, ac.AUTO_VENT_ANKE_MERKNADER_FRA_BRUKER],
    renderComponent: (props) => <AnkeMerknaderProsessIndex {...props} />,
    getData: ({
      ankeVurdering, saveAnke, previewCallback,
    }) => ({
      previewVedtakCallback: previewCallback,
      previewCallback,
      ankeVurdering,
      saveAnke,
    }),
    showComponent: () => true,
  }],
}];

export default prosessStegPanelDefinisjoner.map((def) => ({
  ...def,
  panels: def.panels.map((p) => ({
    ...PANEL_ATTRIBUTTER,
    ...p,
  })),
}));
