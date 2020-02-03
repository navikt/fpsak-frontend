import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import {
  findAvslagResultatText,
  findTilbakekrevingText,
  hasIkkeOppfyltSoknadsfristvilkar,
} from './VedtakHelper';
import VedtakFritekstPanel from './VedtakFritekstPanel';

export const getAvslagArsak = (vilkar, aksjonspunkter, behandlingsresultat, getKodeverknavn) => {
  const avslatteVilkar = vilkar.filter((v) => v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT);
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return `${getKodeverknavn(avslatteVilkar[0].vilkarType)}: ${getKodeverknavn(behandlingsresultat.avslagsarsak, avslatteVilkar[0].vilkarType.kode)}`;
};

export const VedtakAvslagPanelImpl = ({
  intl,
  behandlingStatusKode,
  vilkar,
  aksjonspunkter,
  behandlingsresultat,
  sprakkode,
  readOnly,
  ytelseTypeKode,
  tilbakekrevingText,
  alleKodeverk,
  beregningErManueltFastsatt,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const fritekstfeltForSoknadsfrist = behandlingStatusKode === behandlingStatus.BEHANDLING_UTREDES
    && hasIkkeOppfyltSoknadsfristvilkar(vilkar) && ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD;
  const textCode = beregningErManueltFastsatt ? 'VedtakForm.Fritekst.Beregningsgrunnlag' : 'VedtakForm.Fritekst';
  return (
    <div>
      <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
      <Normaltekst>
        {intl.formatMessage({ id: findAvslagResultatText(behandlingsresultat.type.kode, ytelseTypeKode) })}
        {tilbakekrevingText && (
          `. ${intl.formatMessage({ id: tilbakekrevingText })}`
        )}
      </Normaltekst>
      <VerticalSpacer sixteenPx />
      {getAvslagArsak(vilkar, aksjonspunkter, behandlingsresultat, getKodeverknavn) && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}</Undertekst>
          <Normaltekst>
            {getAvslagArsak(vilkar, aksjonspunkter, behandlingsresultat, getKodeverknavn)}
          </Normaltekst>
          <VerticalSpacer sixteenPx />
        </div>
      )}
      {(fritekstfeltForSoknadsfrist || behandlingsresultat.avslagsarsakFritekst || beregningErManueltFastsatt) && (
        <VedtakFritekstPanel
          readOnly={readOnly}
          sprakkode={sprakkode}
          behandlingsresultat={behandlingsresultat}
          labelTextCode={textCode}
        />
      )}
    </div>
  );
};

VedtakAvslagPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  tilbakekrevingText: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
};

VedtakAvslagPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagPanelImpl));
