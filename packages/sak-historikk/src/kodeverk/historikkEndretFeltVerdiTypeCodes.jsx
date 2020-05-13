// @TODO kodeverk_i_frontend
const historikkEndretFeltVerdiTypeCodes = {
  ABNR: {
    kode: 'ABNR',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusABNR',
  },
  ADNR: {
    kode: 'ADNR',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusADNR',
  },
  ADOPTERER_ALENE: {
    kode: 'ADOPTERER_ALENE',
    verdiId: 'HistorikkEndretFeltVerdiType.AdoptererAlene',
  },
  ADOPTERER_IKKE_ALENE: {
    kode: 'ADOPTERER_IKKE_ALENE',
    verdiId: 'HistorikkEndretFeltVerdiType.AdoptererIkkeAlene',
  },
  ARBEIDSAVKLARINGSPENGER: {
    kode: 'ARBEIDSAVKLARINGSPENGER',
    verdiId: 'HistorikkEndretFeltVerdiType.Arbeidsavklaringspenger',
  },
  ARBEIDSTAKER: {
    kode: 'ARBEIDSTAKER',
    verdiId: 'HistorikkEndretFeltVerdiType.Arbeidstaker',
  },
  BENYTT: {
    kode: 'BENYTT',
    verdiId: 'HistorikkEndretFeltVerdiType.Benytt',
  },
  BOSA: {
    kode: 'BOSA',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusBOSA',
  },
  BOSATT_I_NORGE: {
    kode: 'BOSATT_I_NORGE',
    verdiId: 'HistorikkEndretFeltVerdiType.BosattINorge',
  },
  DAGMAMMA: {
    kode: 'DAGMAMMA',
    verdiId: 'HistorikkEndretFeltVerdiType.Dagmamma',
  },
  DAGPENGER: {
    kode: 'DAGPENGER',
    verdiId: 'HistorikkEndretFeltVerdiType.Dagpenger',
  },
  DØD: {
    kode: 'DØD',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusDØD',
  },
  EKTEFELLES_BARN: {
    kode: 'EKTEFELLES_BARN',
    verdiId: 'HistorikkEndretFeltVerdiType.EktefellesBarn',
  },
  FISKER: {
    kode: 'FISKER',
    verdiId: 'HistorikkEndretFeltVerdiType.Fisker',
  },
  FORELDREANSVAR_2_TITTEL: {
    kode: 'FORELDREANSVAR_2_TITTEL',
    verdiId: 'HistorikkEndretFeltVerdiType.Foreldreansvar2Tittel',
  },
  FORELDREANSVAR_4_TITTEL: {
    kode: 'FORELDREANSVAR_4_TITTEL',
    verdiId: 'HistorikkEndretFeltVerdiType.Foreldreansvar4Tittel',
  },
  FOSV: {
    kode: 'FOSV',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusFOSV',
  },
  FRILANSER: {
    kode: 'FRILANSER',
    verdiId: 'HistorikkEndretFeltVerdiType.Frilanser',
  },
  FØDR: {
    kode: 'FØDR',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusFØDR',
  },
  FORTSETT_BEHANDLING: {
    kode: 'FORTSETT_BEHANDLING',
    verdiId: 'HistorikkEndretFeltVerdiType.FortsettBehandling',
  },
  HENLEGG_BEHANDLING: {
    kode: 'HENLEGG_BEHANDLING',
    verdiId: 'HistorikkEndretFeltVerdiType.HenleggBehandling',
  },
  IKKE_BENYTT: {
    kode: 'IKKE_BENYTT',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeBenytt',
  },
  IKKE_BOSATT_I_NORGE: {
    kode: 'IKKE_BOSATT_I_NORGE',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeBosattINorge',
  },
  IKKE_EKTEFELLES_BARN: {
    kode: 'IKKE_EKTEFELLES_BARN',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeEktefellesBarn',
  },
  IKKE_LOVLIG_OPPHOLD: {
    kode: 'IKKE_LOVLIG_OPPHOLD',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeLovligOpphold',
  },
  IKKE_OPPFYLT: {
    kode: 'IKKE_OPPFYLT',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeOppfylt',
  },
  IKKE_OPPHOLDSRETT: {
    kode: 'IKKE_OPPHOLDSRETT',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeOppholdsrett',
  },
  IKKE_RELEVANT: {
    kode: 'IKKE_RELEVANT',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeRelevantPeriode',
  },
  INGEN_INNTEKTSKATEGORI: {
    kode: '-',
    verdiId: 'HistorikkEndretFeltVerdiType.IngenInntektskategori',
  },
  INGEN_VARIG_ENDRING_NAERING: {
    kode: 'INGEN_VARIG_ENDRING_NAERING',
    verdiId: 'HistorikkEndretFeltVerdiType.IngenVarigEndringNaering',
  },
  JORDBRUKER: {
    kode: 'JORDBRUKER',
    verdiId: 'HistorikkEndretFeltVerdiType.Jordbruker',
  },
  LOVLIG_OPPHOLD: {
    kode: 'LOVLIG_OPPHOLD',
    verdiId: 'HistorikkEndretFeltVerdiType.LovligOpphold',
  },
  OMSORGSVILKARET_TITTEL: {
    kode: 'OMSORGSVILKARET_TITTEL',
    verdiId: 'HistorikkEndretFeltVerdiType.OmsorgsvilkaretTittel',
  },
  OPPFYLT: {
    kode: 'OPPFYLT',
    verdiId: 'HistorikkEndretFeltVerdiType.Oppfylt',
  },
  OPPHOLDSRETT: {
    kode: 'OPPHOLDSRETT',
    verdiId: 'HistorikkEndretFeltVerdiType.Oppholdsrett',
  },
  MEDLEM: {
    kode: 'MEDLEM',
    verdiId: 'HistorikkEndretFeltVerdiType.PeriodeMedlem',
  },
  SELVSTENDIG_NÆRINGSDRIVENDE: {
    kode: 'SELVSTENDIG_NÆRINGSDRIVENDE',
    verdiId: 'HistorikkEndretFeltVerdiType.SelvstendigNæringsdrivende',
  },
  SJØMANN: {
    kode: 'SJØMANN',
    verdiId: 'HistorikkEndretFeltVerdiType.Sjømann',
  },
  TILBAKEKR_INFOTRYGD: {
    kode: 'TILBAKEKR_INFOTRYGD',
    verdiId: 'HistorikkEndretFeltVerdiType.tilbakekrInfotrygd',
  },
  TILBAKEKR_IGNORER: {
    kode: 'TILBAKEKR_IGNORER',
    verdiId: 'HistorikkEndretFeltVerdiType.tilbakekrIgnorer',
  },
  ANNEN_FORELDER_HAR_IKKE_RETT: {
    kode: 'ANNEN_FORELDER_HAR_IKKE_RETT',
    verdiId: 'HistorikkEndretFeltVerdiType.AnnenforelderHarIkkeRett',
  },
  ANNEN_FORELDER_HAR_RETT: {
    kode: 'ANNEN_FORELDER_HAR_RETT',
    verdiId: 'HistorikkEndretFeltVerdiType.AnnenforelderHarRett',
  },
  ARBEIDSTAKER_UTEN_FERIEPENGER: {
    kode: 'ARBEIDSTAKER_UTEN_FERIEPENGER',
    verdiId: 'HistorikkEndretFeltVerdiType.ArbeidstakerUtenFeriepenger',
  },
  UFUL: {
    kode: 'UFUL',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusUFUL',
  },
  UNNTAK: {
    kode: 'UNNTAK',
    verdiId: 'HistorikkEndretFeltVerdiType.PeriodeUnntak',
  },
  UREG: {
    kode: 'UREG',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusUREG',
  },
  UTAN: {
    kode: 'UTAN',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusUTAN',
  },
  UTPE: {
    kode: 'UTPE',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusUTPE',
  },
  UTVA: {
    kode: 'UTVA',
    verdiId: 'HistorikkEndretFeltVerdiType.PersonstatusUTVA',
  },
  VARIG_ENDRET_NAERING: {
    kode: 'VARIG_ENDRET_NAERING',
    verdiId: 'HistorikkEndretFeltVerdiType.VarigEndretNaering',
  },
  VILKAR_IKKE_OPPFYLT: {
    kode: 'VILKAR_IKKE_OPPFYLT',
    verdiId: 'HistorikkEndretFeltVerdiType.VilkarIkkeOppfylt',
  },
  VILKAR_OPPFYLT: {
    kode: 'VILKAR_OPPFYLT',
    verdiId: 'HistorikkEndretFeltVerdiType.VilkarOppfylt',
  },
  OMSORG_FOR_BARNET: {
    kode: 'OMSORG_FOR_BARNET',
    verdiId: 'HistorikkEndretFeltVerdiType.OmsorgForBarnet',
  },
  IKKE_OMSORG_FOR_BARNET: {
    kode: 'IKKE_OMSORG_FOR_BARNET',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeOmsorgForBarnet',
  },
  ALENEOMSORG: {
    kode: 'ALENEOMSORG',
    verdiId: 'HistorikkEndretFeltVerdiType.Aleneomsorg',
  },
  IKKE_ALENEOMSORG: {
    kode: 'IKKE_ALENEOMSORG',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeAleneomsorg',
  },
  HAR_GYLDIG_GRUNN: {
    kode: 'HAR_GYLDIG_GRUNN',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigGrunn',
  },
  HAR_IKKE_GYLDIG_GRUNN: {
    kode: 'HAR_IKKE_GYLDIG_GRUNN',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeGyldigGrunn',
  },
  FASTSETT_RESULTAT_GRADERING_AVKLARES: {
    kode: 'FASTSETT_RESULTAT_GRADERING_AVKLARES',
    verdiId: 'HistorikkEndretFeltVerdiType.ResultatGraderingAvklares',
  },
  FASTSETT_RESULTAT_UTSETTELSE_AVKLARES: {
    kode: 'FASTSETT_RESULTAT_UTSETTELSE_AVKLARES',
    verdiId: 'HistorikkEndretFeltVerdiType.ResultatUtsettelseAvklares',
  },
  FASTSETT_RESULTAT_PERIODEN_AVKLARES_IKKE: {
    kode: 'FASTSETT_RESULTAT_PERIODEN_AVKLARES_IKKE',
    verdiId: 'HistorikkEndretFeltVerdiType.ResultatAvklaresIkke',
  },
  FASTSETT_RESULTAT_PERIODEN_SYKDOM_DOKUMENTERT_IKKE: {
    kode: 'FASTSETT_RESULTAT_PERIODEN_SYKDOM_DOKUMENTERT_IKKE',
    verdiId: 'HistorikkEndretFeltVerdiType.SykdommenDokumentertIkke',
  },
  FASTSETT_RESULTAT_PERIODEN_INNLEGGELSEN_DOKUMENTERT_IKKE: {
    kode: 'FASTSETT_RESULTAT_PERIODEN_INNLEGGELSEN_DOKUMENTERT_IKKE',
    verdiId: 'HistorikkEndretFeltVerdiType.InnleggelsenDokumentertIkke',
  },
  FASTSETT_RESULTAT_PERIODEN_SYKDOM_DOKUMENTERT: {
    kode: 'FASTSETT_RESULTAT_PERIODEN_SYKDOM_DOKUMENTERT',
    verdiId: 'HistorikkEndretFeltVerdiType.SykdommenDokumentert',
  },
  FASTSETT_RESULTAT_PERIODEN_INNLEGGELSEN_DOKUMENTERT: {
    kode: 'FASTSETT_RESULTAT_PERIODEN_INNLEGGELSEN_DOKUMENTERT',
    verdiId: 'HistorikkEndretFeltVerdiType.InnleggelsenDokumentert',
  },
  FASTSETT_RESULTAT_PERIODEN_HV_DOKUMENTERT: {
    kode: 'FASTSETT_RESULTAT_PERIODEN_HV_DOKUMENTERT',
    verdiId: 'HistorikkEndretFeltVerdiType.HVDokumentert',
  },
  FASTSETT_RESULTAT_PERIODEN_NAV_TILTAK_DOKUMENTERT: {
    kode: 'FASTSETT_RESULTAT_PERIODEN_NAV_TILTAK_DOKUMENTERT',
    verdiId: 'HistorikkEndretFeltVerdiType.NAVTiltakDokumentert',
  },
  FASTSETT_RESULTAT_PERIODEN_HV_DOKUMENTERT_IKKE: {
    kode: 'FASTSETT_RESULTAT_PERIODEN_HV_DOKUMENTERT_IKKE',
    verdiId: 'HistorikkEndretFeltVerdiType.HVDokumentertIkke',
  },
  FASTSETT_RESULTAT_PERIODEN_NAV_TILTAK_DOKUMENTERT_IKKE: {
    kode: 'FASTSETT_RESULTAT_PERIODEN_NAV_TILTAK_DOKUMENTERT_IKKE',
    verdiId: 'HistorikkEndretFeltVerdiType.NAVTiltakDokumentertIkke',
  },
  FASTSETT_RESULTAT_ENDRE_SOEKNADSPERIODEN: {
    kode: 'FASTSETT_RESULTAT_ENDRE_SOEKNADSPERIODEN',
    verdiId: 'HistorikkEndretFeltVerdiType.EndreSoeknadsperioden',
  },
  TIDSBEGRENSET_ARBEIDSFORHOLD: {
    kode: 'TIDSBEGRENSET_ARBEIDSFORHOLD',
    verdiId: 'HistorikkEndretFeltVerdiType.TidsbegrensetArbeidsforhold',
  },
  IKKE_TIDSBEGRENSET_ARBEIDSFORHOLD: {
    kode: 'IKKE_TIDSBEGRENSET_ARBEIDSFORHOLD',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeTidsbegrensetArbeidsforhold',
  },
  NY_I_ARBEIDSLIVET: {
    kode: 'NY_I_ARBEIDSLIVET',
    verdiId: 'HistorikkEndretFeltVerdiType.NyIArbeidslivet',
  },
  IKKE_NY_I_ARBEIDSLIVET: {
    kode: 'IKKE_NY_I_ARBEIDSLIVET',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeNyIArbeidslivet',
  },
  NYOPPSTARTET: {
    kode: 'NYOPPSTARTET',
    verdiId: 'HistorikkEndretFeltVerdiType.Nyoppstartet',
  },
  IKKE_NYOPPSTARTET: {
    kode: 'IKKE_NYOPPSTARTET',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeNyoppstartet',
  },
  IKKE_DOKUMENTERT: {
    kode: 'IKKE_DOKUMENTERT',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeDokumentert',
  },
  DOKUMENTERT: {
    kode: 'DOKUMENTERT',
    verdiId: 'HistorikkEndretFeltVerdiType.Dokumentert',
  },

  IKKE_FASTSATT: {
    kode: 'IKKE_FASTSATT',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeFastsatt',
  },
  INNVILGET: {
    kode: 'INNVILGET',
    verdiId: 'HistorikkEndretFeltVerdiType.Innvilget',
  },
  AVSLÅTT: {
    kode: 'AVSLÅTT',
    verdiId: 'HistorikkEndretFeltVerdiType.Avslått',
  },
  MANUELL_BEHANDLING: {
    kode: 'MANUELL_BEHANDLING',
    verdiId: 'HistorikkEndretFelt.ManuellBehandling',
  },
  '-': {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ingenAvslagÅrsak',
  },
  4002: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ingeStonadsDagarIgjen',
  },
  4005: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.hullMellomStønadsperioder',
  },
  4011: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.farForTidligSoktPeriode',
  },
  4020: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.bruddPaSoknadsfrist',
  },
  4022: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.barnOverTreÅr',
  },
  4012: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.farHarIkkeOmsorg',
  },
  4003: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.morHarIkkeOmsorg',
  },
  4001: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.mødrekvoteFørTerminFodsel',
  },
  4013: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.morSokerFellesPeriodeFørTolvUker',
  },
  4018: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.soktUttakForOmsorgsovertakelse',
  },
  4010: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.farSøkerFørTerminFodsel',
  },
  4060: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.samtidligUttakIkkeGyldigKombinasjon',
  },
  4014: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.morSokerFellesPeriodeFørUkeSyv',
  },
  4007: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.andrePartSykSkadetIkkeOppfylt',
  },
  4008: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.andrePartInnleggelseIkkeOppfylt',
  },
  4033: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ikkeLovbestemtFerie',
  },
  4032: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ferieSelvstendigNæringsdrivandeFrilanser',
  },
  4037: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ikkeHeltidsArbeid',
  },
  4038: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.søkersSkadeSykdomIkkeOppfylt',
  },
  4039: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.søkerInleggelseIkkeOppfylt',
  },
  4040: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.barnetsInleggelseIkkeOppfylt',
  },
  4031: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ferieInnenforDeFørsteSeksUkerne',
  },
  4034: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ingenStønadsdagarIgjen',
  },
  4035: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.farAlenaomsorgMorFyllesIkkeAktivitetskravet',
  },
  4030: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.utsettelseFørTerminFødsel',
  },
  4041: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.utsettelseFeriePåBevegeligHelligdag',
  },
  4050: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetArbeidIkkeOppfylt',
  },
  4051: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetOffentligGodkjentUtdanning',
  },
  4052: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetOffentligGodkjentUtdanningIKombinasjonMedArbeid',
  },
  4053: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetMorsSkadeSykdom',
  },
  4054: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetMorsInleggelse',
  },
  4055: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetMorsDeltakelseIntro',
  },
  4056: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.unntakForAktivitetskravetMorsDeltakelseKvalifisering',
  },
  4057: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.unntakForAktivitetskravetMorsMottakAvUføretrygd',
  },
  4058: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.unntakForAktivitetskravetStebarnsadopsjon',
  },
  4059: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.unntakForAktivitetskravetFlerBarnsfødsel',
  },
  4006: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.påkrevdStønadsperiodeMangler',
  },
  4015: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.morSøkerFFFødselTidlig',
  },
  4017: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.farEllerMedmorSøkerFFFødsel',
  },
  4061: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UtsettelseIkkeDokumentert',
  },
  4081: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagUtsettelseFerieTilbakeTid',
  },
  4082: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagUtsettelseArbeidTilbakeTid',
  },
  4062: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UtsettelseArbIkkeDok',
  },
  4063: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UtsettelseSykdomIkkeDok',
  },
  4064: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UtsettelseInnleggelseIkkeDok',
  },
  4065: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UtsettelseBarnetsInnleggelseIkkeDok',
  },
  4072: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.BarnetErDødt',
  },
  4071: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravIntroprogramIkkeDok',
  },
  4070: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravInleggelseIkkeDok',
  },
  4069: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravSykdomIkkeDok',
  },
  4068: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravArbeidUtdanningIkkeDok',
  },
  4067: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravUtdanningIkkeDok',
  },
  4066: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravArbeidIkkeDok',
  },
  4074: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagOverforingKvoteSykdomIkkeDok',
  },
  4077: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.FratrekkPleiepenger',
  },
  4073: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.IkkeRettTilKvoteFordiMorIkkeHarRettForeldrepenger',
  },
  4086: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AnnenPartOverlappendeUttaksperioder',
  },
  4085: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.IkkeSamtykkeMellomPartene',
  },
  4084: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AnnenPartOverlappendeUttakSamtidigUttak',
  },
  4080: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.IkkeGraderingForSenSoknad',
  },
  4019: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingForTermin',
  },
  4504: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingForUke7',
  },
  4519: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingForTermin',
  },
  4025: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingArbeidOver100',
  },
  4023: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ArbeiderIUtaksperiodenMerEnn0',
  },
  4088: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravIntroprogramIkkeDok',
  },
  4089: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravKVPIkkeDok',
  },
  4090: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.hullMellomSøknadsperioderEtterSisteUttak',
  },
  4091: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.hullMellomSøknadsperioderEtterSisteUtsettelse',
  },
  4092: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagOverforingIkkeAleneomsorg',
  },
  4093: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingSøkerErIkkeIArbeid',
  },
  4094: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingsavtaleManglerIkkeDok',
  },
  4095: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagMorTarIkkeAlleUker',
  },
  4502: {
    kode: 'UTTAK_PERIODE_GRADERING_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingsavtaleManglerIkkeDok',
  },
  4501: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.IkkeGraderingForSenSoknad',
  },
  4087: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.medlemskapvilkarOpphor',
  },
  4096: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.fodselsvilkarOpphor',
  },
  4097: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.adopsjonsvilkarOpphor',
  },
  4098: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.foreldreansvarvilkarOpphor',
  },
  4099: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.opptjeningsvilkarOpphor',
  },
  4100: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UttakForOmsorgovertakelse',
  },
  MØDREKVOTE: {
    kode: 'MØDREKVOTE',
    verdiId: 'HistorikkEndretFeltVerdiType.Modrekvote',
  },
  FEDREKVOTE: {
    kode: 'FEDREKVOTE',
    verdiId: 'HistorikkEndretFeltVerdiType.Fedrekvote',
  },
  FELLESPERIODE: {
    kode: 'FELLESPERIODE',
    verdiId: 'HistorikkEndretFeltVerdiType.Fellesperiode',
  },
  FORELDREPENGER: {
    kode: 'FORELDREPENGER',
    verdiId: 'HistorikkEndretFeltVerdiType.Foreldrepenger',
  },
  FORELDREPENGER_FØR_FØDSEL: {
    kode: 'FORELDREPENGER_FØR_FØDSEL',
    verdiId: 'HistorikkEndretFeltVerdiType.ForeldrepengerForFodsel',
  },
  2001: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UttakInnvilget',
  },
  2010: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigUtsettelsePgaFerie',
  },
  2011: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigUtsettelsePgaArbeid',
  },
  2012: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigUtsettelsePgaInnleggelse',
  },
  2013: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigUtsettelsePgaBarnInnlagt',
  },
  2014: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigUtsettelsePgaSykdom',
  },
  2020: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.OverforingOppfyltAnnePartIkkeRett',
  },
  2023: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.OverforingOppfyltAleneomsorg',
  },
  2037: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFellesperiodeTilFar',
  },
  2038: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.RedusertUttaksgradPgaAndreForeldresUttak',
  },
  2022: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.OverforingOppfyltAnnenPartInnlagt',
  },
  2021: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.OverforingOppfyltAnnePartHjelp',
  },
  2003: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetUttakKvote',
  },
  2002: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFellesEllerFP',
  },
  2004: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFPKunFarHarRett',
  },
  2005: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFPVedAleneomsorg',
  },
  2006: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFPFF',
  },
  2007: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFPKunMorHarRett',
  },
  2015: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtsetFerieKunFarHarRett',
  },
  2016: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtsetArbeidKunFarHarRett',
  },
  2017: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtsetSykdomSkadeKunFarHarRett',
  },
  2018: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtsetInnleggelseKunFarHarRett',
  },
  2019: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtsetBarnetsInnleggelseKunFarHarRett',
  },
  2030: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingFellesEllerFP',
  },
  2031: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingKvote',
  },
  2032: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingFPAleneomsorg',
  },
  2033: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingFPKunFarRett',
  },
  2034: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingFPMorFarRett',
  },
  2036: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.KunFarHarRettOgMorErUfor',
  },
  VERGE: {
    kode: 'VERGE',
    verdiId: 'HistorikkEndretFeltVerdiType.VergeFullmektig',
  },
  SOEKER: {
    kode: 'SOEKER',
    verdiId: 'HistorikkEndretFeltVerdiType.Soker',
  },
  ADVOKAT: {
    kode: 'ADVOKAT',
    verdiId: 'HistorikkEndretFeltVerdiType.VergeAdvokat',
  },
  ANNEN_F: {
    kode: 'ANNEN_F',
    verdiId: 'HistorikkEndretFeltVerdiType.VergeAnnenF',
  },
  BEGGE: {
    kode: 'BEGGE',
    verdiId: 'HistorikkEndretFeltVerdiType.VergeBrevMottakerBegge',
  },
  BARN: {
    kode: 'BARN',
    verdiId: 'HistorikkEndretFeltVerdiType.VergeBarn',
  },
  FBARN: {
    kode: 'FBARN',
    verdiId: 'HistorikkEndretFeltVerdiType.VergeFBarn',
  },
  VOKSEN: {
    kode: 'VOKSEN',
    verdiId: 'HistorikkEndretFeltVerdiType.VergeVoksen',
  },
  GRADERING_OPPFYLT: {
    kode: 'GRADERING_OPPFYLT',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingOppfylt',
  },
  GRADERING_IKKE_OPPFYLT: {
    kode: 'GRADERING_IKKE_OPPFYLT',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingIkkeOppfylt',
  },
  GRADERING_PÅ_ANDEL_UTEN_BG_IKKE_SATT_PÅ_VENT: {
    kode: 'GRADERING_PÅ_ANDEL_UTEN_BG_IKKE_SATT_PÅ_VENT',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingPåAndelUtenBGIkkeSattPåVent',
  },
  HINDRE_TILBAKETREKK: {
    kode: 'HINDRE_TILBAKETREKK',
    verdiId: 'HistorikkEndretFeltVerdiType.HindreTilbaketrekk',
  },
  UTFØR_TILBAKETREKK: {
    kode: 'UTFØR_TILBAKETREKK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtførTilbaketrekk',
  },
  NASJONAL: {
    kode: 'NASJONAL',
    verdiId: 'HistorikkEndretFeltVerdiType.Nasjonal',
  },
  EØS_BOSATT_NORGE: {
    kode: 'EØS_BOSATT_NORGE',
    verdiId: 'HistorikkEndretFeltVerdiType.EosBosattNorge',
  },
  BOSATT_UTLAND: {
    kode: 'BOSATT_UTLAND',
    verdiId: 'HistorikkEndretFeltVerdiType.BosattUtland',
  },
  SØKER_ER_I_PERMISJON: {
    kode: 'SØKER_ER_I_PERMISJON',
    verdiId: 'HistorikkEndretFeltVerdiType.SøkerErIPermisjon',
  },
  SØKER_ER_IKKE_I_PERMISJON: {
    kode: 'SØKER_ER_I_PERMISJON',
    verdiId: 'HistorikkEndretFeltVerdiType.SøkerErIkkeIPermisjon',
  },
  BRUK_MED_OVERSTYRTE_PERIODER: {
    kode: 'BRUK_MED_OVERSTYRTE_PERIODER',
    verdiId: 'HistorikkEndretFeltVerdiType.BrukMedOverstyrtePerioder',
  },
  INNTEKT_IKKE_MED_I_BG: {
    kode: 'INNTEKT_IKKE_MED_I_BG',
    verdiId: 'HistorikkEndretFeltVerdiType.InntektIkkeMedTilBeregningsgrunnlag',
  },
  LAGT_TIL_AV_SAKSBEHANDLER: {
    kode: 'LAGT_TIL_AV_SAKSBEHANDLER',
    verdiId: 'HistorikkEndretFeltVerdiType.LagtTilAvSaksbehandler',
  },
  BENYTT_A_INNTEKT_I_BG: {
    kode: 'BENYTT_A_INNTEKT_I_BG',
    verdiId: 'HistorikkEndretFeltVerdiType.BenyttAInntektIBeregningsgrunnlag',
  },
  MANGLENDE_OPPLYSNINGER: {
    kode: 'MANGLENDE_OPPLYSNINGER',
    verdiId: 'HistorikkEndretFeltVerdiType.ManglendeOpplysninger',
  },
  SLÅTT_SAMMEN_MED_ANNET: {
    kode: 'SLÅTT_SAMMEN_MED_ANNET',
    verdiId: 'HistorikkEndretFeltVerdiType.SlåttSammenMedAnnet',
  },
  NYTT_ARBEIDSFORHOLD: {
    kode: 'NYTT_ARBEIDSFORHOLD',
    verdiId: 'HistorikkEndretFeltVerdiType.NyttArbeidsforhold',
  },
  IKKE_BRUK: {
    kode: 'IKKE_BRUK',
    verdiId: 'HistorikkEndretFeltVerdiType.IkkeBruk',
  },
  INNVIRKNING: {
    kode: 'INNVIRKNING',
    verdiId: 'HistorikkEndretFeltVerdiType.Innvirkning',
  },
  INGEN_INNVIRKNING: {
    kode: 'INGEN_INNVIRKNING',
    verdiId: 'HistorikkEndretFeltVerdiType.IngenInnvirkning',
  },

};

export default historikkEndretFeltVerdiTypeCodes;
