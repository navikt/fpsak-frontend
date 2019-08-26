import { createSelector } from 'reselect';

import aksjonspunktCodes, {
  isVilkarForSykdomOppfylt,
  isBeregningAksjonspunkt,
} from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';

import commonBehandlingSelectors from './selectors/forsteOgRevBehandlingSelectors';
import isFieldEdited from './util/isFieldEdited';
import { getFagsakYtelseType } from './duckBehandlingForstegangOgRev';

// TODO (TOR) Flytt og grupper alle selectors i filer under ./selectors

// Alle generelle behandling-selectors må hentast via forsteOgRevBehandlingSelectors

export const getBehandlingIsRevurdering = createSelector([commonBehandlingSelectors.getBehandlingType], (
  bt = {},
) => bt.kode === behandlingType.REVURDERING);

export const getBehandlingArsaker = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.behandlingArsaker);
export const getBehandlingArsakTyper = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.behandlingArsaker
    ? selectedBehandling.behandlingArsaker.map(({ behandlingArsakType }) => behandlingArsakType) : undefined),
);

export const erManueltOpprettet = createSelector([getBehandlingArsaker], (behandlingArsaker = []) => behandlingArsaker
  .some(ba => ba.manueltOpprettet === true));
export const erArsakTypeHendelseFodsel = createSelector([getBehandlingArsakTyper], (behandlingArsakTyper = []) => behandlingArsakTyper
  .some(bt => bt.kode === 'RE-HENDELSE-FØDSEL'));
export const erArsakTypeBehandlingEtterKlage = createSelector([getBehandlingArsakTyper], (behandlingArsakTyper = []) => behandlingArsakTyper
  .some(bt => bt.kode === klageBehandlingArsakType.ETTER_KLAGE || bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK
    || bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK));

export const getBehandlingIsManuellRevurdering = createSelector(
  [getBehandlingIsRevurdering, erManueltOpprettet, erArsakTypeHendelseFodsel],
  (isRevurdering, manueltOpprettet, arsakTypeHendelseFodsel) => isRevurdering && (manueltOpprettet || arsakTypeHendelseFodsel),
);


export const getBehandlingBeregningResultat = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.beregningResultat);
export const getSkjaeringstidspunktForeldrepenger = createSelector([commonBehandlingSelectors.getSelectedBehandling],
  (selectedBehandling = {}) => selectedBehandling.behandlingsresultat.skjaeringstidspunktForeldrepenger);
export const getBehandlingUttaksperiodegrense = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling['uttak-periode-grense'],
);
export const getBehandlingYtelseFordeling = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.ytelsefordeling);
export const getGjeldendeDekningsgrad = createSelector([getBehandlingYtelseFordeling], (ytelsesfordeling = {}) => ytelsesfordeling.gjeldendeDekningsgrad);
export const getIsFagsakTypeSVP = createSelector([getFagsakYtelseType], (fagsakType = {}) => (
  fagsakType ? fagsakType.kode === fagsakYtelseType.SVANGERSKAPSPENGER : false));
export const getBehandlingResultatstruktur = createSelector(
  [getFagsakYtelseType, commonBehandlingSelectors.getSelectedBehandling], (fagsakType, selectedBehandling = {}) => (
    fagsakType.kode === fagsakYtelseType.FORELDREPENGER || fagsakType.kode === fagsakYtelseType.SVANGERSKAPSPENGER
    ? selectedBehandling['beregningsresultat-foreldrepenger'] : selectedBehandling['beregningsresultat-engangsstonad']),
);
export const getOpphoersdatoFraUttak = createSelector(
  [getBehandlingResultatstruktur], (behandlingResultatStruktur = {}) => (behandlingResultatStruktur ? behandlingResultatStruktur.opphoersdato : undefined),
);
export const getUttaksresultatPerioder = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => (selectedBehandling['uttaksresultat-perioder']));
export const getBehandlingVerge = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (
    selectedBehandling = {},
) => (selectedBehandling['soeker-verge'] ? selectedBehandling['soeker-verge'] : {}),
);
export const getStonadskontoer = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling['uttak-stonadskontoer']);
export const getUttakPerioder = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (
    selectedBehandling = {},
) => (selectedBehandling['uttak-kontroller-fakta-perioder']
    ? selectedBehandling['uttak-kontroller-fakta-perioder'].perioder.sort((a, b) => a.fom.localeCompare(b.fom)) : undefined),
);
export const getFaktaArbeidsforhold = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['fakta-arbeidsforhold']
    ? selectedBehandling['fakta-arbeidsforhold'] : undefined),
);

