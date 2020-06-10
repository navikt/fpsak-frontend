import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

class ArbeidsforholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.ARBEIDSFORHOLD

  getTekstKode = () => 'ArbeidsforholdInfoPanel.Title'

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]

  getKomponent = (props) => <ArbeidsforholdFaktaIndex {...props} />

  getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger

  getData = ({ personopplysninger, inntektArbeidYtelse }) => ({ personopplysninger, inntektArbeidYtelse })
}

export default ArbeidsforholdFaktaPanelDef;
