import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import VedtakPanels from './components/VedtakPanels';
import messages from '../i18n/nb_NO.json';
import vedtakBehandlingPropType from './propTypes/vedtakBehandlingPropType';
import vedtakBeregningsresultatPropType from './propTypes/vedtakBeregningsresultatPropType';
import vedtakAksjonspunkterPropType from './propTypes/vedtakAksjonspunkterPropType';
import vedtakSimuleringResultatPropType from './propTypes/vedtakSimuleringResultatPropType';
import vedtakMedlemskapPropType from './propTypes/vedtakMedlemskapPropType';
import vedtakVilkarPropType from './propTypes/vedtakVilkarPropType';
import vedtakTilbakekrevingvalgPropType from './propTypes/vedtakTilbakekrevingvalgPropType';
import vedtakOriginalBehandlingPropType from './propTypes/vedtakOriginalBehandlingPropType';
import vedtakBeregningsgrunnlagPropType from './propTypes/vedtakBeregningsgrunnlagPropType';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const VedtakProsessIndex = ({
  behandling,
  beregningresultatForeldrepenger,
  beregningresultatEngangsstonad,
  tilbakekrevingvalg,
  simuleringResultat,
  beregningsgrunnlag,
  vilkar,
  sendVarselOmRevurdering,
  beregningsresultatOriginalBehandling,
  medlemskap,
  aksjonspunkter,
  isReadOnly,
  previewCallback,
  submitCallback,
  ytelseTypeKode,
  employeeHasAccess,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <VedtakPanels
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingTypeKode={behandling.type.kode}
      behandlingStatus={behandling.status}
      sprakkode={behandling.sprakkode}
      behandlingresultat={behandling.behandlingsresultat}
      behandlingPaaVent={behandling.behandlingPaaVent}
      behandlingArsaker={behandling.behandlingArsaker}
      beregningsgrunnlag={beregningsgrunnlag}
      vilkar={vilkar}
      tilbakekrevingvalg={tilbakekrevingvalg}
      simuleringResultat={simuleringResultat}
      resultatstruktur={ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD
        ? beregningresultatEngangsstonad : beregningresultatForeldrepenger}
      sendVarselOmRevurdering={sendVarselOmRevurdering}
      resultatstrukturOriginalBehandling={beregningsresultatOriginalBehandling}
      medlemskapFom={medlemskap ? medlemskap.fom : undefined}
      aksjonspunkter={aksjonspunkter}
      ytelseTypeKode={ytelseTypeKode}
      employeeHasAccess={employeeHasAccess}
      readOnly={isReadOnly}
      previewCallback={previewCallback}
      submitCallback={submitCallback}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

VedtakProsessIndex.propTypes = {
  behandling: vedtakBehandlingPropType.isRequired,
  beregningresultatForeldrepenger: vedtakBeregningsresultatPropType,
  beregningresultatEngangsstonad: vedtakBeregningsresultatPropType,
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  sendVarselOmRevurdering: PropTypes.bool,
  beregningsresultatOriginalBehandling: vedtakOriginalBehandlingPropType,
  medlemskap: vedtakMedlemskapPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(vedtakAksjonspunkterPropType).isRequired,
  simuleringResultat: vedtakSimuleringResultatPropType,
  tilbakekrevingvalg: vedtakTilbakekrevingvalgPropType,
  submitCallback: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  beregningsgrunnlag: vedtakBeregningsgrunnlagPropType,
};

VedtakProsessIndex.defaultProps = {
  beregningresultatForeldrepenger: undefined,
  beregningresultatEngangsstonad: undefined,
  beregningsresultatOriginalBehandling: undefined,
  simuleringResultat: undefined,
  tilbakekrevingvalg: undefined,
  sendVarselOmRevurdering: false,
  beregningsgrunnlag: undefined,
};

export default VedtakProsessIndex;