export const getTilrettelegging = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['svangerskapspenger-tilrettelegging']
  ? selectedBehandling['svangerskapspenger-tilrettelegging'] : undefined),
);

export const getHaveSentVarsel = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => (selectedBehandling['sendt-varsel-om-revurdering']));

export const getSimuleringResultat = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => (selectedBehandling.simuleringResultat));
export const getTilbakekrevingValg = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => (selectedBehandling.tilbakekrevingvalg));

// AKSJONSPUNKTER
export const getToTrinnsAksjonspunkter = createSelector([commonBehandlingSelectors.getAksjonspunkter], (
  aksjonspunkter = [],
) => aksjonspunkter.filter(ap => ap.toTrinnsBehandling));

export const doesVilkarForSykdomOppfyltExist = createSelector(
  [commonBehandlingSelectors.getAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.filter(ap => isVilkarForSykdomOppfylt(ap)).length > 0,
);


// BEREGNINGSGRUNNLAG
export const getBeregningsgrunnlag = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (selectedBehandling = {}) => (
    selectedBehandling.beregningsgrunnlag ? selectedBehandling.beregningsgrunnlag : undefined),
);
export const getGjeldendeBeregningAksjonspunkter = createSelector(
  [commonBehandlingSelectors.getAksjonspunkter], aksjonspunkter => aksjonspunkter.filter(ap => isBeregningAksjonspunkt(ap.definisjon.kode)),
);

export const getBeregningGraderingAksjonspunkt = createSelector(
  [commonBehandlingSelectors.getAksjonspunkter], aksjonspunkter => aksjonspunkter
    .find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG),
);

export const getAktivitetStatuser = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag
    && beregningsgrunnlag.aktivitetStatus ? beregningsgrunnlag.aktivitetStatus : undefined),
);
export const getAlleAndelerIForstePeriode = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag.beregningsgrunnlagPeriode
    && beregningsgrunnlag.beregningsgrunnlagPeriode.length > 0
    ? beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
    : []),
);

export const getBeregningsgrunnlagPerioder = createSelector([getBeregningsgrunnlag], (beregningsgrunnlag = {}) => beregningsgrunnlag.beregningsgrunnlagPeriode);
export const getBeregningsgrunnlagLedetekster = createSelector([getBeregningsgrunnlag], (beregningsgrunnlag = {}) => ({
  ledetekstBrutto: beregningsgrunnlag.ledetekstBrutto,
  ledetekstAvkortet: beregningsgrunnlag.ledetekstAvkortet,
  ledetekstRedusert: beregningsgrunnlag.ledetekstRedusert,
}));
export const getFaktaOmBeregning = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag ? beregningsgrunnlag.faktaOmBeregning : undefined),
);
export const getFaktaOmFordeling = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag ? beregningsgrunnlag.faktaOmFordeling : undefined),
);

export const getBehandlingGjelderBesteberegning = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning && faktaOmBeregning.faktaOmBeregningTilfeller
    ? faktaOmBeregning.faktaOmBeregningTilfeller.some(tilfelle => tilfelle.kode === faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE)
    : false),
);

export const getVurderBesteberegning = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.vurderBesteberegning : undefined),
);
export const getVurderMottarYtelse = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.vurderMottarYtelse : undefined),
);
export const getKunYtelse = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.kunYtelse : undefined),
);
export const getKortvarigeArbeidsforhold = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.kortvarigeArbeidsforhold : undefined),
);
export const getSkjæringstidspunktBeregning = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag ? beregningsgrunnlag.skjaeringstidspunktBeregning : undefined),
);
export const getEndringBeregningsgrunnlag = createSelector(
  [getFaktaOmFordeling], (faktaOmFordeling = {}) => {
      if (faktaOmFordeling && faktaOmFordeling.endringBeregningsgrunnlag) {
        return faktaOmFordeling.endringBeregningsgrunnlag;
      }
      return undefined;
    },
  );

