import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import YtelserFaktaIndex from '@fpsak-frontend/fakta-ytelser';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

class YtelserFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.YTELSER

  getTekstKode = () => 'YtelserFaktaIndex.Ytelser'

  getKomponent = (props) => <YtelserFaktaIndex {...props} />

  getOverstyrVisningAvKomponent = ({ inntektArbeidYtelse }) => inntektArbeidYtelse
    && inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker
    && inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker.length > 0

  getData = ({ inntektArbeidYtelse }) => ({ inntektArbeidYtelse })
}

export default YtelserFaktaPanelDef;
