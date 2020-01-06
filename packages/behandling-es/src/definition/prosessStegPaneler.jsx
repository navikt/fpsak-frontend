import React from 'react';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import FodselVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-fodsel';
import SoknadsfristVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-soknadsfrist';
import BeregningsresultatProsessIndex from '@fpsak-frontend/prosess-beregningsresultat';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';

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
  showWhen: ({ stegKode, aksjonspunkter }) => (stegKode === bpc.FOEDSEL
    && aksjonspunkter.some((ap) => [aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN].includes(ap.definisjon.kode))),
  endpoints: [],
  renderComponent: (props) => <FodselVilkarProsessIndex {...props} />,
  getExtraData: ({ vilkar }) => ({ vilkar, ytelseTypeKode: fagsakYtelseType.ENGANGSSTONAD }),
}, {
  showWhen: ({ stegKode, aksjonspunkter }) => stegKode === bpc.SOEKNADSFRIST
    && aksjonspunkter.map((a) => a.definisjon.kode).includes(aksjonspunktCodes.SOKNADSFRISTVILKARET),
  endpoints: [esBehandlingApi.VILKAR, esBehandlingApi.SOKNAD, esBehandlingApi.FAMILIEHENDELSE],
  renderComponent: (props) => <SoknadsfristVilkarProsessIndex {...props} />,
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
}];

export default prosessStegPaneler;
