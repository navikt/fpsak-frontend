import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';

const aksjonspunktTextCodes = {
  [aksjonspunktCodes.ADOPSJONSDOKUMENTAJON]: 'ToTrinnsForm.Adopsjon.KontrollerOpplysninger',
  [aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN]: 'ToTrinnsForm.Adopsjon.VurderEktefellesBarn',
  [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE]: 'ToTrinnsForm.Adopsjon.VurderMannAdoptererAlene',
  [aksjonspunktCodes.OVERSTYR_ADOPSJONSVILKAR]: 'ToTrinnsForm.Adopsjon.VilkarOverstyrt',
  [aksjonspunktCodes.OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP]: 'ToTrinnsForm.Adopsjon.VilkarOverstyrt',

  [aksjonspunktCodes.OMSORGSOVERTAKELSE]: 'ToTrinnsForm.Omsorgovertagelse.KontrollerOpplysninger',
  [aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET]: 'ToTrinnsForm.Omsorgovertagelse.VurderVilkarForeldreansvarTredjeLedd',
  // 5032: 'TrinnsForm.Omsorgovertagelse.VurderTidligereUtbetaling',

  [aksjonspunktCodes.AUTO_VENT_PÅ_FODSELREGISTRERING]: 'ToTrinnsForm.Fødsel.VurderSokersRelasjon',
  [aksjonspunktCodes.TERMINBEKREFTELSE]: 'ToTrinnsForm.Fødsel.KontrollerOpplysningerTermin',
  [aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL]: 'ToTrinnsForm.Fødsel.SjekkManglendeFødsel',
  [aksjonspunktCodes.OVERSTYR_FODSELSVILKAR]: 'ToTrinnsForm.Fødsel.VilkarOverstyrt',
  [aksjonspunktCodes.OVERSTYR_FODSELSVILKAR_FAR_MEDMOR]: 'ToTrinnsForm.Fødsel.VilkarOverstyrt',

  [aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD]: 'ToTrinnsForm.Foreldreansvar.VurderVilkarForeldreansvarFjerdeLedd',
  [aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN]: 'ToTrinnsForm.Foreldreansvar.VurderTidligereUtbetaling',

  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS]: 'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE]: 'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.OVERSTYR_BEREGNING]: 'ToTrinnsForm.Beregning.VilkarOverstyrt',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD]: 'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET]: 'ToTrinnsForm.Beregning.InntektFastsatt',

  [aksjonspunktCodes.SOKNADSFRISTVILKARET]: 'ToTrinnsForm.Soknadsfrist.ManueltVurdert',
  [aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER]: 'ToTrinnsForm.Soknadsfrist.ManueltVurdert',
  [aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR]: 'ToTrinnsForm.Soknadsfrist.VilkarOverstyrt',

  [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN]: 'ToTrinnsForm.Medlemskap.FastsettStartdato',
  [aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE]: 'ToTrinnsForm.Medlemskap.VurderGyldigMedlemskap',
  [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD]: 'ToTrinnsForm.Medlemskap.AvklarLovligOpphold',
  [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]: 'ToTrinnsForm.Medlemskap.VurderSokerBosatt',
  [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT]: 'ToTrinnsForm.Medlemskap.AvklarOppholdsrett',
  [aksjonspunktCodes.AVKLAR_PERSONSTATUS]: 'ToTrinnsForm.Medlemskap.VurderPersonStatus',
  [aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR]: 'ToTrinnsForm.Medlemskap.VilkarOverstyrt',

  [aksjonspunktCodes.FORESLA_VEDTAK]: 'ToTrinnsForm.Vedtak.Fritekstbrev',

  [aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO]: 'TotrinnsForm.Uttak.AvklarManglendeUttaksperiode',

};

export default aksjonspunktTextCodes;
