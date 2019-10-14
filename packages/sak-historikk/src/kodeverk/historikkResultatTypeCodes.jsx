// @TODO Hent tekstane fra kodeverk i db
const historikkResultatTypeCodes = {
  AVSLAG: {
    kode: 'AVSLAG',
    feltId: 'HistorikkResultat.Avslag',
  },
  AVVIS_KLAGE: {
    kode: 'AVVIS_KLAGE',
    feltId: 'HistorikkResultat.AvvisKlage',
  },
  BEREGNET_AARSINNTEKT: {
    kode: 'BEREGNET_AARSINNTEKT',
    feltId: 'HistorikkResultat.GrunnlagBeregnetAarsinntekt',
  },
  DELVIS_INNVILGET: {
    kode: 'DELVIS_INNVILGET',
    feltId: 'HistorikkResultat.DelvisInnvilget',
  },
  INNVILGET: {
    kode: 'INNVILGET',
    feltId: 'HistorikkResultat.Innvilget',
  },
  MEDHOLD_I_KLAGE: {
    kode: 'MEDHOLD_I_KLAGE',
    feltId: 'HistorikkResultat.MedholdIKlage',
  },
  OPPHEVE_VEDTAK: {
    kode: 'OPPHEVE_VEDTAK',
    feltId: 'HistorikkResultat.OppheveVedtak',
  },
  OPPHØR: {
    kode: 'OPPHØR',
    feltId: 'HistorikkResultat.Opphør',
  },
  OPPRETTHOLDT_VEDTAK: {
    kode: 'OPPRETTHOLDT_VEDTAK',
    feltId: 'HistorikkResultat.OpprettholdtVedtak',
  },
  STADFESTET_VEDTAK: {
    kode: 'STADFESTET_VEDTAK',
    feltId: 'HistorikkResultat.StadfestetVedtak',
  },
  UTFALL_UENDRET: {
    kode: 'UTFALL_UENDRET',
    feltId: 'HistorikkResultat.UtfallUendret',
  },
  VEDTAK_I_KLAGEBEHANDLING: {
    kode: 'VEDTAK_I_KLAGEBEHANDLING',
    feltId: 'HistorikkResultat.VedtakKlagebehandling',
  },
  VEDTAK_I_ANKEBEHANDLING: {
    kode: 'VEDTAK_I_ANKEBEHANDLING',
    feltId: 'HistorikkResultat.VedtakAnkebehandling',
  },
  VEDTAK_I_INNSYNBEHANDLING: {
    kode: 'VEDTAK_I_INNSYNBEHANDLING',
    feltId: 'HistorikkResultat.VedtakInnsynbehandling',
  },
  DELVIS_MEDHOLD_I_KLAGE: {
    kode: 'DELVIS_MEDHOLD_I_KLAGE',
    feltId: 'HistorikkResultat.DelvisMedholdIKlage',
  },
  KLAGE_HJEMSENDE_UTEN_OPPHEVE: {
    kode: 'KLAGE_HJEMSENDE_UTEN_OPPHEVE',
    feltId: 'HistorikkResultat.BehandlingErHjemsendt',
  },
  UGUNST_MEDHOLD_I_KLAGE: {
    kode: 'UGUNST_MEDHOLD_I_KLAGE',
    feltId: 'HistorikkResultat.MedholdTilUgunst',
  },
  OVERSTYRING_FAKTA_UTTAK: {
    kode: 'OVERSTYRING_FAKTA_UTTAK',
    feltId: 'HistorikkResultat.OverstyringFaktaUttak',
  },
  DELVIS_TILBAKEBETALING: {
    kode: 'DELVIS_TILBAKEBETALING',
    feltId: 'HistorikkResultat.DelvisTilbakebetaling',
  },
  FULL_TILBAKEBETALING: {
    kode: 'FULL_TILBAKEBETALING',
    feltId: 'HistorikkResultat.FullTilbakebetaling',
  },
  INGEN_TILBAKEBETALING: {
    kode: 'INGEN_TILBAKEBETALING',
    feltId: 'HistorikkResultat.IngenTilbakebetaling',
  },
  MIGRERT_FRA_INFOTRYGD: {
    kode: 'MIGRERT_FRA_INFOTRYGD',
    feltId: 'HistorikkResultat.MigrertFraInfotrygd',
  },
  MIGRERT_FRA_INFOTRYGD_FJERNET: {
    kode: 'MIGRERT_FRA_INFOTRYGD_FJERNET',
    feltId: 'HistorikkResultat.MigrertFraInfotrygdFjernet',
  },
};

export default historikkResultatTypeCodes;
