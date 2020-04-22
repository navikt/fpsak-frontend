import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import {
  Behandlingsresultat, BeregningsresultatFp, BeregningsresultatEs, Kodeverk,
} from '@fpsak-frontend/types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { formatCurrencyWithKr } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import VedtakFritekstPanel from '../felles/VedtakFritekstPanel';

interface OwnProps {
  resultatstruktur?: BeregningsresultatFp | BeregningsresultatEs;
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
  ytelseTypeKode,
  sprakkode,
  readOnly,
  skalBrukeOverstyrendeFritekstBrev,
  beregningErManueltFastsatt,
  resultatstruktur = {},
}) => (
  <>
    {ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD && resultatstruktur && (
      <>
        <Row>
          <Column xs="4">
            <Undertekst>{intl.formatMessage({ id: 'VedtakForm.beregnetTilkjentYtelse' })}</Undertekst>
            <Element>{formatCurrencyWithKr((resultatstruktur as BeregningsresultatEs).beregnetTilkjentYtelse)}</Element>
          </Column>
          <Column xs="8">
            <Undertekst>{intl.formatMessage({ id: 'VedtakForm.AntallBarn' })}</Undertekst>
            <Element>{resultatstruktur.antallBarn}</Element>
          </Column>
        </Row>
        <VerticalSpacer sixteenPx />
      </>
    )}
    {beregningErManueltFastsatt && !skalBrukeOverstyrendeFritekstBrev && (
      <VedtakFritekstPanel
        readOnly={readOnly}
        sprakkode={sprakkode}
        behandlingsresultat={behandlingsresultat}
        labelTextCode="VedtakForm.Fritekst.Beregningsgrunnlag"
      />
    )}
  </>
);

export default injectIntl(VedtakInnvilgetPanel);
