import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';
import { formatCurrencyWithKr } from '@fpsak-frontend/utils';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import vedtakResultType from '@fpsak-frontend/kodeverk/src/vedtakResultType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { getBehandlingResultatstruktur } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { getResultatstrukturFraOriginalBehandling } from 'behandlingForstegangOgRevurdering/src/selectors/originalBehandlingSelectors';
import {
  endringerIBeregningsgrunnlagGirFritekstfelt,
  findTilbakekrevingText,
} from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vedtak/VedtakHelper';
import VedtakFritekstPanel from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vedtak/VedtakFritekstPanel';

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
  ytelseType,
  konsekvenserForYtelsen,
  revurderingsAarsakString,
  sprakKode,
  aksjonspunkter,
  readOnly,
  behandlingsresultat,
  tilbakekrevingText,
  getKodeverknavn,
}) => (
  <ElementWrapper>
    {ytelseType === fagsakYtelseType.ENGANGSSTONAD
    && (
    <div>
      <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
      <Normaltekst>
        {intl.formatMessage({ id: resultTextES(beregningResultat, originaltBeregningResultat) })}
        {tilbakekrevingText && `. ${intl.formatMessage({
          id: tilbakekrevingText,
        })}`}
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
    {(ytelseType === fagsakYtelseType.FORELDREPENGER || ytelseType === fagsakYtelseType.SVANGERSKAPSPENGER)
      && (
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
        {endringerIBeregningsgrunnlagGirFritekstfelt(aksjonspunkter, ytelseType)
        && (
        <VedtakFritekstPanel
          readOnly={readOnly}
          sprakkode={sprakKode}
          behandlingsresultat={behandlingsresultat}
          labelTextCode="VedtakForm.Fritekst.Beregningsgrunnlag"
        />
        )}
      </div>
      )}
  </ElementWrapper>
);

VedtakInnvilgetRevurderingPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  antallBarn: PropTypes.number,
  originaltBeregningResultat: PropTypes.shape(),
  beregningResultat: PropTypes.shape(),
  ytelseType: PropTypes.string.isRequired,
  konsekvenserForYtelsen: PropTypes.arrayOf(PropTypes.shape()),
  revurderingsAarsakString: PropTypes.string,
  sprakKode: PropTypes.shape(),
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType),
  readOnly: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  tilbakekrevingText: PropTypes.string,
  getKodeverknavn: PropTypes.func.isRequired,
};

VedtakInnvilgetRevurderingPanelImpl.defaultProps = {
  antallBarn: undefined,
  beregningResultat: undefined,
  originaltBeregningResultat: undefined,
  konsekvenserForYtelsen: undefined,
  revurderingsAarsakString: undefined,
  sprakKode: undefined,
  aksjonspunkter: undefined,
  tilbakekrevingText: null,
};

const mapStateToProps = (state) => ({
  beregningResultat: getBehandlingResultatstruktur(state),
  originaltBeregningResultat: getResultatstrukturFraOriginalBehandling(state),
  konsekvenserForYtelsen: behandlingSelectors.getBehandlingsresultat(state) !== undefined
    ? behandlingSelectors.getBehandlingsresultat(state).konsekvenserForYtelsen : undefined,
  sprakKode: behandlingSelectors.getBehandlingSprak(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  tilbakekrevingText: findTilbakekrevingText(state),
});

export default connect(mapStateToProps)(injectIntl(injectKodeverk(getAlleKodeverk)(VedtakInnvilgetRevurderingPanelImpl)));
