import React from 'react';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import ForeldreansvarVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-foreldreansvar';
import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import FodselVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-fodsel';
import SoknadsfristVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-soknadsfrist';
import AdopsjonVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-adopsjon';
import OmsorgVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-omsorg';
import BeregningsresultatProsessIndex from '@fpsak-frontend/prosess-beregningsresultat';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

import esBehandlingApi from '../data/esBehandlingApi';
import { hentAlleOverstyringAksjonspunktKoderFor, hentOverstyringAksjonspunktKodeFor } from './vilkarOverstyringHjelper';

const harVilkarresultatMedOverstyring = (aksjonspunkterForBp, behandlingspunkt) => {
  const apKoder = aksjonspunkterForBp.map((ap) => ap.definisjon.kode);
  const overstyringApKoder = hentAlleOverstyringAksjonspunktKoderFor(behandlingspunkt);
  const harIngenApOgMulighetTilOverstyring = apKoder.length === 0 && overstyringApKoder.length > 0;
  const harApSomErOverstyringAp = apKoder.some((apCode) => overstyringApKoder.includes(apCode));
  return harIngenApOgMulighetTilOverstyring || harApSomErOverstyringAp;
};

const prosessStegPaneler = [{
  showWhen: ({ stegKode }) => stegKode === bpc.OPPLYSNINGSPLIKT,
  endpoints: [esBehandlingApi.SOKNAD],
  renderComponent: (props) => <SokersOpplysningspliktVilkarProsessIndex {...props} />,
  getExtraData: () => {},
}, {
  showWhen: ({ stegKode }) => stegKode === bpc.SAKSOPPLYSNINGER,
  endpoints: [esBehandlingApi.MEDLEMSKAP, esBehandlingApi.PERSONOPPLYSNINGER],
  renderComponent: (props) => <CheckPersonStatusIndex {...props} />,
  getExtraData: () => {},
}, {
  showWhen: ({ stegKode, aksjonspunkter }) => (stegKode === bpc.FOEDSEL
    && aksjonspunkter.some((ap) => [aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN].includes(ap.definisjon.kode))),
  endpoints: [],
  renderComponent: (props) => <FodselVilkarProsessIndex {...props} />,
  getExtraData: ({ vilkar }) => ({ vilkar, ytelseTypeKode: fagsakYtelseType.ENGANGSSTONAD }),
}, {
  showWhen: ({ stegKode, aksjonspunkter }) => (stegKode === bpc.ADOPSJON
    && aksjonspunkter.some((ap) => [aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN].includes(ap.definisjon.kode))),
  endpoints: [],
  renderComponent: (props) => <AdopsjonVilkarProsessIndex {...props} />,
  getExtraData: ({ vilkar }) => ({ vilkar }),
}, {
  showWhen: ({ stegKode, aksjonspunkter }) => stegKode === bpc.SOEKNADSFRIST
    && aksjonspunkter.map((a) => a.definisjon.kode).includes(aksjonspunktCodes.SOKNADSFRISTVILKARET),
  endpoints: [esBehandlingApi.VILKAR, esBehandlingApi.SOKNAD, esBehandlingApi.FAMILIEHENDELSE],
  renderComponent: (props) => <SoknadsfristVilkarProsessIndex {...props} />,
  getExtraData: () => {},
}, {
  showWhen: ({ stegKode }) => stegKode === bpc.VARSEL,
  endpoints: [esBehandlingApi.FAMILIEHENDELSE, esBehandlingApi.SOKNAD, esBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
    esBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING],
  renderComponent: (props) => <VarselOmRevurderingProsessIndex {...props} />,
  getExtraData: ({ previewCallback, dispatchSubmitFailed }) => ({ previewCallback, dispatchSubmitFailed }),
}, {
  showWhen: ({ stegKode, aksjonspunkter }) => stegKode === bpc.OMSORG
    && aksjonspunkter.some((a) => [aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET, aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN].includes(a.definisjon.kode)),
  endpoints: [],
  renderComponent: (props) => <OmsorgVilkarProsessIndex {...props} />,
  getExtraData: () => {},
}, {
  code: bpc.BEREGNING,
  showWhen: ({ stegKode }) => stegKode === bpc.BEREGNING,
  endpoints: [esBehandlingApi.BEREGNINGRESULTAT_ENGANGSSTONAD],
  renderComponent: (props) => <BeregningsresultatProsessIndex {...props} />,
  getExtraData: () => {},
}, {
  showWhen: ({ stegKode }) => stegKode === bpc.VEDTAK,
  endpoints: [esBehandlingApi.BEREGNINGRESULTAT_ENGANGSSTONAD, esBehandlingApi.TILBAKEKREVINGVALG,
    esBehandlingApi.SIMULERING_RESULTAT, esBehandlingApi.VILKAR, esBehandlingApi.SEND_VARSEL_OM_REVURDERING,
    esBehandlingApi.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING, esBehandlingApi.MEDLEMSKAP],
  renderComponent: (props) => <VedtakProsessIndex {...props} />,
  getExtraData: ({ previewCallback, rettigheter, aksjonspunkter }) => ({
    previewCallback,
    aksjonspunkter,
    ytelseTypeKode: fagsakYtelseType.ENGANGSSTONAD,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
  }),
}, {
  showWhen: ({ aksjonspunkter, stegKode }) => harVilkarresultatMedOverstyring(aksjonspunkter, stegKode),
  endpoints: [esBehandlingApi.MEDLEMSKAP],
  renderComponent: (props) => <VilkarresultatMedOverstyringProsessIndex {...props} />,
  getExtraData: ({
    valgtStegKode, overstyrteProsessSteg, vilkar, label, alleKodeverk,
  }) => ({
    erOverstyrt: overstyrteProsessSteg.includes(valgtStegKode),
    panelTittel: label,
    avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkar[0].vilkarType.kode],
    lovReferanse: vilkar[0].lovReferanse,
    overstyringApKode: hentOverstyringAksjonspunktKodeFor(valgtStegKode, vilkar),
    erMedlemskapsPanel: valgtStegKode === bpc.MEDLEMSKAP,
  }),
}, {
  showWhen: ({ stegKode }) => stegKode === bpc.AVREGNING,
  endpoints: [esBehandlingApi.AKSJONSPUNKTER, esBehandlingApi.SIMULERING_RESULTAT, esBehandlingApi.TILBAKEKREVINGVALG],
  renderComponent: (props) => <AvregningProsessIndex {...props} />,
  getExtraData: ({ fagsak, featureToggles, previewFptilbakeCallback }) => ({ fagsak, featureToggles, previewFptilbakeCallback }),
}, {
  showWhen: ({ stegKode }) => stegKode === bpc.FORELDREANSVAR,
  endpoints: [],
  renderComponent: (props) => <ForeldreansvarVilkarProsessIndex {...props} />,
  getExtraData: ({ vilkar }) => ({
    isEngangsstonad: true,
    isForeldreansvar2Ledd: vilkar.map((v) => v.vilkarType.kode).includes(vilkarType.FORELDREANSVARSVILKARET_2_LEDD),
  }),
}];

export default prosessStegPaneler;
