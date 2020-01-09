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
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import vt from '@fpsak-frontend/kodeverk/src/vilkarType';
import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import findStatusForVedtak from './vedtakStatusUtleder';
import api from '../data/fpBehandlingApi';

const harVilkarresultatMedOverstyring = (aksjonspunkterForSteg, aksjonspunktDefKoderForSteg) => {
  const apKoder = aksjonspunkterForSteg.map((ap) => ap.definisjon.kode);
  const harIngenApOgMulighetTilOverstyring = apKoder.length === 0 && aksjonspunktDefKoderForSteg.length > 0;
  const harApSomErOverstyringAp = apKoder.some((apCode) => aksjonspunktDefKoderForSteg.includes(apCode));
  return harIngenApOgMulighetTilOverstyring || harApSomErOverstyringAp;
};

const DEFAULT_PROPS_FOR_OVERSTYRINGPANEL = ({
  endpoints: [api.MEDLEMSKAP],
  showComponent: ({ vilkarForSteg, aksjonspunkterForSteg, aksjonspunktDefKoderForSteg }) => vilkarForSteg.length > 0
    && harVilkarresultatMedOverstyring(aksjonspunkterForSteg, aksjonspunktDefKoderForSteg),
  renderComponent: (props) => <VilkarresultatMedOverstyringProsessIndex {...props} />,
  getData: ({
    valgtStegKode, overstyrteProsessSteg, vilkarForSteg, label, alleKodeverk, aksjonspunktDefKoderForSteg,
  }) => ({
    erOverstyrt: overstyrteProsessSteg.includes(valgtStegKode),
    panelTittel: label,
    avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarForSteg[0].vilkarType.kode],
    lovReferanse: vilkarForSteg[0].lovReferanse,
    overstyringApKode: aksjonspunktDefKoderForSteg[0],
    erMedlemskapsPanel: valgtStegKode === bpc.MEDLEMSKAP,
  }),
  isOverridable: true,
});

const VALGFRIE_ATTRIBUTTER = {
  vilkarCodes: [],
  getData: () => {},
  showComponent: undefined,
  overrideStatus: undefined,
  isOverridable: false,
};

