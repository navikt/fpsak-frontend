import { BehandlingspunktProperties } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes as bpc, featureToggle } from '@fpsak-frontend/fp-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vt from '@fpsak-frontend/kodeverk/src/vilkarType';
import bt from '@fpsak-frontend/kodeverk/src/behandlingType';
import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import getStatusFromSimulering from './simuleringStatusUtleder';
import getVedtakStatus from './vedtakStatusUtleder';

const getStatusFromResultatstruktur = ({ resultatstruktur }) => (resultatstruktur && resultatstruktur.perioder.length > 0 ? vut.OPPFYLT : vut.IKKE_VURDERT);

const behandlingTypeEquals = (...behandlingTypes) => ({ behandlingType }) => behandlingTypes.some((b) => b === behandlingType.kode);
const hasNonDefaultBehandlingspunkt = (builderData, bpLength) => bpLength > 0;

const isNotRevurderingAndManualOpplysningspliktAp = ({ behandlingType, aksjonspunkter }) => {
  const isRevurdering = bt.REVURDERING === behandlingType.kode;
  const hasAp = aksjonspunkter.some((ap) => ap.definisjon.kode === ac.SOKERS_OPPLYSNINGSPLIKT_MANU);
  return !(isRevurdering && !hasAp);
};

const hasLøpendeMedlemskapOn = ({ featureToggles }) => featureToggles[featureToggle.LØPENDE_MEDLESMKAP];
/**
 * Rekkefølgen i listene under bestemmer behandlingspunkt-rekkefølgen i GUI.
 * @see BehandlingspunktProperties.Builder for mer informasjon.
 */
const svangerskapspengerBuilders = [
  new BehandlingspunktProperties.Builder(bpc.SAKSOPPLYSNINGER, 'Saksopplysninger')
    .withAksjonspunktCodes(ac.AVKLAR_PERSONSTATUS),
  new BehandlingspunktProperties.Builder(bpc.OPPLYSNINGSPLIKT, 'Opplysningsplikt')
    .withVilkarTypes(vt.SOKERSOPPLYSNINGSPLIKT)
    .withAksjonspunktCodes(ac.SOKERS_OPPLYSNINGSPLIKT_OVST, ac.SOKERS_OPPLYSNINGSPLIKT_MANU)
    .withDefaultVisibilityWhenCustomFnReturnsTrue(isNotRevurderingAndManualOpplysningspliktAp),
  new BehandlingspunktProperties.Builder(bpc.SVANGERSKAP, 'Svangerskapsvilkaret')
    .withVilkarTypes(vt.SVANGERSKAPVILKARET)
    .withAksjonspunktCodes(
      ac.SVANGERSKAPSVILKARET,
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
      ac.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, ac.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG, ac.VURDER_DEKNINGSGRAD,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withVilkarIsOptional(),
  new BehandlingspunktProperties.Builder(bpc.SOEKNADSFRIST, 'Soknadsfristvilkaret')
    .withAksjonspunktCodes(ac.VURDER_SOKNADSFRIST_FORELDREPENGER),
  new BehandlingspunktProperties.Builder(bpc.FORTSATTMEDLEMSKAP, 'FortsattMedlemskap')
    .withVilkarTypes(vt.MEDLEMSKAPSVILKÅRET_LØPENDE)
    .withAksjonspunktCodes(ac.OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR)
    .withVisibilityWhen(behandlingTypeEquals(bt.REVURDERING), hasLøpendeMedlemskapOn),
  new BehandlingspunktProperties.Builder(bpc.TILKJENT_YTELSE, 'TilkjentYtelse')
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withAksjonspunktCodes(ac.VURDER_TILBAKETREKK)
    .withStatus(getStatusFromResultatstruktur),
  new BehandlingspunktProperties.Builder(bpc.AVREGNING, 'Avregning')
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withAksjonspunktCodes(ac.VURDER_FEILUTBETALING, ac.VURDER_INNTREKK)
    .withStatus(getStatusFromSimulering),
  new BehandlingspunktProperties.Builder(bpc.VEDTAK, 'Vedtak')
    .withAksjonspunktCodes(
      ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL, ac.VURDERE_ANNEN_YTELSE,
      ac.VURDERE_DOKUMENT, ac.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST, ac.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withStatus(getVedtakStatus),
];

const createSvangerskapspengerBpProps = (builderData) => svangerskapspengerBuilders.reduce((currentFbs, fb) => {
  const res = fb.build(builderData, currentFbs.length);
  return res.isVisible ? currentFbs.concat([res]) : currentFbs;
}, []);

export default createSvangerskapspengerBpProps;
