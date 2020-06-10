import React from 'react';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import FeilutbetalingFaktaIndex from '@fpsak-frontend/fakta-feilutbetaling';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import tilbakekrevingBehandlingApi from '../../data/tilbakekrevingBehandlingApi';

class FeilutbetalingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.FEILUTBETALING

  getTekstKode = () => 'TilbakekrevingFakta.FaktaFeilutbetaling'

  getAksjonspunktKoder = () => [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING]

  getKomponent = (props) => <FeilutbetalingFaktaIndex {...props} />

  getEndepunkter = () => [tilbakekrevingBehandlingApi.FEILUTBETALING_AARSAK]

  getOverstyrVisningAvKomponent = ({ feilutbetalingFakta }) => !!feilutbetalingFakta

  getData = ({ feilutbetalingFakta, fagsak, fpsakKodeverk }) => (
    { feilutbetalingFakta, fagsakYtelseTypeKode: fagsak.fagsakYtelseType.kode, fpsakKodeverk }
  )
}

export default FeilutbetalingFaktaPanelDef;
