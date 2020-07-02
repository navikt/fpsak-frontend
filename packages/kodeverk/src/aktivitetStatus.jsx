import beregningsgrunnlagAndeltyper from './beregningsgrunnlagAndeltyper';

const aktivitetStatus = {
  KUN_YTELSE: 'KUN_YTELSE',
  ARBEIDSTAKER: 'AT',
  FRILANSER: 'FL',
  SELVSTENDIG_NAERINGSDRIVENDE: 'SN',
  KOMBINERT_AT_FL: 'AT_FL',
  KOMBINERT_AT_SN: 'AT_SN',
  KOMBINERT_FL_SN: 'FL_SN',
  KOMBINERT_AT_FL_SN: 'AT_FL_SN',
  DAGPENGER: 'DP',
  ARBEIDSAVKLARINGSPENGER: 'AAP',
  MILITAER_ELLER_SIVIL: 'MS',
  BRUKERS_ANDEL: 'BA',
  UDEFINERT: '-',
};

export default aktivitetStatus;

export const aktivitetstatusTilAndeltypeMap = {};
aktivitetstatusTilAndeltypeMap[aktivitetStatus.BRUKERS_ANDEL] = beregningsgrunnlagAndeltyper.BRUKERS_ANDEL;
aktivitetstatusTilAndeltypeMap[aktivitetStatus.FRILANSER] = beregningsgrunnlagAndeltyper.FRILANS;
aktivitetstatusTilAndeltypeMap[aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE] = beregningsgrunnlagAndeltyper.EGEN_NÆRING;

const statuserSomStotterFrilanser = [aktivitetStatus.FRILANSER, aktivitetStatus.KOMBINERT_AT_FL,
  aktivitetStatus.KOMBINERT_AT_FL_SN, aktivitetStatus.KOMBINERT_FL_SN];
const statuserSomStotterArbeidstaker = [aktivitetStatus.ARBEIDSTAKER, aktivitetStatus.KOMBINERT_AT_FL,
  aktivitetStatus.KOMBINERT_AT_FL_SN, aktivitetStatus.KOMBINERT_AT_SN];
const statuserSomStotterSelvstendigNaeringsdrivende = [aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, aktivitetStatus.KOMBINERT_FL_SN,
  aktivitetStatus.KOMBINERT_AT_FL_SN, aktivitetStatus.KOMBINERT_AT_SN];
const kombinasjonsstatuser = [aktivitetStatus.KOMBINERT_AT_FL, aktivitetStatus.KOMBINERT_AT_FL_SN,
  aktivitetStatus.KOMBINERT_FL_SN, aktivitetStatus.KOMBINERT_AT_SN];
const statuserSomStotterDagpengerEllerAAP = [aktivitetStatus.DAGPENGER, aktivitetStatus.ARBEIDSAVKLARINGSPENGER];
const statuserSomStotterTilstottendeYtelser = [aktivitetStatus.KUN_YTELSE];
const statuserSomStotterMilitaer = [aktivitetStatus.MILITAER_ELLER_SIVIL];

export const isStatusDagpengerOrAAP = (status) => (statuserSomStotterDagpengerEllerAAP.includes(status));

export const isStatusTilstotendeYtelse = (status) => (statuserSomStotterTilstottendeYtelser.includes(status));

export const isStatusFrilanserOrKombinasjon = (status) => (statuserSomStotterFrilanser.includes(status));

export const isStatusArbeidstakerOrKombinasjon = (status) => (statuserSomStotterArbeidstaker.includes(status));

export const isStatusSNOrKombinasjon = (status) => (statuserSomStotterSelvstendigNaeringsdrivende.includes(status));

export const isStatusKombinasjon = (status) => (kombinasjonsstatuser.includes(status));

export const isStatusMilitaer = (status) => (statuserSomStotterMilitaer.includes(status));
