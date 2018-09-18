const historikkBegrunnelseTypeCodes = {
  AVSLAG: {
    kode: 'AVSLAG',
    feltId: 'HistorikkBegrunnelse.DokumentTypeAVSLAG',
  },
  BEH_SAK_VL: {
    kode: 'BEH_SAK_VL',
    feltId: 'HistorikkBegrunnelse.OppgaveAarsakBEHSAKVL',
  },
  ETTER_KLAGE: {
    kode: 'ETTER_KLAGE',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakETTERKLAGE',
  },
  FORLEN: {
    kode: 'FORLEN',
    feltId: 'HistorikkBegrunnelse.DokumentMalTypeFORLEN',
  },
  FORLME: {
    kode: 'FORLME',
    feltId: 'HistorikkBegrunnelse.DokumentMalTypeFORLME',
  },
  GOD_VED_VL: {
    kode: 'GOD_VED_VL',
    feltId: 'HistorikkBegrunnelse.OppgaveAarsakGODVEDVL',
  },
  HENLEG: {
    kode: 'HENLEG',
    feltId: 'HistorikkBegrunnelse.DokumentMalTypeHENLEG',
  },
  INNHEN: {
    kode: 'INNHEN',
    feltId: 'HistorikkBegrunnelse.DokumentMalTypeINNHEN',
  },
  INSSKR: {
    kode: 'INSSKR',
    feltId: 'HistorikkBegrunnelse.DokumentMalTypeINSSKR',
  },
  KLAGAV: {
    kode: 'KLAGAV',
    feltId: 'HistorikkBegrunnelse.DokumentMalTypeKLAGAV',
  },
  KLAGVE: {
    kode: 'KLAGVE',
    feltId: 'HistorikkBegrunnelse.DokumentMalTypeKLAGVE',
  },
  KLAGNY: {
    kode: 'KLAGNY',
    feltId: 'HistorikkBegrunnelse.DokumentMalTypeKLAGNY',
  },
  KLAGOV: {
    kode: 'KLAGOV',
    feltId: 'HistorikkBegrunnelse.DokumentMalTypeKLAGOV',
  },
  POSVED: {
    kode: 'POSVED',
    feltId: 'HistorikkBegrunnelse.DokumentMalTypePOSVED',
  },
  'RE-MF': {
    kode: 'RE-MF',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREMF',
  },
  'RE-MFIP': {
    kode: 'MFIP',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREMFIP',
  },
  'RE-AVAB': {
    kode: 'AVAB',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREAVAB',
  },
  'RE-LOV': {
    kode: 'RE-RE-LOV',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakRELOV',
  },
  'RE-RGLF': {
    kode: 'RE-RGLF',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakRERGLF',
  },
  'RE-FEFAKTA': {
    kode: 'RE-FEFAKTA',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREFEFAKTA',
  },
  'RE-PRSSL': {
    kode: 'RE-PRSSL',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREPRSSL',
  },
  'RE-ANNET': {
    kode: 'RE-ANNET',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREANNET',
  },
  'RE-BER-GRUN': {
    kode: 'RE-BER-GRUN',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREBERGRUN',
  },
  'RE-MDL': {
    kode: 'RE-MDL',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREMDL',
  },
  'RE-OPTJ': {
    kode: 'RE-OPTJ',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREOPTJ',
  },
  'RE-FRDLING': {
    kode: 'RE-FRDLING',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREFRDLING',
  },
  'RE-INNTK': {
    kode: 'RE-INNTK',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREINNTK',
  },
  'RE-DØD': {
    kode: 'RE-DØD',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREDØD',
  },
  'RE-YTELSE': {
    kode: 'RE-YTELSE',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREYTELSE',
  },
  'RE-SRTB': {
    kode: 'RE-SRTB',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakRESRTB',
  },
  'RE-FRIST': {
    kode: 'RE-FRIST',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREFRIST',
  },
  'RE-KLAG': {
    kode: 'RE-KLAG',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREKLAG',
  },
  'RE-HENDELSE-FØDSEL': {
    kode: 'RE-HENDELSE-FØDSEL',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREHENDELSEFØDSEL',
  },
  'BERØRT-BEHANDLING': {
    kode: 'BERØRT-BEHANDLING',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakBERØRTBEHANDLING',
  },
  'RE-END-INNTEKTSMELD': {
    kode: 'RE-END_INNTEKTSMELD',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREENDINNTEKTSMELD',
  },
  'RE-END-FRA-BRUKER': {
    kode: 'RE-HENDELSE-FØDSEL',
    feltId: 'HistorikkBegrunnelse.BehandlingAarsakREFB',
  },
  REG_SOK_VL: {
    kode: 'REG_SOK_VL',
    feltId: 'HistorikkBegrunnelse.OppgaveAarsakREGSOKVL',
  },
  REVURD: {
    kode: 'REVURD',
    feltId: 'HistorikkBegrunnelse.DokumentTypeREVURD',
  },
  RV_VL: {
    kode: 'RV_VL',
    feltId: 'HistorikkBegrunnelse.OppgaveAarsakRVVL',
  },
  SAKSBEH_START_PA_NYTT: {
    kode: 'SAKSBEH_START_PA_NYTT',
    feltId: 'HistorikkBegrunnelse.SaksbehStartPaNytt',
  },
  BEH_STARTET_PA_NYTT: {
    kode: 'BEH_STARTET_PA_NYTT',
    feltId: 'HistorikkBegrunnelse.BehStartetPaNytt',
  },
  VUR_KONS_YTE_FOR: {
    kode: 'VUR_KONS_YTE_FOR',
    feltId: 'HistorikkBegrunnelse.OppgaveAarsakVURKONSYTEFOR',
  },
  VUR_VL: {
    kode: 'VUR_VL',
    feltId: 'HistorikkBegrunnelse.OppgaveAarsakVURVL',
  },
  UENDRE: {
    kode: 'UENDRE',
    feltId: 'HistorikkBegrunnelse.DokumentTypeUENDRE',
  },
  'RE-TILST-YT-INNVIL': {
    kode: 'RE-TILST-YT-INNVIL',
    feltId: 'HistorikkBegrunnelse.ReTilstøtendeYtelseInnvilget',
  },
  'RE-ENDR-BER-GRUN': {
    kode: 'RE-ENDR-BER-GRUN',
    feltId: 'HistorikkBegrunnelse.ReEndrinBeregningsgrunnlag',
  },
  'RE-TILST-YT-OPPH': {
    kode: 'RE-TILST-YT-OPPH',
    feltId: 'HistorikkBegrunnelse.ReTilstøtendeYtelseOpphørt',
  },
};

export default historikkBegrunnelseTypeCodes;
