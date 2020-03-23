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
import { prosessStegCodes as bpc } from '@fpsak-frontend/konstanter';
import vt from '@fpsak-frontend/kodeverk/src/vilkarType';
import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegPanelDefinisjon } from '@fpsak-frontend/behandling-felles';

import findStatusForVedtak from './vedtakStatusUtlederEs';
import api from '../data/esBehandlingApi';

const harVilkarresultatMedOverstyring = (aksjonspunkterForSteg, aksjonspunktDefKoderForSteg) => {
  const apKoder = aksjonspunkterForSteg.map((ap) => ap.definisjon.kode);
  const harIngenApOgMulighetTilOverstyring = apKoder.length === 0 && aksjonspunktDefKoderForSteg.length > 0;
  const harApSomErOverstyringAp = apKoder.some((apCode) => aksjonspunktDefKoderForSteg.includes(apCode));
  return harIngenApOgMulighetTilOverstyring || harApSomErOverstyringAp;
};

const DEFAULT_PROPS_FOR_OVERSTYRINGPANEL = ({
  showComponent: ({ vilkarForSteg, aksjonspunkterForSteg, aksjonspunktDefKoderForSteg }) => vilkarForSteg.length > 0
    && harVilkarresultatMedOverstyring(aksjonspunkterForSteg, aksjonspunktDefKoderForSteg),
  renderComponent: (props) => <VilkarresultatMedOverstyringProsessIndex {...props} />,
  getData: ({ vilkarForSteg, alleKodeverk }) => ({
    avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarForSteg[0].vilkarType.kode],
  }),
  isOverridable: true,
  aksjonspunkterTextCodes: [],
});

const PANEL_ATTRIBUTTER = {
  vilkarCodes: [],
  endpoints: [],
  getData: () => {},
  aksjonspunkterTextCodes: [],
  showComponent: undefined,
  overrideStatus: undefined,
  isOverridable: false,
  overridePanel: undefined,
};

