import React from 'react';
import PropTypes from 'prop-types';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import vedtakBehandlingPropType from '../propTypes/vedtakBehandlingPropType';
import vedtakAksjonspunkterPropType from '../propTypes/vedtakAksjonspunkterPropType';
import vedtakVilkarPropType from '../propTypes/vedtakVilkarPropType';
import vedtakBeregningsresultatPropType from '../propTypes/vedtakBeregningsresultatPropType';
import VedtakForm from './VedtakForm';
import VedtakRevurderingForm from './revurdering/VedtakRevurderingForm';
import { skalSkriveFritekstGrunnetFastsettingAvBeregning } from './VedtakHelper';
import vedtakBeregningsgrunnlagPropType from '../propTypes/vedtakBeregningsgrunnlagPropType';

/*
 * VedtakPanels
 *
 * Presentasjonskomponent.
 */
const VedtakPanels = ({
  readOnly,
  previewCallback,
  submitCallback,
  behandling,
  tilbakekrevingvalg,
  simuleringResultat,
  resultatstruktur,
  medlemskapFom,
  aksjonspunkter,
  ytelseTypeKode,
  employeeHasAccess,
  alleKodeverk,
  vilkar,
  beregningsgrunnlag,
  sendVarselOmRevurdering,
  resultatstrukturOriginalBehandling,
}) => {
  const beregningErManueltFastsatt = skalSkriveFritekstGrunnetFastsettingAvBeregning(beregningsgrunnlag, aksjonspunkter);
  if (behandling.type.kode === behandlingType.REVURDERING) {
    return (
      <VedtakRevurderingForm
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        behandlingresultat={behandling.behandlingsresultat}
        behandlingStatusKode={behandling.status.kode}
        sprakkode={behandling.sprakkode}
        behandlingArsaker={behandling.behandlingArsaker}
        submitCallback={submitCallback}
        previewCallback={previewCallback}
        readOnly={readOnly}
        ytelseTypeKode={ytelseTypeKode}
        kanOverstyre={employeeHasAccess}
        alleKodeverk={alleKodeverk}
        aksjonspunkter={aksjonspunkter}
        resultatstruktur={resultatstruktur}
        sendVarselOmRevurdering={sendVarselOmRevurdering}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskapFom={medlemskapFom}
        vilkar={vilkar}
        tilbakekrevingvalg={tilbakekrevingvalg}
        simuleringResultat={simuleringResultat}
        beregningErManueltFastsatt={beregningErManueltFastsatt}
      />
    );
  }

  return (
    <VedtakForm
      behandling={behandling}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      submitCallback={submitCallback}
      readOnly={readOnly}
      previewCallback={previewCallback}
      tilbakekrevingvalg={tilbakekrevingvalg}
      simuleringResultat={simuleringResultat}
      resultatstruktur={resultatstruktur}
      aksjonspunkter={aksjonspunkter}
      ytelseTypeKode={ytelseTypeKode}
      kanOverstyre={employeeHasAccess}
      alleKodeverk={alleKodeverk}
      vilkar={vilkar}
      beregningErManueltFastsatt={beregningErManueltFastsatt}
    />
  );
};

VedtakPanels.propTypes = {
  behandling: vedtakBehandlingPropType.isRequired,
  tilbakekrevingvalg: PropTypes.shape(),
  simuleringResultat: PropTypes.shape(),
  resultatstruktur: vedtakBeregningsresultatPropType,
  medlemskapFom: PropTypes.string,
  aksjonspunkter: PropTypes.arrayOf(vedtakAksjonspunkterPropType).isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  sendVarselOmRevurdering: PropTypes.bool.isRequired,
  resultatstrukturOriginalBehandling: vedtakBeregningsresultatPropType,
  readOnly: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  beregningsgrunnlag: vedtakBeregningsgrunnlagPropType,
};

VedtakPanels.defaultProps = {
  tilbakekrevingvalg: undefined,
  simuleringResultat: undefined,
  resultatstruktur: undefined,
};

export default VedtakPanels;
