import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { formatCurrencyWithKr } from '@fpsak-frontend/utils';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import {
  Behandlingsresultat, BeregningsresultatFp, BeregningsresultatEs, Kodeverk,
} from '@fpsak-frontend/types';

import VedtakFritekstPanel from '../VedtakFritekstPanel';

interface OwnProps {
  antallBarn?: number;
  ytelseTypeKode: string;
  revurderingsAarsakString?: string;
  readOnly: boolean;
  resultatstruktur?: BeregningsresultatFp | BeregningsresultatEs;
  sprakKode: Kodeverk;
  behandlingsresultat: Behandlingsresultat;
  beregningErManueltFastsatt: boolean;
}

const VedtakInnvilgetRevurderingPanel: FunctionComponent<OwnProps> = ({
  antallBarn,
  ytelseTypeKode,
  revurderingsAarsakString,
  readOnly,
  resultatstruktur,
  sprakKode,
  behandlingsresultat,
  beregningErManueltFastsatt,
}) => (
  <>
    {ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD && (
    <div>
      <Row>
        {resultatstruktur
            && (
            <Column xs="4">
              <Undertekst><FormattedMessage id="VedtakForm.beregnetTilkjentYtelse" /></Undertekst>
              <Element>{formatCurrencyWithKr(resultatstruktur.beregnetTilkjentYtelse)}</Element>
            </Column>
            )}
        {antallBarn
            && (
            <Column xs="8">
              <Undertekst><FormattedMessage id="VedtakForm.AntallBarn" /></Undertekst>
              <Element>{antallBarn}</Element>
            </Column>
            )}
      </Row>
    </div>
    )}
    {(ytelseTypeKode === fagsakYtelseType.FORELDREPENGER || ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER) && (
    <div>
      <Row>
        <Column xs="4">
          <Undertekst><FormattedMessage id="VedtakForm.RevurderingFP.Aarsak" /></Undertekst>
          {revurderingsAarsakString !== undefined
              && (
              <Normaltekst>
                {revurderingsAarsakString}
              </Normaltekst>
              )}
        </Column>
      </Row>
      {beregningErManueltFastsatt && (
      <VedtakFritekstPanel
        readOnly={readOnly}
        sprakkode={sprakKode}
        behandlingsresultat={behandlingsresultat}
        labelTextCode="VedtakForm.Fritekst.Beregningsgrunnlag"
      />
      )}
    </div>
    )}
  </>
);

export default VedtakInnvilgetRevurderingPanel;