export const getEndringBeregningsgrunnlagPerioder = createSelector(
  [getEndringBeregningsgrunnlag], (endringBG = {}) => (endringBG ? endringBG.endringBeregningsgrunnlagPerioder : []),
);
export const getFaktaOmBeregningTilfeller = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = []) => (faktaOmBeregning ? faktaOmBeregning.faktaOmBeregningTilfeller : []),
);
export const getFaktaOmBeregningTilfellerKoder = createSelector(
  [getFaktaOmBeregningTilfeller], (tilfeller = []) => (tilfeller ? tilfeller.map(({ kode }) => kode) : []),
);
export const getAvklarAktiviteter = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.avklarAktiviteter : undefined),
);

export const getAndelerMedGraderingUtenBG = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag ? beregningsgrunnlag.andelerMedGraderingUtenBG : undefined),
);


// Refusjonskrav som kommer for sent
export const getArbeidsgiverInfoForRefusjonskravSomKommerForSent = createSelector(
  [getFaktaOmFordeling], (faktaOmFordeling = {}) => {
      if (faktaOmFordeling && faktaOmFordeling.refusjonskravSomKommerForSentListe) {
        return faktaOmFordeling.refusjonskravSomKommerForSentListe;
      }
      return [];
    },
  );

// Risikoklassifisering
export const getRisikoklassifisering = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (selectedBehandling = {}) => (
    selectedBehandling.kontrollresultat ? selectedBehandling.kontrollresultat : undefined),
);
export const getRisikoAksjonspunkt = createSelector(
  [commonBehandlingSelectors.getAksjonspunkter], (aksjonspunkter = []) => (
    aksjonspunkter.find(ap => ap.definisjon && ap.definisjon.kode === aksjonspunktCodes.VURDER_FARESIGNALER)),
);

// FAMILIEHENDELSE
export const getFamiliehendelse = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling['familiehendelse-v2']);
export const getFamiliehendelseGjeldende = createSelector([getFamiliehendelse], (familiehendelse = {}) => familiehendelse.gjeldende);
export const getFamiliehendelseRegister = createSelector([getFamiliehendelse], (familiehendelse = {}) => familiehendelse.register);
export const getFamiliehendelseOppgitt = createSelector([getFamiliehendelse], (familiehendelse = {}) => familiehendelse.oppgitt);

export const getBehandlingVedtaksDatoSomSvangerskapsuke = createSelector(
  [getFamiliehendelseGjeldende], (familiehendelse = {}) => familiehendelse.vedtaksDatoSomSvangerskapsuke,
);
export const getFamiliehendelseAntallBarnTermin = createSelector([getFamiliehendelseGjeldende], (familiehendelse = {}) => familiehendelse.antallBarnTermin);
export const getFamiliehendelseTermindato = createSelector([getFamiliehendelseGjeldende], (familiehendelse = {}) => familiehendelse.termindato);
export const getBehandlingSkjaringstidspunkt = createSelector([getFamiliehendelseGjeldende], (familiehendelse = {}) => familiehendelse.skjaringstidspunkt);

// endre disse til familiehendelse
export const getBarnFraTpsRelatertTilSoknad = createSelector(
  [getFamiliehendelseRegister], (familiehendelse = {}) => (familiehendelse ? familiehendelse.avklartBarn : []),
);
const FNR_DODFODT_PART = '00001';
export const getAntallDodfodteBarn = createSelector(
  [getBarnFraTpsRelatertTilSoknad], (avklartBarn = []) => avklartBarn
    .reduce((nrOfDodfodteBarn, barn) => nrOfDodfodteBarn + (barn.fnr && barn.fnr.endsWith(FNR_DODFODT_PART) ? 1 : 0), 0),
);

// INNTEKT - ARBEID - YTELSE
const getBehandlingInntektArbeidYtelse = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling['inntekt-arbeid-ytelse']);
export const getInntektsmeldinger = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.inntektsmeldinger,
);
export const getBehandlingRelatertTilgrensendeYtelserForSoker = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker,
);
export const getBehandlingRelatertTilgrensendeYtelserForAnnenForelder = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.relatertTilgrensendeYtelserForAnnenForelder,
);
export const getInnvilgetRelatertTilgrensendeYtelserForAnnenForelder = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => (inntektArbeidYtelse.innvilgetRelatertTilgrensendeYtelserForAnnenForelder
    ? inntektArbeidYtelse.innvilgetRelatertTilgrensendeYtelserForAnnenForelder : []),
);
export const getBehandlingArbeidsforhold = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.arbeidsforhold,
);

export const getSkalKunneLeggeTilNyeArbeidsforhold = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.skalKunneLeggeTilNyeArbeidsforhold,
);

