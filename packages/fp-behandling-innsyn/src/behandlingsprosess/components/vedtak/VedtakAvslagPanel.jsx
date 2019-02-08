import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import { getBehandlingVilkar, getBehandlingSprak } from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getFagsakYtelseType } from 'behandlingInnsyn/src/duckInnsyn';
import {
  endringerIBeregningsgrunnlagGirFritekstfelt,
  hasIkkeOppfyltSoknadsfristvilkar,
  findAvslagResultatText,
  findTilbakekrevingText,
} from 'behandlingInnsyn/src/behandlingsprosess/components/vedtak/VedtakHelper';
import VedtakFritekstPanel from 'behandlingInnsyn/src/behandlingsprosess/components/vedtak/VedtakFritekstPanel';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

export const getAvslagArsak = (vilkar, aksjonspunkter, behandlingsresultat) => {
  const avslatteVilkar = vilkar.filter(v => v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT);
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return `${avslatteVilkar[0].vilkarType.navn}: ${behandlingsresultat.avslagsarsak.navn}`;
};

export const VedtakAvslagPanelImpl = ({
  intl,
  behandlingStatusKode,
  vilkar,
  aksjonspunkter,
  behandlingsresultat,
  sprakkode,
  readOnly,
  ytelseType,
  tilbakekrevingText,
}) => {
  const fritekstfeltForSoknadsfrist = behandlingStatusKode === behandlingStatus.BEHANDLING_UTREDES
    && hasIkkeOppfyltSoknadsfristvilkar(vilkar) && ytelseType === fagsakYtelseType.ENGANGSSTONAD;
  const fritekstfeltForBeregningsgrunnlag = endringerIBeregningsgrunnlagGirFritekstfelt(aksjonspunkter, ytelseType);
  const textCode = fritekstfeltForBeregningsgrunnlag ? 'VedtakForm.Fritekst.Beregningsgrunnlag' : 'VedtakForm.Fritekst';
  return (
    <div>
      <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
      <Normaltekst>
        {intl.formatMessage({ id: findAvslagResultatText(behandlingsresultat.type.kode, ytelseType) })}
        {tilbakekrevingText && `. ${intl.formatMessage({
          id: tilbakekrevingText,
        })}`}
      </Normaltekst>
      <VerticalSpacer sixteenPx />
      { getAvslagArsak(vilkar, aksjonspunkter, behandlingsresultat)
      && (
      <div>
        <Undertekst>{intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}</Undertekst>
        <Normaltekst>
          {getAvslagArsak(vilkar, aksjonspunkter, behandlingsresultat)}
        </Normaltekst>
        <VerticalSpacer sixteenPx />
      </div>
      )
      }
      {(fritekstfeltForSoknadsfrist || behandlingsresultat.avslagsarsakFritekst || fritekstfeltForBeregningsgrunnlag)
      && (
      <VedtakFritekstPanel
        readOnly={readOnly}
        sprakkode={sprakkode}
        behandlingsresultat={behandlingsresultat}
        labelTextCode={textCode}
      />
      )
      }
    </div>
  );
};

VedtakAvslagPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  ytelseType: PropTypes.string.isRequired,
  tilbakekrevingText: PropTypes.string,
};

VedtakAvslagPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = state => ({
  ytelseType: getFagsakYtelseType(state).kode,
  vilkar: getBehandlingVilkar(state),
  sprakkode: getBehandlingSprak(state),
  tilbakekrevingText: findTilbakekrevingText(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagPanelImpl));
