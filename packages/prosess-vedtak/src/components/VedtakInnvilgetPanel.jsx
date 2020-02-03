import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { formatCurrencyWithKr } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import VedtakFritekstPanel from './VedtakFritekstPanel';
import { findInnvilgetResultatText, findTilbakekrevingText } from './VedtakHelper';

export const VedtakInnvilgetPanelImpl = ({
  intl,
  beregningResultat,
  behandlingsresultat,
  antallBarn,
  ytelseTypeKode,
  sprakkode,
  readOnly,
  skalBrukeOverstyrendeFritekstBrev,
  tilbakekrevingText,
  beregningErManueltFastsatt,
}) => (
  <>
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    <Normaltekst>
      {intl.formatMessage({ id: findInnvilgetResultatText(behandlingsresultat.type.kode, ytelseTypeKode) })}
      {tilbakekrevingText && (
        `. ${intl.formatMessage({ id: tilbakekrevingText })}`
      )}
    </Normaltekst>
    <VerticalSpacer eightPx />
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
  tilbakekrevingText: PropTypes.string,
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
};

VedtakInnvilgetPanelImpl.defaultProps = {
  beregningResultat: {},
  antallBarn: undefined,
  sprakkode: undefined,
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(VedtakInnvilgetPanelImpl);
