import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const totrinnskontrollaksjonspunktTextCodes = {
  [aksjonspunktCodes.ADOPSJONSDOKUMENTAJON]: 'ToTrinnsForm.Adopsjon.KontrollerOpplysninger',
  [aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN]: 'ToTrinnsForm.Adopsjon.VurderEktefellesBarn',
  [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE]: 'ToTrinnsForm.Adopsjon.VurderMannAdoptererAlene',
  [aksjonspunktCodes.OVERSTYR_ADOPSJONSVILKAR]: 'ToTrinnsForm.Adopsjon.VilkarOverstyrt',
  [aksjonspunktCodes.OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP]: 'ToTrinnsForm.Adopsjon.VilkarOverstyrt',

  [aksjonspunktCodes.OMSORGSOVERTAKELSE]: 'ToTrinnsForm.Omsorgovertagelse.KontrollerOpplysninger',
  [aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET]:
    'ToTrinnsForm.Omsorgovertagelse.VurderVilkarForeldreansvarTredjeLedd',
  // 5032: 'TrinnsForm.Omsorgovertagelse.VurderTidligereUtbetaling',

  [aksjonspunktCodes.AUTO_VENT_PÅ_FODSELREGISTRERING]: 'ToTrinnsForm.Fødsel.VurderSokersRelasjon',
  [aksjonspunktCodes.TERMINBEKREFTELSE]: 'ToTrinnsForm.Fødsel.KontrollerOpplysningerTermin',
  [aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL]: 'ToTrinnsForm.Fødsel.SjekkManglendeFødsel',
  [aksjonspunktCodes.OVERSTYR_FODSELSVILKAR]: 'ToTrinnsForm.Fødsel.VilkarOverstyrt',
  [aksjonspunktCodes.OVERSTYR_FODSELSVILKAR_FAR_MEDMOR]: 'ToTrinnsForm.Fødsel.VilkarOverstyrt',

  [aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD]:
    'ToTrinnsForm.Foreldreansvar.VurderVilkarForeldreansvarFjerdeLedd',
  [aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN]: 'ToTrinnsForm.Foreldreansvar.VurderTidligereUtbetaling',

  [aksjonspunktCodes.AVKLAR_AKTIVITETER]: 'ToTrinnsForm.Beregning.AvklarAktiviteter',
  [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER]: 'ToTrinnsForm.Beregning.OverstyrtBeregningsaktiviteter',
  [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG]: 'ToTrinnsForm.Beregning.OverstyrtBeregningsgrunnlag',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS]: 'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE]:
    'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.OVERSTYR_BEREGNING]: 'ToTrinnsForm.Beregning.VilkarOverstyrt',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD]:
    'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET]: 'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG]: 'ToTrinnsForm.Beregning.GraderingUtenBG',
  [aksjonspunktCodes.VURDER_DEKNINGSGRAD]: 'ToTrinnsForm.Beregning.DekningsgradEndret',
  [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG]: 'ToTrinnsForm.Beregning.FastsettFordeltBeregningsgrunnlag',

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
  [aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO]: 'ToTrinnsForm.Medlemskap.OverstyrtStartdato',

  [aksjonspunktCodes.FORESLA_VEDTAK]: 'ToTrinnsForm.Vedtak.Fritekstbrev',
  [aksjonspunktCodes.FORESLA_VEDTAK_MANUELT]: 'ToTrinnsForm.Vedtak.Fritekstbrev',

  [aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO]: 'TotrinnsForm.Uttak.AvklarManglendeUttaksperiode',
  [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG]: 'ToTrinnsForm.Omsorg.VurderOmsorg',
  [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG]: 'ToTrinnsForm.Aleneomsorg.VurderAleneomsorg',

  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_DØD]: 'ToTrinnsForm.Uttak.Dod',
  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST]: 'ToTrinnsForm.Uttak.Soknadsfrist',
  [aksjonspunktCodes.KONTROLLER_REALITETSBEHANDLING_ELLER_KLAGE]: 'ToTrinnsForm.Uttak.Klage',
  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_FORDELING_AV_STØNADSPERIODEN]:
    'ToTrinnsForm.Uttak.FordelingStonadsperioder',
  [aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET]: 'ToTrinnsForm.Uttak.TilstotendeYtelser.Innvilget',
  [aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT]: 'ToTrinnsForm.Uttak.TilstotendeYtelser.Opphort',
  [aksjonspunktCodes.TILKNYTTET_STORTINGET]: 'ToTrinnsForm.Uttak.Stortinget',
  [aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK]: 'ToTrinnsForm.Uttak.Overstyrt',

  [aksjonspunktCodes.VURDER_TILBAKETREKK]: 'ToTrinnsForm.TilkjentYtelse.Tilbaketrekk',

  [aksjonspunktCodes.VURDER_FARESIGNALER]: 'ToTrinnsForm.Faresignaler.Vurder',

  [aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET]: 'ToTrinnsForm.Opptjening.VurderOpptjeningsvilkåret',

  [aksjonspunktCodes.VURDER_REFUSJON_BERGRUNN]: 'ToTrinnsForm.Beregningsgrunnlag.Refusjonsstart',

};

export const totrinnsTilbakekrevingkontrollaksjonspunktTextCodes = {};

export default totrinnskontrollaksjonspunktTextCodes;
