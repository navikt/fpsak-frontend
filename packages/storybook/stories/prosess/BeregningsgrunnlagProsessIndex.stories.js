import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import sammenligningType from '@fpsak-frontend/kodeverk/src/sammenligningType';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const standardFom = '2019-09-16';
const standardTom = undefined;
const togglesFalse = {
  'fpsak.redesign.beregningsgrunnlag': false,
};
const togglesTrue = {
  'fpsak.redesign.beregningsgrunnlag': true,
};
const behandling = {
  id: 1,
  versjon: 1,
  venteArsakKode: venteArsakType.VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
};
const lagPGIVerdier = () => ([
  {
    beløp: 124412,
    årstall: 2017,
  },
  {
    beløp: 98456,
    årstall: 2016,
  },
  {
    beløp: 9861482,
    årstall: 2015,
  },
]);
const lagAPMedKode = (kode) => ([{
  definisjon: {
    kode,
  },
  status: {
    kode: 'OPPR',
  },
  begrunnelse: null,
}]);

const vilkarMedUtfall = (kode) => [{
  vilkarType: {
    kode: vilkarType.BEREGNINGSGRUNNLAGVILKARET,
    kodeverk: 'vilkarType',
  },
  vilkarStatus: {
    kode,
    kodeverk: 'vilkarStatus',
  },
}];

const lagArbeidsforhold = (arbeidsgiverNavn, arbeidsgiverId, arbeidsforholdId, opphoersdato) => ({
  arbeidsgiverNavn,
  arbeidsgiverId,
  startdato: '2018-10-09',
  opphoersdato,
  arbeidsforholdId,
  arbeidsforholdType: {
    kode: 'ARBEID',
    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
  },
  aktørId: null,
  refusjonPrAar: 360000,
  belopFraInntektsmeldingPrMnd: 30000,
  organisasjonstype: {
    kode: 'VIRKSOMHET',
    kodeverk: 'ORGANISASJONSTYPE',
  },
  naturalytelseBortfaltPrÅr: null,
  naturalytelseTilkommetPrÅr: null,
});

const lagAndel = (aktivitetstatuskode, beregnetPrAar, overstyrtPrAar, erTidsbegrensetArbeidsforhold, skalFastsetteGrunnlag) => ({
  beregningsgrunnlagTom: '2019-08-31',
  beregningsgrunnlagFom: '2019-06-01',
  aktivitetStatus: {
    kode: aktivitetstatuskode,
    kodeverk: 'AKTIVITET_STATUS',
  },
  beregningsperiodeFom: '2019-06-01',
  beregningsperiodeTom: '2019-08-31',
  beregnetPrAar,
  fastsattForrigePrAar: null,
  overstyrtPrAar,
  bruttoPrAar: overstyrtPrAar || beregnetPrAar,
  avkortetPrAar: 360000,
  redusertPrAar: 360000,
  erTidsbegrensetArbeidsforhold,
  skalFastsetteGrunnlag,
  erNyIArbeidslivet: null,
  lonnsendringIBeregningsperioden: null,
  andelsnr: 1,
  besteberegningPrAar: null,
  inntektskategori: {
    kode: 'ARBEIDSTAKER',
    kodeverk: 'INNTEKTSKATEGORI',
  },
  arbeidsforhold: {
    arbeidsgiverNavn: 'BEDRIFT AS',
    arbeidsgiverId: '910909088',
    startdato: '2018-10-09',
    opphoersdato: null,
    arbeidsforholdId: '2a3c0f5c-3d70-447a-b0d7-cd242d5155bb',
    arbeidsforholdType: {
      kode: 'ARBEID',
      kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
    },
    aktørId: null,
    refusjonPrAar: 360000,
    belopFraInntektsmeldingPrMnd: 30000,
    organisasjonstype: {
      kode: 'VIRKSOMHET',
      kodeverk: 'ORGANISASJONSTYPE',
    },
    naturalytelseBortfaltPrÅr: null,
    naturalytelseTilkommetPrÅr: null,
  },
  lagtTilAvSaksbehandler: false,
  belopPrMndEtterAOrdningen: 30000,
  belopPrAarEtterAOrdningen: 360000,
  dagsats: 1385,
  originalDagsatsFraTilstøtendeYtelse: null,
  fordeltPrAar: null,
  erTilkommetAndel: false,
});

const lagPeriode = (andelsliste, dagsats, fom, tom, periodeAarsaker) => ({
  beregningsgrunnlagPeriodeFom: fom,
  beregningsgrunnlagPeriodeTom: tom,
  beregnetPrAar: 360000,
  bruttoPrAar: 360000,
  bruttoInkludertBortfaltNaturalytelsePrAar: 360000,
  avkortetPrAar: 360000,
  redusertPrAar: 360000,
  periodeAarsaker,
  dagsats,
  beregningsgrunnlagPrStatusOgAndel: andelsliste,
  andelerLagtTilManueltIForrige: [],
});