// MEDLEM
export const getBehandlingMedlemNew = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling['soeker-medlemskap-v2']);
// TODO petter remove when feature toggle is removed
export const getBehandlingMedlem = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling['soeker-medlemskap']);

export const isBehandlingRevurderingFortsattMedlemskap = createSelector(
  [commonBehandlingSelectors.getBehandlingType, getBehandlingMedlem], (type, medlem = {}) => type.kode === behandlingType.REVURDERING && !!medlem.fom,
);
export const getBehandlingRevurderingAvFortsattMedlemskapFom = createSelector(
  [getBehandlingMedlem], (medlem = {}) => medlem.fom,
);
export const getBehandlingMedlemEndredeOpplysninger = createSelector([getBehandlingMedlem], (medlem = {}) => (medlem.endringer ? medlem.endringer : []));

// OPPTJENING
const getBehandlingOpptjening = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.opptjening ? selectedBehandling.opptjening : undefined),
);
export const getBehandlingFastsattOpptjening = createSelector(
  [getBehandlingOpptjening], (opptjening = {}) => (opptjening ? opptjening.fastsattOpptjening : undefined),
);
export const getBehandlingFastsattOpptjeningFomDate = createSelector(
  [getBehandlingFastsattOpptjening], (fastsattOpptjening = {}) => (fastsattOpptjening ? fastsattOpptjening.opptjeningFom : undefined),
);
export const getBehandlingFastsattOpptjeningTomDate = createSelector(
  [getBehandlingFastsattOpptjening], (fastsattOpptjening = {}) => (fastsattOpptjening ? fastsattOpptjening.opptjeningTom : undefined),
);
export const getBehandlingFastsattOpptjeningperiodeMnder = createSelector(
  [getBehandlingFastsattOpptjening], (fastsattOpptjening = {}) => (fastsattOpptjening ? fastsattOpptjening.opptjeningperiode.måneder : undefined),
);
export const getBehandlingFastsattOpptjeningperiodeDager = createSelector(
  [getBehandlingFastsattOpptjening], (fastsattOpptjening = {}) => (fastsattOpptjening ? fastsattOpptjening.opptjeningperiode.dager : undefined),
);
export const getBehandlingOpptjeningActivities = createSelector(
  [getBehandlingOpptjening], (opptjening = {}) => (opptjening.opptjeningAktivitetList ? opptjening.opptjeningAktivitetList : []),
);
export const getBehandlingFastsattOpptjeningActivities = createSelector(
  [getBehandlingFastsattOpptjening], (fastsattOpptjening = {}) => (fastsattOpptjening ? fastsattOpptjening.fastsattOpptjeningAktivitetList : undefined),
);

// PERSONOPPLYSNINGER
export const getPersonopplysning = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling['soeker-personopplysninger']);
export const getAnnenPartPersonopplysning = createSelector([getPersonopplysning], (personopplysning = {}) => personopplysning.annenPart);
export const getEktefellePersonopplysning = createSelector([getPersonopplysning], (personopplysning = {}) => personopplysning.ektefelle);

// SØKNAD
export const getSoknadUtstedtdato = createSelector([commonBehandlingSelectors.getSoknad], soknad => soknad.utstedtdato);
export const getSoknadTermindato = createSelector([commonBehandlingSelectors.getSoknad], soknad => soknad.termindato);
export const getSoknadFodselsdatoer = createSelector([commonBehandlingSelectors.getSoknad], soknad => (soknad.fodselsdatoer ? soknad.fodselsdatoer : {}));
export const getSoknadAntallBarn = createSelector([commonBehandlingSelectors.getSoknad], soknad => (soknad.antallBarn));
export const getBehandlingStartDatoForPermisjon = createSelector(
  [commonBehandlingSelectors.getSoknad], (soknad = {}) => (soknad.oppgittFordeling ? soknad.oppgittFordeling.startDatoForPermisjon : undefined),
);

// ORIGINAL BEHANDLING
export const getOriginalBehandling = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], selectedBehandling => (selectedBehandling ? selectedBehandling['original-behandling'] : undefined),
);

export const getEditedStatus = createSelector(
  [commonBehandlingSelectors.getSoknad, getFamiliehendelseGjeldende, getPersonopplysning],
  (soknad, familiehendelse, personopplysning) => (
    isFieldEdited(soknad || {}, familiehendelse || {}, personopplysning || {})
  ),
);
