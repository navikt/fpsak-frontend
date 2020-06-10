import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import { readOnlyUtils, FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import svpBehandlingApi from '../../data/svpBehandlingApi';

class MedlemskapsvilkaretFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDLEMSKAPSVILKARET

  getTekstKode = () => 'MedlemskapInfoPanel.Medlemskap'

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
    aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
    aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
    aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO,
  ]

  getEndepunkter = () => [svpBehandlingApi.MEDLEMSKAP]

  getKomponent = (props) => <MedlemskapFaktaIndex {...props} />

  getOverstyrVisningAvKomponent = ({ personopplysninger, soknad }) => personopplysninger && soknad

  getData = ({
    fagsak, behandling, hasFetchError, personopplysninger, soknad, inntektArbeidYtelse,
  }) => ({
    personopplysninger,
    soknad,
    inntektArbeidYtelse,
    isForeldrepengerFagsak: false,
    fagsakPerson: fagsak.fagsakPerson,
    readOnlyBehandling: hasFetchError || readOnlyUtils.harBehandlingReadOnlyStatus(behandling),
  })
}

export default MedlemskapsvilkaretFaktaPanelDef;