const lagSammenligningsGrunnlag = (kode, rapportertPrAar, avvikProsent, differanse) => ({
  sammenligningsgrunnlagFom: '2018-09-01',
  sammenligningsgrunnlagTom: '2019-10-31',
  rapportertPrAar,
  avvikPromille: avvikProsent ? avvikProsent * 10 : 0,
  avvikProsent,
  sammenligningsgrunnlagType: {
    kode,
  },
  differanseBeregnet: differanse,
});

const lagPeriodeMedDagsats = (andelsliste, dagsats) => lagPeriode(andelsliste, dagsats, standardFom, standardTom, []);

const lagStandardPeriode = (andelsliste) => lagPeriode(andelsliste, null, standardFom, standardTom, []);

const lagTidsbegrensetPeriode = (andelsliste, fom, tom) => lagPeriode(andelsliste, null, fom, tom, [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }]);

const lagStatus = (kode) => ({
  kode,
  kodeverk: 'AKTIVITET_STATUS',
});

const lagBG = (perioder, statuser, sammenligningsgrunnlagPrStatus) => {
  const beregningsgrunnlag = {
    skjaeringstidspunktBeregning: '2019-09-16',
    aktivitetStatus: statuser,
    beregningsgrunnlagPeriode: perioder,
    dekningsgrad: 80,
    grunnbeløp: 99858,
    sammenligningsgrunnlag: {
      sammenligningsgrunnlagFom: '2018-09-01',
      sammenligningsgrunnlagTom: '2019-08-31',
      rapportertPrAar: 330000,
      avvikPromille: 91,
      avvikProsent: 9,
    },
    sammenligningsgrunnlagPrStatus,
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
    ledetekstRedusert: 'Redusert beregningsgrunnlag (100%)',
    halvG: 49929,
    faktaOmBeregning: {
      kortvarigeArbeidsforhold: null,
      frilansAndel: null,
      kunYtelse: null,
      faktaOmBeregningTilfeller: null,
      arbeidstakerOgFrilanserISammeOrganisasjonListe: null,
      arbeidsforholdMedLønnsendringUtenIM: null,
      besteberegningAndeler: null,
      vurderMottarYtelse: null,
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [{
          tom: '2019-09-16',
          aktivitete: [{
            arbeidsgiverNavn: 'BEDRIFT AS',
            arbeidsgiverId: '910909088',
            fom: '2018-10-09',
            tom: '9999-12-31',
            arbeidsforholdId: '2a3c0f5c-3d70-447a-b0d7-cd242d5155bb',
            arbeidsforholdType: {
              kode: 'ARBEID',
              kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
            },
            aktørId: null,
            skalBrukes: null,
          },
          ],
        },
        ],
      },
      vurderBesteberegning: null,
      andelerForFaktaOmBeregning: [{
        belopReadOnly: 30000,
        fastsattBelop: null,
        inntektskategori: {
          kode: 'ARBEIDSTAKER',
          kodeverk: 'INNTEKTSKATEGORI',
        },
        aktivitetStatus: {
          kode: 'AT',
          kodeverk: 'AKTIVITET_STATUS',
        },
        refusjonskrav: 30000,
        visningsnavn: 'BEDRIFT AS (910909088) ...55bb',
        arbeidsforhold: {
          arbeidsgiverNavn: 'BEDRIFT AS',
          arbeidsgiverId: '910909088',
          startdato: '2018-10-09',
          opphoersdato: null,
          arbeidsforholdId: '2a3c0f5c-3d70-447a-b0d7-cd242d5155bb',
          arbeidsforholdType: {
            kode: 'ARBEID',
            kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
          },
          aktørId: null,
          refusjonPrAar: null,
          belopFraInntektsmeldingPrMnd: 30000,
          organisasjonstype: {
            kode: 'VIRKSOMHET',
            kodeverk: 'ORGANISASJONSTYPE',
          },
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        andelsnr: 1,
        skalKunneEndreAktivitet: false,
        lagtTilAvSaksbehandler: false,
      },
      ],
      vurderMilitaer: null,
      refusjonskravSomKommerForSentListe: null,
    },
    andelerMedGraderingUtenBG: null,
    hjemmel: {
      kode: 'F_14_7_8_30',
      kodeverk: 'BG_HJEMMEL',
    },
    faktaOmFordeling: null,
    årsinntektVisningstall: 360000,
  };
  return beregningsgrunnlag;
};

export default {
  title: 'prosess/prosess-beregningsgrunnlag',
  component: BeregningsgrunnlagProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const arbeidstakerUtenAvvik = () => {
  const andeler = [lagAndel('AT', 300000, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1234)];
  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 330257, 6.2, -30257)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};

