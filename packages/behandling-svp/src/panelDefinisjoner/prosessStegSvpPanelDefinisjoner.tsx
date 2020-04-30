import React from 'react';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import VurderSoknadsfristForeldrepengerIndex from '@fpsak-frontend/prosess-soknadsfrist';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import SvangerskapVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-svangerskap';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { prosessStegCodes as bpc } from '@fpsak-frontend/konstanter';
import vt from '@fpsak-frontend/kodeverk/src/vilkarType';
import bt from '@fpsak-frontend/kodeverk/src/behandlingType';
import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegPanelDefinisjon } from '@fpsak-frontend/behandling-felles';

import findStatusForVedtak from './vedtakStatusUtlederSvp';
import api from '../data/svpBehandlingApi';

const harVilkarresultatMedOverstyring = (aksjonspunkterForSteg, aksjonspunktDefKoderForSteg) => {
  const apKoder = aksjonspunkterForSteg.map((ap) => ap.definisjon.kode);
  const harIngenApOgMulighetTilOverstyring = apKoder.length === 0 && aksjonspunktDefKoderForSteg.length > 0;
  const harApSomErOverstyringAp = apKoder.some((apCode) => aksjonspunktDefKoderForSteg.includes(apCode));
  return harIngenApOgMulighetTilOverstyring || harApSomErOverstyringAp;
};

const harPeriodeMedUtbetaling = (perioder) => {
  const periode = perioder.find((p) => p.dagsats > 0);
  return !!periode;
};

const getStatusFromResultatstruktur = (resultatstruktur) => {
  if (resultatstruktur && resultatstruktur.perioder.length > 0) {
    if (!harPeriodeMedUtbetaling(resultatstruktur.perioder)) {
      return vut.IKKE_VURDERT;
    }
    return vut.OPPFYLT;
  }
  return vut.IKKE_VURDERT;
};

const DEFAULT_PROPS_FOR_OVERSTYRINGPANEL = ({
  showComponent: ({ vilkarForSteg, aksjonspunkterForSteg, aksjonspunktDefKoderForSteg }) => vilkarForSteg.length > 0
    && harVilkarresultatMedOverstyring(aksjonspunkterForSteg, aksjonspunktDefKoderForSteg),
  renderComponent: (props) => <VilkarresultatMedOverstyringProsessIndex {...props} />,
  getData: ({ alleKodeverk, vilkarForSteg }) => ({
    avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarForSteg[0].vilkarType.kode],
  }),
  isOverridable: true,
  aksjonspunkterTextCodes: [],
});

const VALGFRIE_ATTRIBUTTER = {
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
  urlCode: bpc.SAKSOPPLYSNINGER,
  textCode: 'Behandlingspunkt.Saksopplysninger',
  panels: [{
    aksjonspunkterCodes: [ac.AVKLAR_PERSONSTATUS],
    endpoints: [api.MEDLEMSKAP],
    getData: ({ personopplysninger }) => ({ personopplysninger }),
    renderComponent: (props) => <CheckPersonStatusIndex {...props} />,
  }],
}, {
  urlCode: bpc.OPPLYSNINGSPLIKT,
  textCode: 'Behandlingspunkt.Opplysningsplikt',
  panels: [{
    aksjonspunkterCodes: [ac.SOKERS_OPPLYSNINGSPLIKT_OVST, ac.SOKERS_OPPLYSNINGSPLIKT_MANU],
    aksjonspunkterTextCodes: ['SokersOpplysningspliktForm.UtfyllendeOpplysninger', 'SokersOpplysningspliktForm.UtfyllendeOpplysninger'],
    vilkarCodes: [vt.SOKERSOPPLYSNINGSPLIKT],
    getData: ({ soknad }) => ({ soknad }),
    showComponent: ({ behandling, aksjonspunkterForSteg }) => {
      const isRevurdering = bt.REVURDERING === behandling.type.kode;
      const hasAp = aksjonspunkterForSteg.some((ap) => ap.definisjon.kode === ac.SOKERS_OPPLYSNINGSPLIKT_MANU);
      return !(isRevurdering && !hasAp);
    },
    renderComponent: (props) => <SokersOpplysningspliktVilkarProsessIndex {...props} />,
  }],
}, {
  urlCode: bpc.INNGANGSVILKAR,
  textCode: 'Behandlingspunkt.Inngangsvilkar',
  panels: [{
    code: 'SVANGERSKAP',
    textCode: 'Inngangsvilkar.Svangerskapsvilkaret',
    aksjonspunkterCodes: [ac.SVANGERSKAPSVILKARET],
    aksjonspunkterTextCodes: ['SvangerskapVilkarForm.FyllerVilkår'],
    vilkarCodes: [vt.SVANGERSKAPVILKARET],
    renderComponent: (props) => <SvangerskapVilkarProsessIndex {...props} />,
  }, {
    code: 'MEDLEMSKAP',
    textCode: 'Inngangsvilkar.Medlemskapsvilkaret',
    aksjonspunkterCodes: [ac.OVERSTYR_MEDLEMSKAPSVILKAR],
    vilkarCodes: [vt.MEDLEMSKAPSVILKARET],
    endpoints: [api.MEDLEMSKAP],
    ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
  }, {
    code: 'OPPTJENINGSVILKARET',
    textCode: 'Inngangsvilkar.Opptjeningsvilkaret',
    aksjonspunkterCodes: [ac.OVERSTYRING_AV_OPPTJENINGSVILKARET],
    vilkarCodes: [vt.OPPTJENINGSPERIODE, vt.OPPTJENINGSVILKARET],
    ...DEFAULT_PROPS_FOR_OVERSTYRINGPANEL,
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
  urlCode: bpc.TILKJENT_YTELSE,
  textCode: 'Behandlingspunkt.TilkjentYtelse',
  panels: [{
    aksjonspunkterCodes: [ac.VURDER_TILBAKETREKK],
    endpoints: [api.FAMILIEHENDELSE],
    renderComponent: (props) => <TilkjentYtelseProsessIndex {...props} />,
    getData: ({
      fagsak, personopplysninger, soknad, beregningresultatForeldrepenger,
    }) => ({
      fagsak, personopplysninger, soknad, beregningresultat: beregningresultatForeldrepenger,
    }),
    showComponent: () => true,
    overrideStatus: ({ beregningresultatForeldrepenger }) => getStatusFromResultatstruktur(
      beregningresultatForeldrepenger,
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
      fagsak, simuleringResultat, featureToggles, previewFptilbakeCallback,
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
      ytelseTypeKode: fagsakYtelseType.SVANGERSKAPSPENGER,
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
    ...VALGFRIE_ATTRIBUTTER,
    ...p,
  })),
}));
