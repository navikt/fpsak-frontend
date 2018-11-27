import React from 'react';
import PropTypes from 'prop-types';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';

import { getAksjonspunkter, getBehandlingResultatstruktur, getBehandlingSprak } from 'behandling/behandlingSelectors';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import { formatCurrencyWithKr } from 'utils/currencyUtils';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import VedtakFritekstPanel from 'behandlingsprosess/components/vedtak/VedtakFritekstPanel';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
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
}) => (
  <ElementWrapper>
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    <Normaltekst>
      {intl.formatMessage({ id: findInnvilgetResultatText(behandlingsresultat.type.kode, ytelseType) })}
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
};

VedtakInnvilgetPanelImpl.defaultProps = {
  beregningResultat: {},
  antallBarn: undefined,
  aksjonspunkter: undefined,
  sprakKode: undefined,
};


const mapStateToProps = state => ({
  ytelseType: getFagsakYtelseType(state).kode,
  beregningResultat: getBehandlingResultatstruktur(state),
  aksjonspunkter: getAksjonspunkter(state),
  sprakKode: getBehandlingSprak(state),
});

export default connect(mapStateToProps)(VedtakInnvilgetPanelImpl);
