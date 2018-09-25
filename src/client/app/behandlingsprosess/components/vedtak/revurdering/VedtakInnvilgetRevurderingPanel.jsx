import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import {
  getAksjonspunkter,
  getBehandlingResultatstruktur, getBehandlingSprak,
  getBehandlingsresultat,
} from 'behandling/behandlingSelectors';
import { getResultatstrukturFraOriginalBehandling } from 'behandling/selectors/originalBehandlingSelectors';
import { formatCurrencyWithKr } from '@fpsak-frontend/utils/currencyUtils';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import vedtakResultType from '@fpsak-frontend/kodeverk/vedtakResultType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/fagsakYtelseType';
import { endringerIBeregningsgrunnlagGirFritekstfelt } from 'behandlingsprosess/components/vedtak/VedtakHelper';
import VedtakFritekstPanel from 'behandlingsprosess/components/vedtak/VedtakFritekstPanel';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';

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

const resultTextFP = revurderingResultat => (revurderingResultat === undefined ? '' : revurderingResultat.navn);

export const VedtakInnvilgetRevurderingPanelImpl = ({
  intl,
  antallBarn,
  originaltBeregningResultat,
  beregningResultat,
  ytelseType,
  revurderingResultat,
  revurderingsAarsakString,
  sprakKode,
  aksjonspunkter,
  readOnly,
  behandlingsresultat,
}) => (
  <ElementWrapper>
    {ytelseType === fagsakYtelseType.ENGANGSSTONAD
    && (
    <div>
      <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
      <Normaltekst>
        {intl.formatMessage({ id: resultTextES(beregningResultat, originaltBeregningResultat) })}
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
          {resultTextFP(revurderingResultat)}
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
  revurderingResultat: PropTypes.shape(),
  revurderingsAarsakString: PropTypes.string,
  sprakKode: PropTypes.shape(),
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType),
  readOnly: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
};

VedtakInnvilgetRevurderingPanelImpl.defaultProps = {
  antallBarn: undefined,
  beregningResultat: undefined,
  originaltBeregningResultat: undefined,
  revurderingResultat: undefined,
  revurderingsAarsakString: undefined,
  sprakKode: undefined,
  aksjonspunkter: undefined,
};

const mapStateToProps = state => ({
  beregningResultat: getBehandlingResultatstruktur(state),
  originaltBeregningResultat: getResultatstrukturFraOriginalBehandling(state),
  revurderingResultat: getBehandlingsresultat(state) !== undefined
    ? getBehandlingsresultat(state).konsekvensForYtelsen : undefined,
  sprakKode: getBehandlingSprak(state),
  aksjonspunkter: getAksjonspunkter(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakInnvilgetRevurderingPanelImpl));
