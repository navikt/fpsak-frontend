import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import {
  Behandlingsresultat, BeregningsresultatFp, BeregningsresultatEs, Kodeverk,
} from '@fpsak-frontend/types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { formatCurrencyWithKr } from '@fpsak-frontend/utils';

import VedtakFritekstPanel from '../felles/VedtakFritekstPanel';

interface OwnProps {
  resultatstruktur?: BeregningsresultatFp | BeregningsresultatEs;
  antallBarn?: number;
  behandlingsresultat: Behandlingsresultat;
  ytelseTypeKode: string;
  sprakkode?: Kodeverk;
  readOnly: boolean;
  skalBrukeOverstyrendeFritekstBrev: boolean;
  beregningErManueltFastsatt: boolean;
}

const VedtakInnvilgetPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  behandlingsresultat,
  antallBarn,
  ytelseTypeKode,
  sprakkode,
  readOnly,
  skalBrukeOverstyrendeFritekstBrev,
  beregningErManueltFastsatt,
  resultatstruktur = {},
}) => (
  <>
    {beregningErManueltFastsatt && !skalBrukeOverstyrendeFritekstBrev && (
      <VedtakFritekstPanel
        readOnly={readOnly}
        sprakkode={sprakkode}
        behandlingsresultat={behandlingsresultat}
        labelTextCode="VedtakForm.Fritekst.Beregningsgrunnlag"
      />
    )}
    {ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD && (
      <Row>
        {resultatstruktur && (
          <Column xs="4">
            <Undertekst>{intl.formatMessage({ id: 'VedtakForm.beregnetTilkjentYtelse' })}</Undertekst>
            <Element>{formatCurrencyWithKr((resultatstruktur as BeregningsresultatEs).beregnetTilkjentYtelse)}</Element>
          </Column>
        )}
        {antallBarn && (
          <Column xs="8">
            <Undertekst>{intl.formatMessage({ id: 'VedtakForm.AntallBarn' })}</Undertekst>
            <Element>{antallBarn}</Element>
          </Column>
        )}
      </Row>
    )}
  </>
);

export default injectIntl(VedtakInnvilgetPanel);
