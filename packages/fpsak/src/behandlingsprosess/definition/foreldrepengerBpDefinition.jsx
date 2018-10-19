import ac from 'kodeverk/aksjonspunktCodes';
import vt from 'kodeverk/vilkarType';
import bt from 'kodeverk/behandlingType';
import vut from 'kodeverk/vilkarUtfallType';
import bpc from 'behandlingsprosess/behandlingspunktCodes';
import getVedtakStatus from './vedtakStatusUtleder';
import BehandlingspunktProperties from './behandlingspunktBuilder';

const getStatusFromUttakresultat = ({ resultatstruktur }) => {
  if (!resultatstruktur) {
    return vut.IKKE_VURDERT;
  }
  if (resultatstruktur && resultatstruktur.perioder.length > 0) {
    return vut.OPPFYLT;
  }
  return vut.IKKE_OPPFYLT;
};

const getStatusFromResultatstruktur = ({ resultatstruktur, stonadskontoer }) => (
  resultatstruktur && resultatstruktur.perioder.length > 0 && stonadskontoer ? vut.OPPFYLT : vut.IKKE_VURDERT);

const behandlingTypeNotEquals = (...behandlingTypes) => ({ behandlingType }) => !behandlingTypes.some(b => b === behandlingType.kode);
const hasNonDefaultBehandlingspunkt = (builderData, bpLength) => bpLength > 0;

const isNotRevurderingAndManualOpplysningspliktAp = ({ behandlingType, aksjonspunkter }) => {
  const isRevurdering = bt.REVURDERING === behandlingType.kode;
  const hasAp = aksjonspunkter.some(ap => ap.definisjon.kode === ac.SOKERS_OPPLYSNINGSPLIKT_MANU);
  return !(isRevurdering && !hasAp);
};

const hasSimuleringOn = ({ featureToggleSimulering }) => featureToggleSimulering;
const getStatusFromSimulering = () => vut.OPPFYLT;
/**
 * Rekkefølgen i listene under bestemmer behandlingspunkt-rekkefølgen i GUI.
 * @see BehandlingspunktProperties.Builder for mer informasjon.
 */
const foreldrepengerBuilders = [
  new BehandlingspunktProperties.Builder(bpc.BEHANDLE_INNSYN, 'Innsyn')
    .withAksjonspunktCodes(ac.VURDER_INNSYN),
  new BehandlingspunktProperties.Builder(bpc.SAKSOPPLYSNINGER, 'Saksopplysninger')
    .withAksjonspunktCodes(ac.AVKLAR_PERSONSTATUS),
  new BehandlingspunktProperties.Builder(bpc.KLAGE_NAV_FAMILIE_OG_PENSJON, 'CheckKlageNFP')
    .withAksjonspunktCodes(ac.BEHANDLE_KLAGE_NFP),
  new BehandlingspunktProperties.Builder(bpc.KLAGE_NAV_KLAGEINSTANS, 'CheckKlageNK')
    .withAksjonspunktCodes(ac.BEHANDLE_KLAGE_NK),
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
    .withAksjonspunktCodes(ac.OVERSTYRING_AV_OPPTJENINGSVILKARET),
  new BehandlingspunktProperties.Builder(bpc.BEREGNINGSGRUNNLAG, 'Beregning')
    .withVilkarTypes(vt.BEREGNINGSGRUNNLAGVILKARET)
    .withAksjonspunktCodes(
      ac.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS, ac.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      ac.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE, ac.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      ac.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt, behandlingTypeNotEquals(bt.DOKUMENTINNSYN, bt.KLAGE))
    .withVilkarIsOptional(),
  new BehandlingspunktProperties.Builder(bpc.SOEKNADSFRIST, 'Soknadsfristvilkaret')
    .withAksjonspunktCodes(ac.VURDER_SOKNADSFRIST_FORELDREPENGER),
  new BehandlingspunktProperties.Builder(bpc.UTTAK, 'Uttak')
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt, behandlingTypeNotEquals(bt.KLAGE))
    .withAksjonspunktCodes(
      ac.FASTSETT_UTTAKPERIODER,
      ac.OVERSTYRING_AV_UTTAKPERIODER,
      ac.TILKNYTTET_STORTINGET,
      ac.KONTROLLER_REALITETSBEHANDLING_ELLER_KLAGE,
      ac.KONTROLLER_OPPLYSNINGER_OM_MEDLEMSKAP,
      ac.KONTROLLER_OPPLYSNINGER_OM_FORDELING_AV_STØNADSPERIODEN,
      ac.KONTROLLER_OPPLYSNINGER_OM_DØD,
      ac.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
      ac.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET,
      ac.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT,
    )
    .withStatus(getStatusFromUttakresultat),
  new BehandlingspunktProperties.Builder(bpc.TILKJENT_YTELSE, 'TilkjentYtelse')
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt, behandlingTypeNotEquals(bt.DOKUMENTINNSYN, bt.KLAGE))
    .withStatus(getStatusFromResultatstruktur),
  new BehandlingspunktProperties.Builder(bpc.AVREGNING, 'Avregning')
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt, behandlingTypeNotEquals(bt.KLAGE), hasSimuleringOn)
    .withStatus(getStatusFromSimulering),
  new BehandlingspunktProperties.Builder(bpc.VEDTAK, 'Vedtak')
    .withAksjonspunktCodes(
      ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL, ac.VURDERE_ANNEN_YTELSE,
      ac.VURDERE_DOKUMENT, ac.KONTROLLER_REVURDERINGSBEHANDLING, ac.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withStatus(getVedtakStatus),
];

const createForeldrepengerBpProps = builderData => foreldrepengerBuilders.reduce((currentFbs, fb) => {
  const res = fb.build(builderData, currentFbs.length);
  return res.isVisible ? currentFbs.concat([res]) : currentFbs;
}, []);

export default createForeldrepengerBpProps;
