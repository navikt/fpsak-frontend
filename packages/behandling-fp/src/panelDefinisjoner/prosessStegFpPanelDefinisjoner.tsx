import React from 'react';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening';
import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import ForeldreansvarVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-foreldreansvar';
import UttakProsessIndex from '@fpsak-frontend/prosess-uttak';
import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import FodselVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-fodsel';
import VurderSoknadsfristForeldrepengerIndex from '@fpsak-frontend/prosess-soknadsfrist';
import AdopsjonVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-adopsjon';
import OmsorgVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-omsorg';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { prosessStegCodes as bpc } from '@fpsak-frontend/konstanter';
import vt from '@fpsak-frontend/kodeverk/src/vilkarType';
import bt from '@fpsak-frontend/kodeverk/src/behandlingType';
import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import prt from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import { ProsessStegPanelDefinisjon } from '@fpsak-frontend/behandling-felles';

import findStatusForVedtak from './vedtakStatusUtlederFp';
import api from '../data/fpBehandlingApi';

const faktaUttakAp = [
  ac.AVKLAR_UTTAK,
  ac.ANNEN_FORELDER_IKKE_RETT_OG_LØPENDE_VEDTAK,
  ac.AVKLAR_FØRSTE_UTTAKSDATO,
  ac.AVKLAR_ANNEN_FORELDER_RETT,
  ac.MANUELL_AVKLAR_FAKTA_UTTAK,
  ac.OVERSTYR_AVKLAR_FAKTA_UTTAK,
];

const harPeriodeMedUtbetaling = (perioder) => {
  const periode = perioder.find((p) => p.dagsats > 0);
  return !!periode;
};

const getStatusFromResultatstruktur = (resultatstruktur, uttaksresultat) => {
  if (resultatstruktur && resultatstruktur.perioder.length > 0) {
    if (!harPeriodeMedUtbetaling(resultatstruktur.perioder)) {
      return vut.IKKE_VURDERT;
    }
    if (uttaksresultat && uttaksresultat.perioderSøker.length > 0) {
      const oppfylt = uttaksresultat.perioderSøker.some((p) => (
        p.periodeResultatType.kode !== prt.AVSLATT
      ));
      if (oppfylt) {
        return vut.OPPFYLT;
      }
    }
  }
  return vut.IKKE_VURDERT;
};

const getStatusFromUttakresultat = (uttaksresultat, aksjonspunkter) => {
  if (!uttaksresultat || aksjonspunkter.some((ap) => faktaUttakAp.includes(ap.definisjon.kode) && ap.status.kode === 'OPPR')) {
    return vut.IKKE_VURDERT;
  }
  if (uttaksresultat.perioderSøker && uttaksresultat.perioderSøker.length > 0) {
    const oppfylt = uttaksresultat.perioderSøker.some((p) => (
      p.periodeResultatType.kode !== prt.AVSLATT
    ));
    if (oppfylt) {
      return vut.OPPFYLT;
    }
  }
  return vut.IKKE_OPPFYLT;
};

const harVilkarresultatMedOverstyring = (aksjonspunkterForSteg, aksjonspunktDefKoderForSteg) => {
  const apKoder = aksjonspunkterForSteg.map((ap) => ap.definisjon.kode);
  const harIngenApOgMulighetTilOverstyring = apKoder.length === 0 && aksjonspunktDefKoderForSteg.length > 0;
  const harApSomErOverstyringAp = apKoder.some((apCode) => aksjonspunktDefKoderForSteg.includes(apCode));
  return harIngenApOgMulighetTilOverstyring || harApSomErOverstyringAp;
};

const avslagsarsakerES = ['1002', '1003', '1032'];
const filtrerAvslagsarsaker = (avslagsarsaker, vilkarTypeKode) => (vilkarTypeKode === vt.FODSELSVILKARET_MOR
  ? avslagsarsaker[vilkarTypeKode].filter((arsak) => !avslagsarsakerES.includes(arsak.kode))
  : avslagsarsaker[vilkarTypeKode]);

