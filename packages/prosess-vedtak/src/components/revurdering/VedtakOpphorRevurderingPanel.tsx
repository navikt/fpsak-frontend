import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { Kodeverk, Behandlingsresultat } from '@fpsak-frontend/types';

import VedtakFritekstPanel from '../felles/VedtakFritekstPanel';

interface OwnProps {
  revurderingsAarsakString?: string;
  sprakKode?: Kodeverk;
  readOnly: boolean;
  behandlingsresultat: Behandlingsresultat;
  beregningErManueltFastsatt: boolean;
  skalBrukeOverstyrendeFritekstBrev: boolean;
}

const VedtakOpphorRevurderingPanel: FunctionComponent<OwnProps> = ({
  revurderingsAarsakString,
  sprakKode,
  readOnly,
  behandlingsresultat,
  beregningErManueltFastsatt,
  skalBrukeOverstyrendeFritekstBrev,
}) => (
  <>
    <Undertekst><FormattedMessage id="VedtakForm.RevurderingFP.Aarsak" /></Undertekst>
    {revurderingsAarsakString && (
      <Normaltekst>
        {revurderingsAarsakString}
      </Normaltekst>
    )}
    {!skalBrukeOverstyrendeFritekstBrev && beregningErManueltFastsatt && (
      <VedtakFritekstPanel
        readOnly={readOnly}
        sprakkode={sprakKode}
        behandlingsresultat={behandlingsresultat}
        labelTextCode="VedtakForm.Fritekst.Beregningsgrunnlag"
      />
    )}
  </>
);

export default VedtakOpphorRevurderingPanel;