const prosessStegPanelDefinisjoner = [{
  urlCode: bpc.VARSEL,
  textCode: 'Behandlingspunkt.CheckVarselRevurdering',
  panels: [{
    aksjonspunkterCodes: [ac.VARSEL_REVURDERING_MANUELL, ac.VARSEL_REVURDERING_ETTERKONTROLL],
    endpoints: [api.FAMILIEHENDELSE, api.FAMILIEHENDELSE_ORIGINAL_BEHANDLING, api.SOKNAD_ORIGINAL_BEHANDLING],
    renderComponent: (props) => <VarselOmRevurderingProsessIndex {...props} />,
    getData: ({ previewCallback, dispatchSubmitFailed, soknad }) => ({ previewCallback, dispatchSubmitFailed, soknad }),
  }],
}, {
  urlCode: bpc.SAKSOPPLYSNINGER,
  textCode: 'Behandlingspunkt.Saksopplysninger',
  panels: [{
    aksjonspunkterCodes: [ac.AVKLAR_PERSONSTATUS],
    endpoints: [api.MEDLEMSKAP],
    renderComponent: (props) => <CheckPersonStatusIndex {...props} />,
    getData: ({ personopplysninger }) => ({ personopplysninger }),
  }],
}, {
  urlCode: bpc.OPPLYSNINGSPLIKT,
  textCode: 'Behandlingspunkt.Opplysningsplikt',
  panels: [{
    aksjonspunkterCodes: [ac.SOKERS_OPPLYSNINGSPLIKT_OVST, ac.SOKERS_OPPLYSNINGSPLIKT_MANU],
    aksjonspunkterTextCodes: ['SokersOpplysningspliktForm.UtfyllendeOpplysninger', 'SokersOpplysningspliktForm.UtfyllendeOpplysninger'],
    vilkarCodes: [vt.SOKERSOPPLYSNINGSPLIKT],
    showComponent: ({ vilkarForSteg }) => vilkarForSteg.length > 0,
    renderComponent: (props) => <SokersOpplysningspliktVilkarProsessIndex {...props} />,
    getData: ({ soknad }) => ({ soknad }),
  }],
}, {
  urlCode: bpc.INNGANGSVILKAR,
  textCode: 'Behandlingspunkt.Inngangsvilkar',
  panels: [{
    code: 'FODSEL',
    textCode: 'Inngangsvilkar.Fodselsvilkaret',
    aksjonspunkterCodes: [ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN],
    aksjonspunkterTextCodes: ['FodselVilkarForm.VurderGjelderSammeBarn', 'FodselVilkarForm.VurderGjelderSammeBarn'],
    vilkarCodes: [vt.FODSELSVILKARET_MOR],
    renderComponent: (props) => <FodselVilkarProsessIndex {...props} />,
    getData: () => ({ ytelseTypeKode: fagsakYtelseType.ENGANGSSTONAD }),
    overridePanel: {
      aksjonspunkterCodes: [ac.OVERSTYR_FODSELSVILKAR],
      ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
    },
  }, {
    code: 'ADOPSJON',
    textCode: 'Inngangsvilkar.Adopsjonsvilkaret',
    aksjonspunkterCodes: [ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN],
    aksjonspunkterTextCodes: ['AdopsjonVilkarForm.VurderGjelderSammeBarn', 'AdopsjonVilkarForm.VurderGjelderSammeBarn'],
    vilkarCodes: [vt.ADOPSJONSVILKARET],
    renderComponent: (props) => <AdopsjonVilkarProsessIndex {...props} />,
    getData: ({ vilkarForSteg }) => ({ vilkar: vilkarForSteg }),
    overridePanel: {
      aksjonspunkterCodes: [ac.OVERSTYR_ADOPSJONSVILKAR],
      ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
    },
  }, {
    code: 'OMSORG',
    textCode: 'Inngangsvilkar.Omsorgsvilkaret',
    aksjonspunkterCodes: [ac.MANUELL_VURDERING_AV_OMSORGSVILKARET, ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN],
    aksjonspunkterTextCodes: ['ErOmsorgVilkaarOppfyltForm.Paragraf', 'ErOmsorgVilkaarOppfyltForm.Vurder', 'ErOmsorgVilkaarOppfyltForm.Vurder'],
    vilkarCodes: [vt.OMSORGSVILKARET],
    renderComponent: (props) => <OmsorgVilkarProsessIndex {...props} />,
  }, {
    code: 'MEDLEMSKAP',
    textCode: 'Inngangsvilkar.Medlemskapsvilkaret',
    aksjonspunkterCodes: [ac.OVERSTYR_MEDLEMSKAPSVILKAR],
    vilkarCodes: [vt.MEDLEMSKAPSVILKARET],
    endpoints: [api.MEDLEMSKAP],
    ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
  }, {
    code: 'FORELDREANSVARSVILKARET',
    textCode: 'Inngangsvilkar.Foreldreansvar',
    aksjonspunkterCodes: [ac.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD, ac.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD,
      ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN],
    aksjonspunkterTextCodes: ['ErForeldreansvarVilkaarOppfyltForm.2LeddParagrafEngangsStonad', 'ErForeldreansvarVilkaarOppfyltForm.4LeddParagraf',
      'ErForeldreansvarVilkaarOppfyltForm.Vurder', 'ErForeldreansvarVilkaarOppfyltForm.Vurder'],
    vilkarCodes: [vt.FORELDREANSVARSVILKARET_2_LEDD, vt.FORELDREANSVARSVILKARET_4_LEDD],
    renderComponent: (props) => <ForeldreansvarVilkarProsessIndex {...props} />,
    getData: ({ vilkarForSteg }) => ({
      isEngangsstonad: true,
      isForeldreansvar2Ledd: vilkarForSteg.map((v) => v.vilkarType.kode).includes(vt.FORELDREANSVARSVILKARET_2_LEDD),
    }),
  }],
}, {
  urlCode: bpc.SOEKNADSFRIST,
  textCode: 'Behandlingspunkt.Soknadsfristvilkaret',
  panels: [{
    aksjonspunkterCodes: [ac.SOKNADSFRISTVILKARET],
    vilkarCodes: [vt.SOKNADFRISTVILKARET],
    endpoints: [api.FAMILIEHENDELSE],
    renderComponent: (props) => <SoknadsfristVilkarProsessIndex {...props} />,
    overridePanel: {
      aksjonspunkterCodes: [ac.OVERSTYR_SOKNADSFRISTVILKAR],
      ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
    },
    getData: ({ soknad }) => ({ soknad }),
  }],
}, {
  urlCode: bpc.BEREGNING,
  textCode: 'Behandlingspunkt.Beregning',
  panels: [{
    aksjonspunkterCodes: [ac.OVERSTYR_BEREGNING],
    vilkarCodes: [vt.SOKNADFRISTVILKARET],
    renderComponent: (props) => <BeregningsresultatProsessIndex {...props} />,
    showComponent: () => true,
    overrideStatus: ({ beregningresultatEngangsstonad }) => (beregningresultatEngangsstonad ? vut.OPPFYLT : vut.IKKE_VURDERT),
    isOverridable: true,
    getData: ({ beregningresultatEngangsstonad }) => ({ beregningresultatEngangsstonad }),
  }],
}, {
  urlCode: bpc.AVREGNING,
  textCode: 'Behandlingspunkt.Avregning',
  panels: [{
    aksjonspunkterCodes: [ac.VURDER_FEILUTBETALING],
    endpoints: [api.TILBAKEKREVINGVALG],
    renderComponent: (props) => <AvregningProsessIndex {...props} />,
    getData: ({
      fagsak, featureToggles, previewFptilbakeCallback, simuleringResultat,
    }) => ({
      fagsak, featureToggles, previewFptilbakeCallback, simuleringResultat,
    }),
    showComponent: () => true,
    overrideStatus: ({ simuleringResultat }) => (simuleringResultat ? vut.OPPFYLT : vut.IKKE_VURDERT),
  }],
}, {
  urlCode: bpc.VEDTAK,
  textCode: 'Behandlingspunkt.Vedtak',
  panels: [{
    aksjonspunkterCodes: [ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL, ac.VURDERE_ANNEN_YTELSE,
      ac.VURDERE_DOKUMENT, ac.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST, ac.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING],
    endpoints: [api.TILBAKEKREVINGVALG, api.SEND_VARSEL_OM_REVURDERING, api.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING, api.MEDLEMSKAP],
    renderComponent: (props) => <VedtakProsessIndex {...props} />,
    getData: ({
      previewCallback, rettigheter, aksjonspunkter, vilkar, beregningresultatEngangsstonad, simuleringResultat,
    }) => ({
      previewCallback,
      aksjonspunkter,
      vilkar,
      beregningresultatEngangsstonad,
      simuleringResultat,
      ytelseTypeKode: fagsakYtelseType.ENGANGSSTONAD,
      employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
    }),
    showComponent: () => true,
    overrideStatus: ({
      vilkar, aksjonspunkter, behandling, aksjonspunkterForSteg,
    }) => findStatusForVedtak(
      vilkar, aksjonspunkter, aksjonspunkterForSteg, behandling.behandlingsresultat,
    ),
  }],
}];

export default prosessStegPanelDefinisjoner.map((def) => ({
  ...def,
  panels: (def.panels as ProsessStegPanelDefinisjon[]).map((p) => ({
    ...PANEL_ATTRIBUTTER,
    ...p,
  })),
}));
