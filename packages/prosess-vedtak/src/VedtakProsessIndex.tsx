import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import {
  KodeverkMedNavn, Behandling, BeregningsresultatFp, BeregningsresultatEs, Vilkar,
  Aksjonspunkt, SimuleringResultat, Beregningsgrunnlag, Medlemskap, Kodeverk,
} from '@fpsak-frontend/types';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import VedtakForm from './components/forstegang/VedtakForm';
import VedtakRevurderingForm from './components/revurdering/VedtakRevurderingForm';
import { skalSkriveFritekstGrunnetFastsettingAvBeregning } from './components/felles/VedtakHelper';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

interface OwnProps {
  behandling: Behandling;
  beregningresultatForeldrepenger?: BeregningsresultatFp;
  beregningresultatEngangsstonad?: BeregningsresultatEs;
  tilbakekrevingvalg?: {
    videreBehandling: Kodeverk;
  };
  simuleringResultat?: SimuleringResultat;
  beregningsgrunnlag?: Beregningsgrunnlag;
  sendVarselOmRevurdering?: boolean;
  beregningsresultatOriginalBehandling?: {
    'beregningsresultat-engangsstonad'?: {};
    'beregningsresultat-foreldrepenger'?: {};
  };
  medlemskap: Medlemskap;
  vilkar: Vilkar[];
  aksjonspunkter: Aksjonspunkt[];
  isReadOnly: boolean;
  previewCallback: () => void;
  submitCallback: () => void;
  ytelseTypeKode: string;
  kanOverstyre: boolean;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
}

const VedtakProsessIndex: FunctionComponent<OwnProps> = ({
  behandling,
  beregningresultatForeldrepenger,
  beregningresultatEngangsstonad,
  tilbakekrevingvalg,
  simuleringResultat,
  beregningsgrunnlag,
  vilkar,
  beregningsresultatOriginalBehandling,
  medlemskap,
  aksjonspunkter,
  isReadOnly,
  previewCallback,
  submitCallback,
  ytelseTypeKode,
  kanOverstyre,
  alleKodeverk,
  sendVarselOmRevurdering = false,
}) => {
  const beregningErManueltFastsatt = skalSkriveFritekstGrunnetFastsettingAvBeregning(beregningsgrunnlag, aksjonspunkter);
  const resultatstruktur = ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD
    ? beregningresultatEngangsstonad : beregningresultatForeldrepenger;

  return (
    <RawIntlProvider value={intl}>
      {behandling.type.kode !== behandlingType.REVURDERING && (
        <VedtakForm
          behandling={behandling}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          submitCallback={submitCallback}
          readOnly={isReadOnly}
          previewCallback={previewCallback}
          tilbakekrevingvalg={tilbakekrevingvalg}
          simuleringResultat={simuleringResultat}
          resultatstruktur={resultatstruktur}
          aksjonspunkter={aksjonspunkter}
          ytelseTypeKode={ytelseTypeKode}
          kanOverstyre={kanOverstyre}
          alleKodeverk={alleKodeverk}
          vilkar={vilkar}
          beregningErManueltFastsatt={beregningErManueltFastsatt}
        />
      )}
      {behandling.type.kode === behandlingType.REVURDERING && (
        <VedtakRevurderingForm
          behandling={behandling}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          submitCallback={submitCallback}
          readOnly={isReadOnly}
          previewCallback={previewCallback}
          tilbakekrevingvalg={tilbakekrevingvalg}
          simuleringResultat={simuleringResultat}
          resultatstruktur={resultatstruktur}
          aksjonspunkter={aksjonspunkter}
          ytelseTypeKode={ytelseTypeKode}
          kanOverstyre={kanOverstyre}
          alleKodeverk={alleKodeverk}
          vilkar={vilkar}
          beregningErManueltFastsatt={beregningErManueltFastsatt}
          sendVarselOmRevurdering={sendVarselOmRevurdering}
          resultatstrukturOriginalBehandling={beregningsresultatOriginalBehandling}
          medlemskapFom={medlemskap ? medlemskap.fom : undefined}
        />
      )}
    </RawIntlProvider>
  );
};

export default VedtakProsessIndex;