const DEFAULT_PROPS_FOR_OVERSTYRINGPANEL = ({
  showComponent: ({ vilkarForSteg, aksjonspunkterForSteg, aksjonspunktDefKoderForSteg }) => vilkarForSteg.length > 0
    && harVilkarresultatMedOverstyring(aksjonspunkterForSteg, aksjonspunktDefKoderForSteg),
  renderComponent: (props) => <VilkarresultatMedOverstyringProsessIndex {...props} />,
  getData: ({ vilkarForSteg, alleKodeverk }) => ({
    avslagsarsaker: filtrerAvslagsarsaker(alleKodeverk[kodeverkTyper.AVSLAGSARSAK], vilkarForSteg[0].vilkarType.kode),
  }),
  isOverridable: true,
  aksjonspunkterTextCodes: [],
});

const PANEL_ATTRIBUTTER = {
  vilkarCodes: [],
  endpoints: [],
  getData: () => ({}),
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
    showComponent: ({ behandling, aksjonspunkterForSteg }) => {
      const isRevurdering = bt.REVURDERING === behandling.type.kode;
      const hasAp = aksjonspunkterForSteg.some((ap) => ap.definisjon.kode === ac.SOKERS_OPPLYSNINGSPLIKT_MANU);
      return !(isRevurdering && !hasAp);
    },
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
    vilkarCodes: [vt.FODSELSVILKARET_MOR, vt.FODSELSVILKARET_FAR],
    renderComponent: (props) => <FodselVilkarProsessIndex {...props} />,
    getData: () => ({ ytelseTypeKode: fagsakYtelseType.FORELDREPENGER }),
    overridePanel: {
      aksjonspunkterCodes: [ac.OVERSTYR_FODSELSVILKAR, ac.OVERSTYR_FODSELSVILKAR_FAR_MEDMOR],
      ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
    },
  }, {
    code: 'ADOPSJON',
    textCode: 'Inngangsvilkar.Adopsjonsvilkaret',
    aksjonspunkterCodes: [ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN],
    aksjonspunkterTextCodes: ['AdopsjonVilkarForm.VurderGjelderSammeBarn', 'AdopsjonVilkarForm.VurderGjelderSammeBarn'],
    vilkarCodes: [vt.ADOPSJONSVILKARET_FORELDREPENGER],
    renderComponent: (props) => <AdopsjonVilkarProsessIndex {...props} />,
    getData: ({ vilkarForSteg }) => ({ vilkar: vilkarForSteg }),
    overridePanel: {
      aksjonspunkterCodes: [ac.OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP],
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
    aksjonspunkterTextCodes: ['ErForeldreansvarVilkaarOppfyltForm.2LeddParagrafForeldrepenger', 'ErForeldreansvarVilkaarOppfyltForm.4LeddParagraf',
      'ErForeldreansvarVilkaarOppfyltForm.Vurder', 'ErForeldreansvarVilkaarOppfyltForm.Vurder'],
    vilkarCodes: [vt.FORELDREANSVARSVILKARET_2_LEDD, vt.FORELDREANSVARSVILKARET_4_LEDD],
    renderComponent: (props) => <ForeldreansvarVilkarProsessIndex {...props} />,
    getData: ({ vilkarForSteg }) => ({
      isEngangsstonad: false,
      isForeldreansvar2Ledd: vilkarForSteg.map((v) => v.vilkarType.kode).includes(vt.FORELDREANSVARSVILKARET_2_LEDD),
    }),
  }, {
    code: 'OPPTJENINGSVILKARET',
    textCode: 'Inngangsvilkar.Opptjeningsvilkaret',
    aksjonspunkterCodes: [ac.VURDER_OPPTJENINGSVILKARET],
    aksjonspunkterTextCodes: ['OpptjeningVilkarView.VurderOmSøkerHarRett'],
    vilkarCodes: [vt.OPPTJENINGSPERIODE, vt.OPPTJENINGSVILKARET],
    endpoints: [api.OPPTJENING],
    renderComponent: (props) => <OpptjeningVilkarProsessIndex {...props} />,
    getData: ({ vilkarForSteg }) => ({
      lovReferanse: vilkarForSteg[0].lovReferanse,
    }),
    overridePanel: {
      aksjonspunkterCodes: [ac.OVERSTYRING_AV_OPPTJENINGSVILKARET],
      ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
    },
  }],
}, {
  urlCode: bpc.BEREGNINGSGRUNNLAG,
  textCode: 'Behandlingspunkt.Beregning',
  panels: [{
    aksjonspunkterCodes: [ac.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS, ac.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      ac.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE, ac.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      ac.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, ac.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG, ac.VURDER_DEKNINGSGRAD],
    vilkarCodes: [vt.BEREGNINGSGRUNNLAGVILKARET],
    renderComponent: (props) => <BeregningsgrunnlagProsessIndex {...props} />,
    showComponent: () => true,
    getData: ({ fagsak, featureToggles, beregningsgrunnlag }) => ({ fagsak, featureToggles, beregningsgrunnlag }),
  }],
}, {
  urlCode: bpc.SOEKNADSFRIST,
  textCode: 'Behandlingspunkt.Soknadsfristvilkaret',
  panels: [{
    aksjonspunkterCodes: [ac.VURDER_SOKNADSFRIST_FORELDREPENGER],
    endpoints: [api.UTTAK_PERIODE_GRENSE],
    renderComponent: (props) => <VurderSoknadsfristForeldrepengerIndex {...props} />,
    getData: ({ soknad }) => ({ soknad }),
  }],
}, {
  urlCode: bpc.FORTSATTMEDLEMSKAP,
  textCode: 'Behandlingspunkt.FortsattMedlemskap',
  panels: [{
    aksjonspunkterCodes: [ac.OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR],
    vilkarCodes: [vt.MEDLEMSKAPSVILKÅRET_LØPENDE],
    ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
  }],
}, {
  urlCode: bpc.UTTAK,
  textCode: 'Behandlingspunkt.Uttak',
  panels: [{
    aksjonspunkterCodes: [ac.FASTSETT_UTTAKPERIODER, ac.OVERSTYRING_AV_UTTAKPERIODER, ac.TILKNYTTET_STORTINGET, ac.KONTROLLER_REALITETSBEHANDLING_ELLER_KLAGE,
      ac.KONTROLLER_OPPLYSNINGER_OM_FORDELING_AV_STØNADSPERIODEN, ac.KONTROLLER_OPPLYSNINGER_OM_DØD,
      ac.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST, ac.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET, ac.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT],
    endpoints: [api.FAKTA_ARBEIDSFORHOLD, api.FAMILIEHENDELSE, api.UTTAK_PERIODE_GRENSE],
    renderComponent: (props) => <UttakProsessIndex {...props} />,
    getData: ({
      fagsak, rettigheter, tempUpdateStonadskontoer, uttaksresultatPerioder, uttakStonadskontoer, soknad, personopplysninger, ytelsefordeling,
    }) => ({
      fagsak,
      tempUpdateStonadskontoer,
      employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
      uttaksresultatPerioder,
      uttakStonadskontoer,
      soknad,
      personopplysninger,
      ytelsefordeling,
    }),
    showComponent: () => true,
    overrideStatus: ({ uttaksresultatPerioder, aksjonspunkter }) => getStatusFromUttakresultat(uttaksresultatPerioder, aksjonspunkter),
  }],
}, {
  urlCode: bpc.TILKJENT_YTELSE,
  textCode: 'Behandlingspunkt.TilkjentYtelse',
  panels: [{
    aksjonspunkterCodes: [ac.VURDER_TILBAKETREKK],
    endpoints: [api.FAMILIEHENDELSE],
    renderComponent: (props) => <TilkjentYtelseProsessIndex {...props} />,
    getData: ({
      fagsak, beregningresultatForeldrepenger, personopplysninger, soknad,
    }) => ({
      fagsak, personopplysninger, soknad, beregningresultat: beregningresultatForeldrepenger,
    }),
    showComponent: () => true,
    overrideStatus: ({ beregningresultatForeldrepenger, uttaksresultatPerioder }) => getStatusFromResultatstruktur(
      beregningresultatForeldrepenger, uttaksresultatPerioder,
    ),
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
      previewCallback, rettigheter, aksjonspunkter, vilkar, beregningresultatForeldrepenger, simuleringResultat, beregningsgrunnlag,
    }) => ({
      previewCallback,
      aksjonspunkter,
      vilkar,
      beregningresultatForeldrepenger,
      simuleringResultat,
      beregningsgrunnlag,
      ytelseTypeKode: fagsakYtelseType.FORELDREPENGER,
      kanOverstyre: rettigheter.kanOverstyreAccess.isEnabled,
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
