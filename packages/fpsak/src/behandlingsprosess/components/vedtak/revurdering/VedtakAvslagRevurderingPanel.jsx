import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import {
  getBehandlingResultatstruktur,
  getBehandlingVilkar, getBehandlingSprak,
} from 'behandling/behandlingSelectors';
import { getResultatstrukturFraOriginalBehandling } from 'behandling/selectors/originalBehandlingSelectors';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import vedtakResultType from 'kodeverk/vedtakResultType';
import VedtakAvslagArsakOgBegrunnelsePanel from '../VedtakAvslagArsakOgBegrunnelsePanel';

export const isNewBehandlingResult = (beregningResultat, originaltBeregningResultat) => {
  const vedtakResult = beregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  const vedtakResultOriginal = originaltBeregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  return vedtakResultOriginal !== vedtakResult;
};

export const isNewAmount = (beregningResultat, originaltBeregningResultat) => {
  if (beregningResultat === null) {
    return false;
  }
  return beregningResultat.antallBarn !== originaltBeregningResultat.antallBarn;
};


const resultText = (beregningResultat, originaltBeregningResultat) => {
  if (isNewBehandlingResult(beregningResultat, originaltBeregningResultat)) {
    return beregningResultat ? 'VedtakForm.Resultat.EndretTilInnvilget' : 'VedtakForm.Resultat.EndretTilAvslag';
  }
  return isNewAmount(beregningResultat, originaltBeregningResultat)
    ? 'VedtakForm.Resultat.EndretAntallBarn'
    : 'VedtakForm.Resultat.IngenEndring';
};


export const VedtakAvslagRevurderingPanelImpl = ({
  intl,
  beregningResultat,
  behandlingStatusKode,
  vilkar,
  aksjonspunkter,
  behandlingsresultat,
  sprakkode,
  readOnly,
  originaltBeregningResultat,
}) => (
  <div>
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    <Normaltekst>
      {intl.formatMessage({ id: resultText(beregningResultat, originaltBeregningResultat) })}
    </Normaltekst>
    <VerticalSpacer sixteenPx />
    <VedtakAvslagArsakOgBegrunnelsePanel
      intl={intl}
      behandlingStatusKode={behandlingStatusKode}
      vilkar={vilkar}
      aksjonspunkter={aksjonspunkter}
      behandlingsresultat={behandlingsresultat}
      sprakkode={sprakkode}
      readOnly={readOnly}
    />
  </div>
);

VedtakAvslagRevurderingPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  beregningResultat: PropTypes.shape(),
  behandlingStatusKode: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  originaltBeregningResultat: PropTypes.shape(),
};

VedtakAvslagRevurderingPanelImpl.defaultProps = {
  originaltBeregningResultat: undefined,
  beregningResultat: undefined,
};


const mapStateToProps = state => ({
  beregningResultat: getBehandlingResultatstruktur(state),
  originaltBeregningResultat: getResultatstrukturFraOriginalBehandling(state),
  vilkar: getBehandlingVilkar(state),
  sprakkode: getBehandlingSprak(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagRevurderingPanelImpl));
