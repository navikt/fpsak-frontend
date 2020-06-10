import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OmsorgOgForeldreansvarFaktaIndex from '@fpsak-frontend/fakta-omsorg-og-foreldreansvar';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import fpBehandlingApi from '../../data/fpBehandlingApi';

class OmsorgvilkaretFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OMSORGSVILKARET

  getTekstKode = () => 'OmsorgOgForeldreansvarInfoPanel.Omsorg'

  getAksjonspunktKoder = () => [aksjonspunktCodes.OMSORGSOVERTAKELSE, aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR]

  getEndepunkter = () => [fpBehandlingApi.FAMILIEHENDELSE]

  getKomponent = (props) => <OmsorgOgForeldreansvarFaktaIndex {...props} />

  getData = ({ soknad, personopplysninger, inntektArbeidYtelse }) => ({
    soknad,
    personopplysninger,
    inntektArbeidYtelse,
  })
}

export default OmsorgvilkaretFaktaPanelDef;
