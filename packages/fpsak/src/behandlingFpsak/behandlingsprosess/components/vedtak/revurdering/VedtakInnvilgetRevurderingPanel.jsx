import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import { VerticalSpacer, ElementWrapper } from '@fpsak-frontend/shared-components';
import {
  getAksjonspunkter,
  getBehandlingResultatstruktur, getBehandlingSprak,
  getBehandlingsresultat, getTilbakekrevingText,
} from 'behandlingFpsak/behandlingSelectors';
import { getResultatstrukturFraOriginalBehandling } from 'behandlingFpsak/selectors/originalBehandlingSelectors';
import { formatCurrencyWithKr } from '@fpsak-frontend/utils';
import { endringerIBeregningsgrunnlagGirFritekstfelt } from 'behandlingFpsak/behandlingsprosess/components/vedtak/VedtakHelper';
import VedtakFritekstPanel from 'behandlingFpsak/behandlingsprosess/components/vedtak/VedtakFritekstPanel';
import aksjonspunktPropType from 'behandlingFelles/proptypes/aksjonspunktPropType';
import vedtakResultType from '@fpsak-frontend/kodeverk/src/vedtakResultType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

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

export const lagKonsekvensForYtelsenTekst = (konsekvenser) => {
  if (!konsekvenser || konsekvenser.length < 1) {
    return '';
  } return konsekvenser.map(k => k.navn).join(' og ');
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
        )
        }
        {antallBarn
        && (
        <Column xs="8">
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.AntallBarn' })}</Undertekst>
          <Element>{antallBarn}</Element>
        </Column>
        )
        }
      </Row>
    </div>
    )
    }
    {ytelseType === fagsakYtelseType.FORELDREPENGER
      && (
      <div>
        <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
        <Normaltekst>
          {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen)}
          {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen) !== '' && tilbakekrevingText && '. '}
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
            )
            }
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
        )
        }
      </div>
      )
    }
  </ElementWrapper>
);

VedtakInnvilgetRevurderingPanelImpl.propTypes = {
  intl: intlShape.isRequired,
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

const mapStateToProps = state => ({
  beregningResultat: getBehandlingResultatstruktur(state),
  originaltBeregningResultat: getResultatstrukturFraOriginalBehandling(state),
  konsekvenserForYtelsen: getBehandlingsresultat(state) !== undefined
    ? getBehandlingsresultat(state).konsekvenserForYtelsen : undefined,
  sprakKode: getBehandlingSprak(state),
  aksjonspunkter: getAksjonspunkter(state),
  tilbakekrevingText: getTilbakekrevingText(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakInnvilgetRevurderingPanelImpl));
