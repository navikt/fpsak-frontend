import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { formatCurrencyWithKr } from '@fpsak-frontend/utils';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';

import vedtakResultType from '../../kodeverk/vedtakResultType';
import { findTilbakekrevingText } from '../VedtakHelper';
import VedtakFritekstPanel from '../VedtakFritekstPanel';

const isNewBehandlingResult = (beregningResultat, originaltBeregningResultat) => {
  const vedtakResult = beregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  const vedtakResultOriginal = originaltBeregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  return vedtakResultOriginal !== vedtakResult;
};

const isNewAmount = (beregningResultat, originaltBeregningResultat) => {
  if (beregningResultat === null) {
    return false;
  }
  return beregningResultat.beregnetTilkjentYtelse !== originaltBeregningResultat.beregnetTilkjentYtelse;
};

const resultTextES = (beregningResultat, originaltBeregningResultat) => {
  if (isNewBehandlingResult(beregningResultat, originaltBeregningResultat)) {
    return beregningResultat ? 'VedtakForm.Resultat.EndretTilInnvilget' : 'VedtakForm.Resultat.EndretTilAvslag';
  }
  return isNewAmount(beregningResultat, originaltBeregningResultat)
    ? 'VedtakForm.Resultat.EndretTilkjentYtelse'
    : 'VedtakForm.Resultat.IngenEndring';
};

export const lagKonsekvensForYtelsenTekst = (konsekvenser, getKodeverknavn) => {
  if (!konsekvenser || konsekvenser.length < 1) {
    return '';
  } return konsekvenser.map((k) => getKodeverknavn(k)).join(' og ');
};

export const VedtakInnvilgetRevurderingPanelImpl = ({
  intl,
  antallBarn,
  originaltBeregningResultat,
  beregningResultat,
  ytelseTypeKode,
  konsekvenserForYtelsen,
  revurderingsAarsakString,
  sprakKode,
  readOnly,
  behandlingsresultat,
  tilbakekrevingText,
  alleKodeverk,
  beregningErManueltFastsatt,

}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <>
      {ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
          <Normaltekst>
            {intl.formatMessage({ id: resultTextES(beregningResultat, originaltBeregningResultat) })}
            {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
          </Normaltekst>
          <VerticalSpacer sixteenPx />
          <Row>
            {beregningResultat
            && (
            <Column xs="4">
              <Undertekst>{intl.formatMessage({ id: 'VedtakForm.beregnetTilkjentYtelse' })}</Undertekst>
              <Element>{formatCurrencyWithKr(beregningResultat.beregnetTilkjentYtelse)}</Element>
            </Column>
            )}
            {antallBarn
            && (
            <Column xs="8">
              <Undertekst>{intl.formatMessage({ id: 'VedtakForm.AntallBarn' })}</Undertekst>
              <Element>{antallBarn}</Element>
            </Column>
            )}
          </Row>
        </div>
      )}
      {(ytelseTypeKode === fagsakYtelseType.FORELDREPENGER || ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER) && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
          <Normaltekst>
            {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn)}
            {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn) !== '' && tilbakekrevingText && '. '}
            {tilbakekrevingText && intl.formatMessage({
              id: tilbakekrevingText,
            })}
          </Normaltekst>
          <VerticalSpacer sixteenPx />
          <Row>
            <Column xs="4">
              <Undertekst>{intl.formatMessage({ id: 'VedtakForm.RevurderingFP.Aarsak' })}</Undertekst>
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
};

VedtakInnvilgetRevurderingPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  antallBarn: PropTypes.number,
  originaltBeregningResultat: PropTypes.shape(),
  beregningResultat: PropTypes.shape(),
  ytelseTypeKode: PropTypes.string.isRequired,
  konsekvenserForYtelsen: PropTypes.arrayOf(PropTypes.shape()),
  revurderingsAarsakString: PropTypes.string,
  sprakKode: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  tilbakekrevingText: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
};

VedtakInnvilgetRevurderingPanelImpl.defaultProps = {
  antallBarn: undefined,
  beregningResultat: undefined,
  originaltBeregningResultat: undefined,
  konsekvenserForYtelsen: undefined,
  revurderingsAarsakString: undefined,
  sprakKode: undefined,
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  konsekvenserForYtelsen: ownProps.behandlingsresultat !== undefined
    ? ownProps.behandlingsresultat.konsekvenserForYtelsen : undefined,
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakInnvilgetRevurderingPanelImpl));
