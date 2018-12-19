import React from 'react';
import PropTypes from 'prop-types';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import {
  getAksjonspunkter, getBehandlingResultatstruktur, getBehandlingSprak, getTilbakekrevingText,
} from 'behandlingFpsak/behandlingSelectors';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import VedtakFritekstPanel from 'behandlingFpsak/behandlingsprosess/components/vedtak/VedtakFritekstPanel';
import aksjonspunktPropType from 'behandlingFelles/proptypes/aksjonspunktPropType';
import { formatCurrencyWithKr } from '@fpsak-frontend/utils';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { findInnvilgetResultatText, endringerIBeregningsgrunnlagGirFritekstfelt } from './VedtakHelper';

export const VedtakInnvilgetPanelImpl = ({
  intl,
  beregningResultat,
  behandlingsresultat,
  antallBarn,
  ytelseType,
  aksjonspunkter,
  sprakKode,
  readOnly,
  skalBrukeOverstyrendeFritekstBrev,
  tilbakekrevingText,
}) => (
  <ElementWrapper>
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    <Normaltekst>
      {intl.formatMessage({
        id: findInnvilgetResultatText(behandlingsresultat.type.kode, ytelseType),
      })}
      {tilbakekrevingText && `. ${intl.formatMessage({
        id: tilbakekrevingText,
      })}`}
    </Normaltekst>
    <VerticalSpacer eightPx />
    { endringerIBeregningsgrunnlagGirFritekstfelt(aksjonspunkter, ytelseType) && !skalBrukeOverstyrendeFritekstBrev
    && (
    <VedtakFritekstPanel
      readOnly={readOnly}
      sprakkode={sprakKode}
      behandlingsresultat={behandlingsresultat}
      labelTextCode="VedtakForm.Fritekst.Beregningsgrunnlag"
    />
    )
    }
    {ytelseType === fagsakYtelseType.ENGANGSSTONAD
      && (
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
      )
      }
  </ElementWrapper>
);

VedtakInnvilgetPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  beregningResultat: PropTypes.shape(),
  antallBarn: PropTypes.number,
  behandlingsresultat: PropTypes.shape().isRequired,
  ytelseType: PropTypes.string.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType),
  sprakKode: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool.isRequired,
  tilbakekrevingText: PropTypes.string,
};

VedtakInnvilgetPanelImpl.defaultProps = {
  beregningResultat: {},
  antallBarn: undefined,
  aksjonspunkter: undefined,
  sprakKode: undefined,
  tilbakekrevingText: null,
};


const mapStateToProps = state => ({
  ytelseType: getFagsakYtelseType(state).kode,
  beregningResultat: getBehandlingResultatstruktur(state),
  aksjonspunkter: getAksjonspunkter(state),
  sprakKode: getBehandlingSprak(state),
  tilbakekrevingText: getTilbakekrevingText(state),
});

export default connect(mapStateToProps)(VedtakInnvilgetPanelImpl);
