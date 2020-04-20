import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { formatCurrencyWithKr } from '@fpsak-frontend/utils';

import VedtakFritekstPanel from './VedtakFritekstPanel';

export const VedtakInnvilgetPanelImpl = ({
  intl,
  beregningResultat,
  behandlingsresultat,
  antallBarn,
  ytelseTypeKode,
  sprakkode,
  readOnly,
  skalBrukeOverstyrendeFritekstBrev,
  beregningErManueltFastsatt,
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
        {beregningResultat && (
          <Column xs="4">
            <Undertekst>{intl.formatMessage({ id: 'VedtakForm.beregnetTilkjentYtelse' })}</Undertekst>
            <Element>{formatCurrencyWithKr(beregningResultat.beregnetTilkjentYtelse)}</Element>
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

VedtakInnvilgetPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  beregningResultat: PropTypes.shape(),
  antallBarn: PropTypes.number,
  behandlingsresultat: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  sprakkode: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool.isRequired,
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
};

VedtakInnvilgetPanelImpl.defaultProps = {
  beregningResultat: {},
  antallBarn: undefined,
  sprakkode: undefined,
};

export default injectIntl(VedtakInnvilgetPanelImpl);
