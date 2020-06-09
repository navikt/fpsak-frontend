import React from 'react';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import FeilutbetalingFaktaIndex from '@fpsak-frontend/fakta-feilutbetaling';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import tilbakekrevingApi from '../data/tilbakekrevingBehandlingApi';

const faktaPanelDefinisjoner = [{
  urlCode: faktaPanelCodes.FEILUTBETALING,
  textCode: 'TilbakekrevingFakta.FaktaFeilutbetaling',
  aksjonspunkterCodes: [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING],
  endpoints: [tilbakekrevingApi.FEILUTBETALING_AARSAK],
  renderComponent: (props) => <FeilutbetalingFaktaIndex {...props} />,
  showComponent: ({ feilutbetalingFakta }) => !!feilutbetalingFakta,
  getData: ({ feilutbetalingFakta, fagsak, fpsakKodeverk }) => (
    { feilutbetalingFakta, fagsakYtelseTypeKode: fagsak.fagsakYtelseType.kode, fpsakKodeverk }
  ),
},
{
  urlCode: faktaPanelCodes.VERGE,
  textCode: 'RegistrereVergeInfoPanel.Info',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_VERGE],
  endpoints: [tilbakekrevingApi.VERGE],
  renderComponent: (props) => <VergeFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => ({}),
}];

export default faktaPanelDefinisjoner;
