import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { formatCurrencyWithKr } from '@fpsak-frontend/utils';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import {
  Behandlingsresultat, BeregningsresultatFp, BeregningsresultatEs, Kodeverk,
} from '@fpsak-frontend/types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import VedtakFritekstPanel from '../felles/VedtakFritekstPanel';

interface OwnProps {
  ytelseTypeKode: string;
  revurderingsAarsakString?: string;
  readOnly: boolean;
  resultatstruktur?: BeregningsresultatFp | BeregningsresultatEs;
  sprakKode: Kodeverk;
  behandlingsresultat: Behandlingsresultat;
  beregningErManueltFastsatt: boolean;
  skalBrukeOverstyrendeFritekstBrev: boolean;
}

const VedtakInnvilgetRevurderingPanel: FunctionComponent<OwnProps> = ({
  ytelseTypeKode,
  revurderingsAarsakString,
  readOnly,
  resultatstruktur,
  sprakKode,
  behandlingsresultat,
  beregningErManueltFastsatt,
  skalBrukeOverstyrendeFritekstBrev,
}) => (
  <>
    {ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD && resultatstruktur && (
      <Row>
        <Column xs="4">
          <Undertekst><FormattedMessage id="VedtakForm.beregnetTilkjentYtelse" /></Undertekst>
          <Element>{formatCurrencyWithKr((resultatstruktur as BeregningsresultatEs).beregnetTilkjentYtelse)}</Element>
        </Column>
        <Column xs="8">
          <Undertekst><FormattedMessage id="VedtakForm.AntallBarn" /></Undertekst>
          <Element>{resultatstruktur.antallBarn}</Element>
        </Column>
      </Row>
    )}
    {(ytelseTypeKode === fagsakYtelseType.FORELDREPENGER || ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER) && (
      <>
        {revurderingsAarsakString && (
          <>
            <Row>
              <Column xs="4">
                <Undertekst><FormattedMessage id="VedtakForm.RevurderingFP.Aarsak" /></Undertekst>
                <Normaltekst>
                  {revurderingsAarsakString}
                </Normaltekst>
              </Column>
            </Row>
            <VerticalSpacer eightPx />
          </>
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
    )}
  </>
);

export default VedtakInnvilgetRevurderingPanel;
