import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import { readOnlyUtils, FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import fpBehandlingApi from '../../data/fpBehandlingApi';

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

  getEndepunkter = () => [fpBehandlingApi.MEDLEMSKAP]

  getKomponent = (props) => <MedlemskapFaktaIndex {...props} />

  getOverstyrVisningAvKomponent = ({ personopplysninger, soknad }) => personopplysninger && soknad

  getData = ({
    fagsak, behandling, hasFetchError, soknad, personopplysninger, inntektArbeidYtelse, rettigheter,
  }) => ({
    isForeldrepengerFagsak: true,
    fagsakPerson: fagsak.fagsakPerson,
    readOnlyForStartdatoForForeldrepenger: !rettigheter.writeAccess.isEnabled
    || hasFetchError
    || behandling.behandlingPaaVent
    || readOnlyUtils.harBehandlingReadOnlyStatus(behandling),
    soknad,
    personopplysninger,
    inntektArbeidYtelse,
  })
}

export default MedlemskapsvilkaretFaktaPanelDef;
