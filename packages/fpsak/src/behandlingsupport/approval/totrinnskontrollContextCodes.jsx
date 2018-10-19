import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import vilkarType from 'kodeverk/vilkarType';
import skjermlenkeCodes from 'kodeverk/skjermlenkeCodes';

const totrinnskontrollContextCodes = [
  {
    ...skjermlenkeCodes.KLAGE_BEH_NFP,
    vilkar: [],
    aksjonspunkter: [aksjonspunktCodes.BEHANDLE_KLAGE_NFP],
    behandlingspunkt: behandlingspunktCodes.KLAGE_NAV_FAMILIE_OG_PENSJON,
  },
  {
    ...skjermlenkeCodes.KLAGE_BEH_NK,
    vilkar: [],
    aksjonspunkter: [aksjonspunktCodes.BEHANDLE_KLAGE_NK],
    behandlingspunkt: behandlingspunktCodes.KLAGE_NAV_KLAGEINSTANS,
  },
  {
    ...skjermlenkeCodes.BEREGNING_ENGANGSSTOENAD,
    vilkar: [],
    aksjonspunkter: [aksjonspunktCodes.OVERSTYR_BEREGNING],
    behandlingspunkt: behandlingspunktCodes.BEREGNING,
  },
  {
    ...skjermlenkeCodes.BEREGNING_FORELDREPENGER,
    vilkar: [vilkarType.BEREGNINGSGRUNNLAGVILKARET],
    aksjonspunkter: [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
      aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
      aksjonspunktCodes.OVERSTYR_BEREGNING],
    behandlingspunkt: behandlingspunktCodes.BEREGNINGSGRUNNLAG,
  },
  {
    ...skjermlenkeCodes.ADOPSJON,
    vilkar: [vilkarType.ADOPSJONSVILKARET, vilkarType.ADOPSJONSVILKARET_FORELDREPENGER],
    aksjonspunkter: [aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
      aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN,
      aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE,
      aksjonspunktCodes.OVERSTYR_ADOPSJONSVILKAR,
      aksjonspunktCodes.OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP],
    behandlingspunkt: behandlingspunktCodes.ADOPSJON,
  },
  {
    ...skjermlenkeCodes.SOEKNADSFRIST,
    vilkar: [vilkarType.SOKNADFRISTVILKARET],
    aksjonspunkter: [aksjonspunktCodes.SOKNADSFRISTVILKARET,
      aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
      aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER],
    behandlingspunkt: behandlingspunktCodes.SOEKNADSFRIST,
  },
  {
    ...skjermlenkeCodes.FOEDSEL,
    vilkar: [vilkarType.FODSELSVILKARET_MOR,
      vilkarType.FODSELSVILKARET_FAR],
    aksjonspunkter: [aksjonspunktCodes.AUTO_VENT_PÅ_FODSELREGISTRERING,
      aksjonspunktCodes.TERMINBEKREFTELSE,
      aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
      aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      aksjonspunktCodes.OVERSTYR_FODSELSVILKAR,
      aksjonspunktCodes.OVERSTYR_FODSELSVILKAR_FAR_MEDMOR],
    behandlingspunkt: behandlingspunktCodes.FOEDSEL,
  },
  {
    ...skjermlenkeCodes.MEDLEMSKAP,
    vilkar: [vilkarType.MEDLEMSKAPSVILKARET],
    aksjonspunkter: [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
      aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
      aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
      aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
      aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR],
    behandlingspunkt: behandlingspunktCodes.MEDLEMSKAP,
  },
  {
    ...skjermlenkeCodes.OMSORG,
    vilkar: [vilkarType.OMSORGSVILKARET],
    aksjonspunkter: [aksjonspunktCodes.OMSORGSOVERTAKELSE,
      aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET,
      aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN],
    behandlingspunkt: behandlingspunktCodes.OMSORG,
  },
  {
    ...skjermlenkeCodes.FORELDREANSVAR,
    vilkar: [vilkarType.FORELDREANSVARSVILKARET_2_LEDD,
      vilkarType.FORELDREANSVARSVILKARET_4_LEDD],
    aksjonspunkter: [aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD,
      aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD,
      aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN],
    behandlingspunkt: behandlingspunktCodes.FORELDREANSVAR,
  },
  {
    ...skjermlenkeCodes.FAKTA_FOR_OPPTJENING,
    vilkar: [vilkarType.OPPTJENINGSVILKARET],
    aksjonspunkter: [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING],
    behandlingspunkt: behandlingspunktCodes.OPPTJENING,
  },
  {
    ...skjermlenkeCodes.VEDTAK,
    aksjonspunkter: [aksjonspunktCodes.FORESLA_VEDTAK],
    behandlingspunkt: behandlingspunktCodes.VEDTAK,
  },
];

export default totrinnskontrollContextCodes;
