import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import VedtakPanels from './components/VedtakPanels';
import messages from '../i18n/nb_NO';
import vedtakBehandlingPropType from './propTypes/vedtakBehandlingPropType';
import vedtakBeregningsresultatPropType from './propTypes/vedtakBeregningsresultatPropType';
import vedtakAksjonspunkterPropType from './propTypes/vedtakAksjonspunkterPropType';
import vedtakSimuleringResultatPropType from './propTypes/vedtakSimuleringResultatPropType';
import vedtakMedlemskapPropType from './propTypes/vedtakMedlemskapPropType';
import vedtakVilkarPropType from './propTypes/vedtakVilkarPropType';
import vedtakTilbakekrevingvalgPropType from './propTypes/vedtakTilbakekrevingvalgPropType';
import vedtakOriginalBehandlingPropType from './propTypes/vedtakOriginalBehandlingPropType';

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
  vilkar,
  sendVarselOmRevurdering,
  originalBehandling,
  medlemskap,
  aksjonspunkter,
  readOnly,
  previewCallback,
  submitCallback,
  ytelseType,
  employeeHasAccess,
  alleKodeverk,
}) => {
  let resultatstrukturOriginalBehandling;
  if (originalBehandling) {
    resultatstrukturOriginalBehandling = ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
      ? originalBehandling['beregningsresultat-engangsstonad']
      : originalBehandling['beregningsresultat-foreldrepenger'];
  }
  return (
    <RawIntlProvider value={intl}>
      <VedtakPanels
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        behandlingTypeKode={behandling.type.kode}
        behandlingStatus={behandling.status}
        sprakkode={behandling.sprakkode}
        behandlingresultat={behandling.behandlingsresultat}
        behandlingPaaVent={behandling.behandlingPaaVent}
        erBehandlingHenlagt={behandling.behandlingHenlagt}
        behandlingArsaker={behandling.behandlingArsaker}
        vilkar={vilkar}
        tilbakekrevingvalg={tilbakekrevingvalg}
        simuleringResultat={simuleringResultat}
        resultatstruktur={ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
          ? beregningresultatEngangsstonad : beregningresultatForeldrepenger}
        sendVarselOmRevurdering={sendVarselOmRevurdering}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskapFom={medlemskap ? medlemskap.fom : undefined}
        aksjonspunkter={aksjonspunkter}
        ytelseType={ytelseType}
        employeeHasAccess={employeeHasAccess}
        readOnly={readOnly}
        previewCallback={previewCallback}
        submitCallback={submitCallback}
        alleKodeverk={alleKodeverk}
      />
    </RawIntlProvider>
  );
};

VedtakProsessIndex.propTypes = {
  behandling: vedtakBehandlingPropType.isRequired,
  beregningresultatForeldrepenger: vedtakBeregningsresultatPropType,
  beregningresultatEngangsstonad: vedtakBeregningsresultatPropType,
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  sendVarselOmRevurdering: PropTypes.bool,
  originalBehandling: vedtakOriginalBehandlingPropType,
  medlemskap: vedtakMedlemskapPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(vedtakAksjonspunkterPropType).isRequired,
  simuleringResultat: vedtakSimuleringResultatPropType,
  tilbakekrevingvalg: vedtakTilbakekrevingvalgPropType,
  submitCallback: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  ytelseType: kodeverkObjektPropType.isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

VedtakProsessIndex.defaultProps = {
  beregningresultatForeldrepenger: undefined,
  beregningresultatEngangsstonad: undefined,
  originalBehandling: undefined,
  simuleringResultat: undefined,
  tilbakekrevingvalg: undefined,
  sendVarselOmRevurdering: false,
};

export default VedtakProsessIndex;
