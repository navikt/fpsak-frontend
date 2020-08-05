import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-tilbakekreving';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';

import VedtakResultatType from '../../kodeverk/vedtakResultatType';
import tilbakekrevingApi from '../../data/tilbakekrevingBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
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
    aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK,
  ]

  getEndepunkter = () => [
    tilbakekrevingApi.VEDTAKSBREV,
  ]

  getData = ({ behandling, beregningsresultat, fetchPreviewVedtaksbrev }) => ({
    beregningsresultat,
    fetchPreviewVedtaksbrev,
    aksjonspunktKodeForeslaVedtak: aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK,
    isBehandlingHenlagt: behandling.behandlingHenlagt,
  })
}

class VedtakTilbakekrevingProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK

  getTekstKode = () => 'Behandlingspunkt.Vedtak'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default VedtakTilbakekrevingProsessStegPanelDef;
