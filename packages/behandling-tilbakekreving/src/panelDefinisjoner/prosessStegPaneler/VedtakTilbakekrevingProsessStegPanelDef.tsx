import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-tilbakekreving';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';

import VedtakResultatType from '../../kodeverk/vedtakResultatType';
import tilbakekrevingApi from '../../data/tilbakekrevingBehandlingApi';

class PanelDef extends ProsessStegPanelerDef {
  getKomponent = (props) => <VedtakTilbakekrevingProsessIndex {...props} />

  getOverstyrVisningAvKomponent = () => true

  getOverstyrtStatus = ({ beregningsresultat }) => {
    if (!beregningsresultat) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    const { vedtakResultatType } = beregningsresultat;
    return vedtakResultatType.kode === VedtakResultatType.INGEN_TILBAKEBETALING ? vilkarUtfallType.IKKE_OPPFYLT : vilkarUtfallType.OPPFYLT;
  }

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
  ]

  getEndepunkter = () => [
    tilbakekrevingApi.VEDTAKSBREV,
  ]

  getData = ({ behandling, beregningsresultat, fetchPreviewVedtaksbrev }) => ({
    beregningsresultat,
    fetchPreviewVedtaksbrev,
    aksjonspunktKodeForeslaVedtak: aksjonspunktCodes.FORESLA_VEDTAK,
    isBehandlingHenlagt: behandling.behandlingHenlagt,
  })
}

class VedtakTilbakekrevingProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.VEDTAK

  getTekstKode = () => 'Behandlingspunkt.Vedtak'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default VedtakTilbakekrevingProsessStegPanelDef;