const prosessStegPanelDefinisjoner = [{
  urlCode: bpc.VARSEL,
  textCode: 'Behandlingspunkt.CheckVarselRevurdering',
  aksjonspunkterCodes: [ac.VARSEL_REVURDERING_MANUELL, ac.VARSEL_REVURDERING_ETTERKONTROLL],
  endpoints: [api.FAMILIEHENDELSE, api.SOKNAD, api.FAMILIEHENDELSE_ORIGINAL_BEHANDLING, api.SOKNAD_ORIGINAL_BEHANDLING],
  renderComponent: (props) => <VarselOmRevurderingProsessIndex {...props} />,
  getData: ({ previewCallback, dispatchSubmitFailed }) => ({ previewCallback, dispatchSubmitFailed }),
}, {
  urlCode: bpc.SAKSOPPLYSNINGER,
  textCode: 'Behandlingspunkt.Saksopplysninger',
  aksjonspunkterCodes: [ac.AVKLAR_PERSONSTATUS],
  endpoints: [api.MEDLEMSKAP, api.PERSONOPPLYSNINGER],
  renderComponent: (props) => <CheckPersonStatusIndex {...props} />,
}, {
  urlCode: bpc.OPPLYSNINGSPLIKT,
  textCode: 'Behandlingspunkt.Opplysningsplikt',
  aksjonspunkterCodes: [ac.SOKERS_OPPLYSNINGSPLIKT_OVST, ac.SOKERS_OPPLYSNINGSPLIKT_MANU],
  vilkarCodes: [vt.SOKERSOPPLYSNINGSPLIKT],
  endpoints: [api.SOKNAD],
  showComponent: ({ vilkarForSteg }) => vilkarForSteg.length > 0,
  renderComponent: (props) => <SokersOpplysningspliktVilkarProsessIndex {...props} />,
}, {
  urlCode: bpc.FOEDSEL,
  textCode: 'Behandlingspunkt.Fodselsvilkaret',
  aksjonspunkterCodes: [ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN],
  vilkarCodes: [vt.FODSELSVILKARET_MOR],
  endpoints: [],
  renderComponent: (props) => <FodselVilkarProsessIndex {...props} />,
  getData: () => ({ ytelseTypeKode: fagsakYtelseType.ENGANGSSTONAD }),
}, {
  urlCode: bpc.FOEDSEL,
  textCode: 'Behandlingspunkt.Fodselsvilkaret',
  aksjonspunkterCodes: [ac.OVERSTYR_FODSELSVILKAR],
  vilkarCodes: [vt.FODSELSVILKARET_MOR],
  ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
}, {
  urlCode: bpc.ADOPSJON,
  textCode: 'Behandlingspunkt.Adopsjonsvilkaret',
  aksjonspunkterCodes: [ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN],
  vilkarCodes: [vt.ADOPSJONSVILKARET],
  endpoints: [],
  renderComponent: (props) => <AdopsjonVilkarProsessIndex {...props} />,
  getData: ({ vilkarForSteg }) => ({ vilkar: vilkarForSteg }),
}, {
  urlCode: bpc.ADOPSJON,
  textCode: 'Behandlingspunkt.Adopsjonsvilkaret',
  aksjonspunkterCodes: [ac.OVERSTYR_ADOPSJONSVILKAR],
  vilkarCodes: [vt.ADOPSJONSVILKARET],
  ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
}, {
  urlCode: bpc.OMSORG,
  textCode: 'Behandlingspunkt.Omsorgsvilkaret',
  aksjonspunkterCodes: [ac.MANUELL_VURDERING_AV_OMSORGSVILKARET, ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
    ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN],
  vilkarCodes: [vt.OMSORGSVILKARET],
  endpoints: [],
  renderComponent: (props) => <OmsorgVilkarProsessIndex {...props} />,
}, {
  urlCode: bpc.FORELDREANSVAR,
  textCode: 'Behandlingspunkt.Foreldreansvar',
  aksjonspunkterCodes: [ac.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD, ac.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD,
    ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN],
  vilkarCodes: [vt.FORELDREANSVARSVILKARET_2_LEDD, vt.FORELDREANSVARSVILKARET_4_LEDD],
  endpoints: [],
  renderComponent: (props) => <ForeldreansvarVilkarProsessIndex {...props} />,
  getData: ({ vilkarForSteg }) => ({
    isEngangsstonad: true,
    isForeldreansvar2Ledd: vilkarForSteg.map((v) => v.vilkarType.kode).includes(vt.FORELDREANSVARSVILKARET_2_LEDD),
  }),
}, {
  urlCode: bpc.MEDLEMSKAP,
  textCode: 'Behandlingspunkt.Medlemskapsvilkaret',
  aksjonspunkterCodes: [ac.OVERSTYR_MEDLEMSKAPSVILKAR],
  vilkarCodes: [vt.MEDLEMSKAPSVILKARET],
  ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
}, {
  urlCode: bpc.SOEKNADSFRIST,
  textCode: 'Behandlingspunkt.Soknadsfristvilkaret',
  aksjonspunkterCodes: [ac.SOKNADSFRISTVILKARET],
  vilkarCodes: [vt.SOKNADFRISTVILKARET],
  endpoints: [api.SOKNAD, api.FAMILIEHENDELSE],
  renderComponent: (props) => <SoknadsfristVilkarProsessIndex {...props} />,
}, {
  urlCode: bpc.SOEKNADSFRIST,
  textCode: 'Behandlingspunkt.Soknadsfristvilkaret',
  aksjonspunkterCodes: [ac.OVERSTYR_SOKNADSFRISTVILKAR],
  vilkarCodes: [vt.SOKNADFRISTVILKARET],
  ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
}, {
  urlCode: bpc.BEREGNING,
  textCode: 'Behandlingspunkt.Beregning',
  aksjonspunkterCodes: [ac.OVERSTYR_BEREGNING],
  vilkarCodes: [vt.SOKNADFRISTVILKARET],
  endpoints: [api.BEREGNINGRESULTAT_ENGANGSSTONAD],
  renderComponent: (props) => <BeregningsresultatProsessIndex {...props} />,
  showComponent: () => true,
  overrideStatus: ({ beregningresultatEngangsstonad }) => (beregningresultatEngangsstonad ? vut.OPPFYLT : vut.IKKE_VURDERT),
  isOverridable: true,
}, {
  urlCode: bpc.AVREGNING,
  textCode: 'Behandlingspunkt.Avregning',
  aksjonspunkterCodes: [ac.VURDER_FEILUTBETALING],
  endpoints: [api.SIMULERING_RESULTAT, api.TILBAKEKREVINGVALG],
  renderComponent: (props) => <AvregningProsessIndex {...props} />,
  getData: ({ fagsak, featureToggles, previewFptilbakeCallback }) => ({ fagsak, featureToggles, previewFptilbakeCallback }),
  showComponent: () => true,
  overrideStatus: ({ simuleringResultat }) => (simuleringResultat ? vut.OPPFYLT : vut.IKKE_VURDERT),
}, {
  urlCode: bpc.VEDTAK,
  textCode: 'Behandlingspunkt.Vedtak',
  aksjonspunkterCodes: [ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL, ac.VURDERE_ANNEN_YTELSE,
    ac.VURDERE_DOKUMENT, ac.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST, ac.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING],
  endpoints: [api.BEREGNINGRESULTAT_ENGANGSSTONAD, api.TILBAKEKREVINGVALG, api.SIMULERING_RESULTAT, api.SEND_VARSEL_OM_REVURDERING,
    api.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING, api.MEDLEMSKAP],
  renderComponent: (props) => <VedtakProsessIndex {...props} />,
  getData: ({
    previewCallback, rettigheter, aksjonspunkter, vilkar,
  }) => ({
    previewCallback,
    aksjonspunkter,
    vilkar,
    ytelseTypeKode: fagsakYtelseType.ENGANGSSTONAD,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
  }),
  showComponent: () => true,
  overrideStatus: ({
    vilkar, aksjonspunkter, behandling, aksjonspunkterForSteg,
  }) => findStatusForVedtak(
    vilkar, aksjonspunkter, aksjonspunkterForSteg, behandling.behandlingsresultat,
  ),
}];

export default prosessStegPanelDefinisjoner.map((def) => ({
  ...VALGFRIE_ATTRIBUTTER,
  ...def,
}));