export const arbeidstakerMedAvvik = () => {
  const andeler = [lagAndel('AT', 300000, undefined, false)];
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -79059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS)}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};

export const arbeidstakerFrilansMedAvvik = () => {
  const andeler = [lagAndel('AT', 551316, undefined, false), lagAndel('FL', 596000, undefined, false)];
  andeler[0].skalFastsetteGrunnlag = true;
  andeler[1].skalFastsetteGrunnlag = false;
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT'), lagStatus('FL')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.AT, 140000, 46.2, 77000),
    lagSammenligningsGrunnlag(sammenligningType.FL, 180000, 16.2, 11000),
  ];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS)}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};

export const militær = () => {
  const andeler = [lagAndel('AT', 110232, undefined, false), lagAndel('MS', 300000, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1234)];
  const statuser = [lagStatus('AT'), lagStatus('MS')];
  const bg = lagBG(perioder, statuser);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};

export const arbeidstakerOgAAP = () => {
  const andeler = [lagAndel('AT', 110232, undefined, false), lagAndel('AAP', 250000, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1234)];
  const statuser = [lagStatus('AT'), lagStatus('AAP')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -67059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};

export const selvstendigNæringsdrivende = () => {
  const andeler = [lagAndel('SN', 300000, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, null, true)];
  const statuser = [lagStatus('SN')];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 154985;
  andeler[0].erNyIArbeidslivet = false;

  const næringer = [{
    begrunnelse: 'Endringsbeskrivelse',
    endringsdato: '2019-11-22',
    erNyIArbeidslivet: false,
    erNyoppstartet: true,
    erVarigEndret: true,
    kanRegnskapsførerKontaktes: false,
    oppgittInntekt: 1500000,
    oppstartsdato: null,
    orgnr: '910909088',
    regnskapsførerNavn: 'Regnar Regnskap',
    regnskapsførerTlf: '99999999',
    utenlandskvirksomhetsnavn: null,
    virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
    kode: 'ANNEN',
    kodeverk: 'VIRKSOMHET_TYPE',
  }];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -177059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);

  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE)}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};

export const tidsbegrensetArbeidsforholdMedAvvik = () => {
  const andeler = [lagAndel('AT', 300000, undefined, false), lagAndel('AT', 130250, undefined, true),
    lagAndel('AT', 130250, undefined, true), lagAndel('FL', 130250, undefined, undefined)];
  andeler[0].arbeidsforhold = lagArbeidsforhold('Andeby bank', '987654321', 'sdefsef-swdefsdf-sdf-sdfdsf-ddsdf');
  andeler[1].arbeidsforhold = lagArbeidsforhold('Gåseby Skole', '9478541223', 'sdefsef-swdefsdf-sdf-sdfdsf-98das', '2019-11-11');
  andeler[2].arbeidsforhold = lagArbeidsforhold('Svaneby sykehjem', '93178545', 'sdefsef-swdefsdf-sdf-sdfdsf-dfaf845');
  const perioder = [lagPeriode(andeler, undefined, '2019-09-16', '2019-09-29', []),
    lagTidsbegrensetPeriode(andeler, '2019-09-30', '2019-10-15'),
    lagPeriode(andeler, undefined, '2019-10-15', null, [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }])];
  const statuser = [lagStatus('AT_FL')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, 77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD)}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};

