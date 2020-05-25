import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FordelBeregningsgrunnlagFaktaIndex from '@fpsak-frontend/fakta-fordel-beregningsgrunnlag';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

class FordelingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.FORDELING

  getTekstKode = () => 'FordelBeregningsgrunnlag.Title'

  getAksjonspunktKoder = () => [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG]

  getKomponent = (props) => <FordelBeregningsgrunnlagFaktaIndex {...props} />

  getData = ({ beregningsgrunnlag }) => ({ beregningsgrunnlag })
}

export default FordelingFaktaPanelDef;
