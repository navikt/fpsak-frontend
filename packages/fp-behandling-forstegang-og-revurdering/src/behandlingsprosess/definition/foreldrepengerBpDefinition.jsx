import { BehandlingspunktProperties } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vt from '@fpsak-frontend/kodeverk/src/vilkarType';
import bt from '@fpsak-frontend/kodeverk/src/behandlingType';
import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import prt from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import getStatusFromSimulering from './simuleringStatusUtleder';
import getVedtakStatus from './vedtakStatusUtleder';

const getStatusFromResultatstruktur = ({ resultatstruktur, uttaksresultat }) => {
  if (resultatstruktur && resultatstruktur.perioder.length > 0) {
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

const hasNonDefaultBehandlingspunkt = (builderData, bpLength) => bpLength > 0;

const isNotRevurderingAndManualOpplysningspliktAp = ({ behandlingType, aksjonspunkter }) => {
  const isRevurdering = bt.REVURDERING === behandlingType.kode;
  const hasAp = aksjonspunkter.some((ap) => ap.definisjon.kode === ac.SOKERS_OPPLYSNINGSPLIKT_MANU);
  return !(isRevurdering && !hasAp);
};

/**
 * Rekkefølgen i listene under bestemmer behandlingspunkt-rekkefølgen i GUI.
 * @see BehandlingspunktProperties.Builder for mer informasjon.
 */
const foreldrepengerBuilders = [
  new BehandlingspunktProperties.Builder(bpc.SAKSOPPLYSNINGER, 'Saksopplysninger')
    .withAksjonspunktCodes(ac.AVKLAR_PERSONSTATUS),
  new BehandlingspunktProperties.Builder(bpc.OPPLYSNINGSPLIKT, 'Opplysningsplikt')
    .withVilkarTypes(vt.SOKERSOPPLYSNINGSPLIKT)
    .withAksjonspunktCodes(ac.SOKERS_OPPLYSNINGSPLIKT_OVST, ac.SOKERS_OPPLYSNINGSPLIKT_MANU)
    .withDefaultVisibilityWhenCustomFnReturnsTrue(isNotRevurderingAndManualOpplysningspliktAp),
  new BehandlingspunktProperties.Builder(bpc.FOEDSEL, 'Fodselsvilkaret')
    .withVilkarTypes(vt.FODSELSVILKARET_MOR, vt.FODSELSVILKARET_FAR)
    .withAksjonspunktCodes(
      ac.OVERSTYR_FODSELSVILKAR, ac.OVERSTYR_FODSELSVILKAR_FAR_MEDMOR, ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
    ),
  new BehandlingspunktProperties.Builder(bpc.ADOPSJON, 'Adopsjonsvilkaret')
    .withVilkarTypes(vt.ADOPSJONSVILKARET_FORELDREPENGER)
    .withAksjonspunktCodes(
      ac.OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP, ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
    ),
  new BehandlingspunktProperties.Builder(bpc.OMSORG, 'Omsorgsvilkaret')
    .withVilkarTypes(vt.OMSORGSVILKARET)
    .withAksjonspunktCodes(
      ac.MANUELL_VURDERING_AV_OMSORGSVILKARET, ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
    ),
  new BehandlingspunktProperties.Builder(bpc.FORELDREANSVAR, 'Foreldreansvar')
    .withVilkarTypes(vt.FORELDREANSVARSVILKARET_2_LEDD, vt.FORELDREANSVARSVILKARET_4_LEDD)
    .withAksjonspunktCodes(
      ac.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD, ac.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD,
      ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
    ),
  new BehandlingspunktProperties.Builder(bpc.MEDLEMSKAP, 'Medlemskapsvilkaret')
    .withVilkarTypes(vt.MEDLEMSKAPSVILKARET)
    .withAksjonspunktCodes(ac.OVERSTYR_MEDLEMSKAPSVILKAR),
  new BehandlingspunktProperties.Builder(bpc.OPPTJENING, 'Opptjeningsvilkaret')
    .withVilkarTypes(vt.OPPTJENINGSPERIODE, vt.OPPTJENINGSVILKARET)
    .withAksjonspunktCodes(ac.OVERSTYRING_AV_OPPTJENINGSVILKARET,
      ac.VURDER_OPPTJENINGSVILKARET),
  new BehandlingspunktProperties.Builder(bpc.BEREGNINGSGRUNNLAG, 'Beregning')
    .withVilkarTypes(vt.BEREGNINGSGRUNNLAGVILKARET)
    .withAksjonspunktCodes(
      ac.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS, ac.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      ac.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE, ac.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      ac.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, ac.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG, ac.VURDER_DEKNINGSGRAD,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withVilkarIsOptional(),
  new BehandlingspunktProperties.Builder(bpc.SOEKNADSFRIST, 'Soknadsfristvilkaret')
    .withAksjonspunktCodes(ac.VURDER_SOKNADSFRIST_FORELDREPENGER),

  new BehandlingspunktProperties.Builder(bpc.FORTSATTMEDLEMSKAP, 'FortsattMedlemskap')
    .withVilkarTypes(vt.MEDLEMSKAPSVILKÅRET_LØPENDE)
    .withAksjonspunktCodes(ac.OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR),

  new BehandlingspunktProperties.Builder(bpc.TILKJENT_YTELSE, 'TilkjentYtelse')
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withAksjonspunktCodes(ac.VURDER_TILBAKETREKK)
    .withStatus(getStatusFromResultatstruktur),
  new BehandlingspunktProperties.Builder(bpc.AVREGNING, 'Avregning')
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withAksjonspunktCodes(ac.VURDER_FEILUTBETALING)
    .withStatus(getStatusFromSimulering),
  new BehandlingspunktProperties.Builder(bpc.VEDTAK, 'Vedtak')
    .withAksjonspunktCodes(
      ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL, ac.VURDERE_ANNEN_YTELSE,
      ac.VURDERE_DOKUMENT, ac.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST, ac.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withStatus(getVedtakStatus),
];

const createForeldrepengerBpProps = (builderData) => foreldrepengerBuilders.reduce((currentFbs, fb) => {
  const res = fb.build(builderData, currentFbs.length);
  return res.isVisible ? currentFbs.concat([res]) : currentFbs;
}, []);

export default createForeldrepengerBpProps;