export const arbeidstakerFrilanserOgSelvstendigNæringsdrivende = () => {
  const andeler = [
    lagAndel('SN', 300000, undefined, undefined),
    lagAndel('AT', 130250, undefined, undefined),
    lagAndel('FL', 230250, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 154985;
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT_FL_SN')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, 77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE)}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};
export const infoTrygdYtelse = () => {
  const andeler = [
    lagAndel('KUN_YTELSE', 240000, undefined, undefined),
  ];
  const statuser = [lagStatus('KUN_YTELSE')];
  const perioder = [lagPeriodeMedDagsats(andeler, 923)];
  const bg = lagBG(perioder, statuser);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      // vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};
export const naturalYtelse = () => {
  const andeler = [
    lagAndel('AT', 240000, undefined, undefined),
  ];
  const statuser = [lagStatus('AT')];
  const perioder = [lagPeriodeMedDagsats(andeler, 923)];
  perioder[0].periodeAarsaker = [{ kode: periodeAarsak.NATURALYTELSE_BORTFALT }];
  andeler[0].bortfaltNaturalytelse = 23;
  const bg = lagBG(perioder, statuser);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      // vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};
export const frilansDagpengerOgSelvstendigNæringsdrivende = () => {
  const andeler = [
    lagAndel('FL', 596000, undefined, undefined),
    lagAndel('DP', 331000, undefined, undefined),
    lagAndel('SN', 331000, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[2].pgiVerdier = pgi;
  andeler[2].pgiSnitt = 154985;
  const statuser = [lagStatus('FL_SN'), lagStatus('DP')];
  const perioder = [lagPeriodeMedDagsats(andeler, 923)];
  const bg = lagBG(perioder, statuser);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      // vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};
export const arbeidstakerDagpengerOgSelvstendigNæringsdrivende = () => {
  const andeler = [
    lagAndel('AT', 596000, undefined, undefined),
    lagAndel('DP', 331000, undefined, undefined),
    lagAndel('SN', 331000, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[2].pgiVerdier = pgi;
  andeler[2].pgiSnitt = 154985;
  const statuser = [lagStatus('AT_SN'), lagStatus('DP')];
  const perioder = [lagPeriodeMedDagsats(andeler, 923)];
  const bg = lagBG(perioder, statuser);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      // vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};

export const graderingPåBeregningsgrunnlagUtenPenger = () => {
  const andeler = [lagAndel('SN', 300000, undefined, undefined), lagAndel('AT', 130250, undefined, undefined), lagAndel('FL', 130250, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 954985;
  // const perioder = [lagStandardPeriode(andeler)];
  const perioder = [lagPeriodeMedDagsats(andeler, 12345)];
  const statuser = [lagStatus('AT_FL_SN')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE)}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeUtenAkjsonspunkt = () => {
  const andeler = [
    lagAndel('SN', 331000, undefined, undefined, true),
    lagAndel('AT', 355000, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 654985;
  // const perioder = [lagStandardPeriode(andeler)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1844)];
  perioder[0].avkortetPrAar = 599148;
  perioder[0].redusertPrAar = 379318;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1347316;

  const statuser = [lagStatus('AT_SN')];
  const næringer = [{
    begrunnelse: 'Endringsbeskrivelse',
    endringsdato: '2019-11-22',
    erNyIArbeidslivet: false,
    erNyoppstartet: true,
    erVarigEndret: true,
    kanRegnskapsførerKontaktes: false,
    oppgittInntekt: 1500000,
    oppstartsdato: null,
    orgnr: '910909088',
    regnskapsførerNavn: 'Regnar Regnskap',
    regnskapsførerTlf: '99999999',
    utenlandskvirksomhetsnavn: null,
    virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
    kode: 'ANNEN',
    kodeverk: 'VIRKSOMHET_TYPE',
  }];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const arbeidstakerDagpengerOgSelvstendigNæringsdrivendeUtenAksjonspunkt = () => {
  const andeler = [
    lagAndel('SN', 107232, undefined, undefined, true),
    lagAndel('DP', 143000, undefined, undefined),
    lagAndel('FL', 343000, undefined, undefined),
  ];

  const perioder = [lagPeriodeMedDagsats(andeler, 1844)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 450326;
  perioder[0].avkortetPrAar = 599148;
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 754985;
  const statuser = [lagStatus('FL_SN'), lagStatus('DP')];
  const næringer = [{
    begrunnelse: 'Endringsbeskrivelse',
    endringsdato: '2019-11-22',
    erNyIArbeidslivet: false,
    erNyoppstartet: true,
    erVarigEndret: true,
    kanRegnskapsførerKontaktes: false,
    oppgittInntekt: 1500000,
    oppstartsdato: null,
    orgnr: '910909088',
    regnskapsførerNavn: 'Regnar Regnskap',
    regnskapsførerTlf: '99999999',
    utenlandskvirksomhetsnavn: null,
    virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
    kode: 'ANNEN',
    kodeverk: 'VIRKSOMHET_TYPE',
  }];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const tidsbegrensetArbeidsforholdMedAvvikRedesign = () => {
  const andeler = [lagAndel('AT', 300000, undefined, false), lagAndel('AT', 130250, undefined, true),
    lagAndel('AT', 130250, undefined, true), lagAndel('FL', 130250, undefined, undefined)];
  andeler[0].arbeidsforhold = lagArbeidsforhold('Andeby bank', '987654321', 'sdefsef-swdefsdf-sdf-sdfdsf-ddsdf');
  andeler[1].arbeidsforhold = lagArbeidsforhold('Gåseby Skole', '9478541223', 'sdefsef-swdefsdf-sdf-sdfdsf-98das');
  andeler[2].arbeidsforhold = lagArbeidsforhold('Svaneby sykehjem', '93178545', 'sdefsef-swdefsdf-sdf-sdfdsf-dfaf845');
  const perioder = [lagPeriode(andeler, undefined, '2019-09-16', '2019-09-29', []),
    lagTidsbegrensetPeriode(andeler, '2019-09-30', '2019-10-15'),
    lagPeriode(andeler, undefined, '2019-10-15', null, [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }])];
  const statuser = [lagStatus('AT_FL')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, 77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD)}
      submitCallback={action('button-click')}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
