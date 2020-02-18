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

import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
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
  redusertPrAar: 599000,
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
    sammenligningsgrunnlagInntekter: [
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 31800,
        dato: '2018-09-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2018-09-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 33450,
        dato: '2018-10-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2018-10-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 33559,
        dato: '2018-11-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 10000,
        dato: '2018-11-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 41800,
        dato: '2018-12-01',
      },

      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 39450,
        dato: '2019-01-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2019-01-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 39559,
        dato: '2019-02-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2019-02-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 38800,
        dato: '2019-03-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2019-03-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 39450,
        dato: '2019-04-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2019-04-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 38559,
        dato: '2019-05-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 0,
        dato: '2019-05-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 39600,
        dato: '2019-06-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 64000,
        dato: '2019-06-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 49993,
        dato: '2019-07-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 55000,
        dato: '2019-07-01',
      },
      {
        aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
        beløp: 48237,
        dato: '2019-08-01',
      },
      {
        aktivitetStatus: aktivitetStatus.FRILANSER,
        beløp: 30000,
        dato: '2019-08-01',
      },
    ],
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
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const brukersAndelUtenAvvik = () => {
  const andeler = [
    lagAndel('BA', 34230, undefined, false),
    lagAndel('AT', 534230, undefined, false),
  ];

  const perioder = [lagPeriodeMedDagsats(andeler, 2340)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 564000;
  delete perioder[0].redusertPrAar;
  delete perioder[0].avkortetPrAar;

  const statuser = [lagStatus('BA'), lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -67059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const arbeidstakerMedAvvik = () => {
  const andeler = [lagAndel('AT', 300000, undefined, false)];
  andeler[0].skalFastsetteGrunnlag = true;
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 25.009999999, -79059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  delete bg.sammenligningsgrunnlagInntekter;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
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
    lagSammenligningsGrunnlag(sammenligningType.AT, 140000, undefined, 77000),
    lagSammenligningsGrunnlag(sammenligningType.FL, 180000, 16.242342, 11000),
  ];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const arbeidstakerFrilansMedAvvikMedGradering = () => {
  const andeler = [lagAndel('AT', 551316, undefined, false), lagAndel('FL', 596000, undefined, false)];
  andeler[0].skalFastsetteGrunnlag = true;
  andeler[1].skalFastsetteGrunnlag = false;
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT'), lagStatus('FL')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.AT, 140000, undefined, 77000),
    lagSammenligningsGrunnlag(sammenligningType.FL, 180000, 16.242342, 11000),
  ];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.andelerMedGraderingUtenBG = andeler;
  const aksjonsPunkter1 = lagAPMedKode(aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG);
  const aksjonsPunkter2 = lagAPMedKode(aksjonspunktCodes.AUTO_VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG);
  aksjonsPunkter1[0].status.kode = aksjonspunktStatus.UTFORT;
  aksjonsPunkter1[0].begrunnelse = 'Dette er begrunnelsen';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={aksjonsPunkter1.concat(aksjonsPunkter2)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
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
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
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
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
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

  const næringer = [
    {
      begrunnelse: 'Jeg utvidet virksomheten fra en ren frisørsalong til også å tilby hudpleie. '
        + 'Jeg jobbet opprinnelig alene men har ansatt to stykker i løpet av det siste året',
      endringsdato: '2016-05-01',
      erNyoppstartet: false,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: true,
      oppgittInntekt: 900000,
      oppstartsdato: '2015-11-01',
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnskapsfører Regn S. Fører',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'ANNEN', kodeverk: 'VIRKSOMHET_TYPE' },
    },
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyoppstartet: false,
      erVarigEndret: false,
      kanRegnskapsførerKontaktes: false,
      oppgittInntekt: null,
      oppstartsdato: '2015-11-01',
      opphoersdato: '201-03-01',
      orgnr: '910909077',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: { kode: 'JORDBRUK_SKOGBRUK', kodeverk: 'VIRKSOMHET_TYPE' },
      virksomhetNavn: 'Berit Jensen',
    },
  ];
  andeler[0].næringer = næringer;
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.21243, -177059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);

  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const tidsbegrensetArbeidsforholdMedAvvik = () => {
  const andeler = [
    lagAndel('AT', 300000, undefined, false),
    lagAndel('AT', 132250, undefined, true),
    lagAndel('AT', 140250, undefined, true),
    lagAndel('FL', 133250, undefined, undefined)];
  andeler[0].arbeidsforhold = lagArbeidsforhold('Andeby bank', '987654321', 'sdefsef-swdefsdf-sdf-sdfdsf-ddsdf');
  andeler[1].arbeidsforhold = lagArbeidsforhold('Gardslien transport og Gardiner AS', '9478541223', 'sdefsef-swdefsdf-sdf-sdfdsf-98das', '2019-11-11');
  andeler[2].arbeidsforhold = lagArbeidsforhold('Svaneby sykehjem', '93178545', 'sdefsef-swdefsdf-sdf-sdfdsf-dfaf845');
  andeler[1].arbeidsforhold.stillingsProsent = '60';
  andeler[1].arbeidsforhold.stillingsNavn = 'Butikkmedarbeider';
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
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
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
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const infoTrygdYtelse = () => {
  const andeler = [
    lagAndel('KUN_YTELSE', 360000, undefined, undefined),
  ];
  const statuser = [lagStatus('KUN_YTELSE')];
  const perioder = [lagPeriodeMedDagsats(andeler, 1215)];
  perioder[0].redusertPrAar = 316000;
  const bg = lagBG(perioder, statuser);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const naturalYtelse = () => {
  const andel1 = lagAndel('AT', 240000, undefined, undefined);
  const andel2 = lagAndel('AT', 740000, 744000, undefined);
  const andel3 = lagAndel('AT', 750000, 755000, undefined);
  andel1.arbeidsforhold.arbeidsgiverNavn = 'BEDRIFT AS 1';
  andel1.arbeidsforhold.arbeidsgiverId = '9109090881';
  andel2.arbeidsforhold.arbeidsgiverNavn = 'BEDRIFT AS 2';
  andel2.arbeidsforhold.arbeidsgiverId = '9109090882';
  andel3.arbeidsforhold.arbeidsgiverNavn = 'BEDRIFT AS 3';
  andel3.arbeidsforhold.arbeidsgiverId = '9109090883';
  andel2.bortfaltNaturalytelse = 2231;
  andel3.bortfaltNaturalytelse = 3231;
  andel1.dekningsgrad = 100;
  andel2.dekningsgrad = 80;
  andel3.dekningsgrad = 80;
  delete andel1.bortfaltNaturalytelse;
  const statuser = [lagStatus('AT')];
  const periode1 = lagPeriode([{ ...andel1 }, { ...andel2 }, { ...andel3 }],
    4432,
    '2019-03-21',
    '2019-05-31',
    [{ kode: periodeAarsak.NATURALYTELSE_BORTFALT }]);
  andel1.bortfaltNaturalytelse = 1231;
  delete andel2.bortfaltNaturalytelse;
  delete andel3.bortfaltNaturalytelse;
  const periode2 = lagPeriode([{ ...andel1 }, { ...andel2 }, { ...andel3 }],
    2432,
    '2019-06-01',
    '2019-07-30',
    [{ kode: periodeAarsak.NATURALYTELSE_BORTFALT }]);
  const periode3 = lagPeriode([{ ...andel1 }, { ...andel2 }, { ...andel3 }],
    3432,
    '2019-08-01',
    '2019-09-30',
    [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }]);

  const perioder = [
    periode1,
    periode2,
    periode3,
  ];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 432000;
  perioder[0].redusertPrAar = 399148;
  perioder[1].bruttoInkludertBortfaltNaturalytelsePrAar = 732000;
  perioder[1].redusertPrAar = 499148;
  perioder[1].avkortetPrAar = 599148;
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -79059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
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
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 596000;
  const bg = lagBG(perioder, statuser);
  bg.dekningsgrad = 80;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      submitCallback={action('button-click')}
      aksjonspunkter={[]}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const FrilansMedAvvik = () => {
  const andeler = [lagAndel('FL', 596000, undefined, false)];
  andeler[0].skalFastsetteGrunnlag = true;

  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('FL')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.FL, 180000, 26.2, 11000),
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
      featureToggles={togglesTrue}
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
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const graderingPåBeregningsgrunnlagUtenPenger = () => {
  const andeler = [
    lagAndel('SN', 300000, undefined, undefined),
    lagAndel('AT', 137250, undefined, undefined),
    lagAndel('FL', 130250, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 654985;
  // const perioder = [lagStandardPeriode(andeler)];
  const perioder = [lagPeriodeMedDagsats(andeler, 12345)];
  const statuser = [lagStatus('AT_FL_SN')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.andelerMedGraderingUtenBG = andeler;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeUtenAkjsonspunkt = () => {
  const andeler = [
    lagAndel('SN', 331000, undefined, undefined, false),
    lagAndel('AT', 72194, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 100299;

  const perioder = [lagPeriodeMedDagsats(andeler, andeler[0].pgiSnitt / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].pgiSnitt;

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
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const arbeidstakerOgFrilansOgSelvstendigNæringsdrivendeMedAksjonspunktBehandlet = () => {
  const andeler = [
    lagAndel('SN', 331000, undefined, undefined, true),
    lagAndel('AT', 355000, undefined, undefined, false),
    lagAndel('FL', 311000, undefined, undefined, false),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 654985;
  // const perioder = [lagStandardPeriode(andeler)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1844)];
  perioder[0].avkortetPrAar = 599148;
  perioder[0].redusertPrAar = 379318;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1347316;

  const statuser = [lagStatus('AT_FL_SN')];
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
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE)}
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

export const arbeidstakerDagpengerOgSelvstendigNæringsdrivendeUtenAksjonspunkt = () => {
  const andeler = [
    lagAndel('SN', 107232, undefined, undefined, false),
    lagAndel('DP', 143000, undefined, undefined, false),
    lagAndel('FL', 343000, undefined, undefined, false),
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
    virksomhetType: { kode: 'DAGMAMMA', kodeverk: 'VIRKSOMHET_TYPE' },
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
      aksjonspunkter={[]}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const arbeidstakerIkkeOppfylt = () => {
  const andeler = [
    lagAndel('AT', 32232, undefined, undefined, false),
  ];

  const perioder = [lagPeriodeMedDagsats(andeler, 1844)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 450326;

  const statuser = [lagStatus('AT')];

  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, -42673, 26.2, -7131)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      submitCallback={action('button-click')}
      aksjonspunkter={[]}
      readOnly={false}
      readOnlySubmitButton={false}
      apCodes={[]}
      isApOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};


export const arbeidstakerDagpengerMedBesteberegningUtenAksjonspunkt = () => {
  const andeler = [
    lagAndel('DP', 107232, undefined, undefined),
    lagAndel('AT', 343094, undefined, undefined),
    lagAndel('AAP', 33094, undefined, undefined),
  ];

  const perioder = [lagPeriodeMedDagsats(andeler, 1732)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 450326;
  perioder[0].avkortetPrAar = 599148;

  const statuser = [lagStatus('AT'), lagStatus('DP')];
  const sammenligningsgrunnlagPrStatus = [
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 474257, 26.2, -77059)];

  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.faktaOmBeregning.faktaOmBeregningTilfeller = [{ kode: faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE }];
  bg.dekningsgrad = 100;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      submitCallback={action('button-click')}
      aksjonspunkter={[]}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const tidsbegrensetArbeidsforholdMedAvvikOrgDesign = () => {
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
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};

export const SelvstendigNæringsdrivendeUtenVarigEndringIkkeNyoppstartetSide12 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, false),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler, 479318 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].pgiSnitt;
  perioder[0].avkortetPrAar = 599148;

  const statuser = [lagStatus('SN')];
  const næringer = [{
    begrunnelse: '',
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
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};

export const arbeidstakerOgSelvstendigNæringsdrivendeSnStorreEnnAtOgStorreEnn6gDekningsgrad80Side18 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, false),
    lagAndel('AT', 472194, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler, 479318 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[0].pgiSnitt;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].redusertPrAar = 479318;

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
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeSnMindreEnnAtOgStorreEnn6gDekningsgrad80Side19 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, false),
    lagAndel('AT', 814363, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler, 479318 / 260)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[1].bruttoPrAar;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].redusertPrAar = 479318;

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
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeMedAPVarigEndringSide20 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, true),
    lagAndel('AT', 551316, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[1].bruttoPrAar;


  const statuser = [lagStatus('AT_SN')];
  const næringer = [{
    begrunnelse: 'Endringsbeskrivelse',
    endringsdato: '2019-11-22',
    erNyIArbeidslivet: false,
    erNyoppstartet: false,
    erVarigEndret: true,
    kanRegnskapsførerKontaktes: false,
    oppgittInntekt: 900000,
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
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  delete bg.dekningsgrad;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeSide21 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, true),
    lagAndel('AT', 551316, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  andeler[0].overstyrtPrAar = 780342;
  andeler[0].beregnetPrAar = 631129;
  const perioder = [lagPeriodeMedDagsats(andeler, 1843)];

  perioder[0].redusertPrAar = 479318;
  perioder[0].beregnetPrAar = 631129;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1331658;
  const statuser = [lagStatus('AT_SN')];
  const næringer = [{
    begrunnelse: 'Endringsbeskrivelse',
    endringsdato: '2019-11-22',
    erNyIArbeidslivet: false,
    erNyoppstartet: false,
    erVarigEndret: true,
    kanRegnskapsførerKontaktes: false,
    oppgittInntekt: 900000,
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
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  const ap = lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE);
  ap[0].begrunnelse = 'Endring eller nyoppstartet begrunnelse';
  ap[0].status.kode = 'UTFO';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const arbeidstakerOgSelvstendigNæringsdrivendeSide22 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, true),
    lagAndel('AT', 851316, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  andeler[0].overstyrtPrAar = 780342;
  andeler[0].beregnetPrAar = 631129;
  const perioder = [lagPeriodeMedDagsats(andeler, 1843)];

  perioder[0].redusertPrAar = 479318;
  perioder[0].beregnetPrAar = 631129;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1331658;
  const statuser = [lagStatus('AT_SN')];
  const næringer = [{
    begrunnelse: 'Endringsbeskrivelse',
    endringsdato: '2019-11-22',
    erNyIArbeidslivet: false,
    erNyoppstartet: false,
    erVarigEndret: true,
    kanRegnskapsførerKontaktes: false,
    oppgittInntekt: 900000,
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
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  const ap = lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE);
  ap[0].begrunnelse = 'Endring eller nyoppstartet begrunnelse';
  ap[0].status.kode = 'UTFO';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const arbeidstakerFrilansOgSelvstendigNæringsdrivendeMedAPVarigEndringSide23 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, true),
    lagAndel('AT', 24000, undefined, undefined),
    lagAndel('FL', 596000, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler)];
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = andeler[1].bruttoPrAar;


  const statuser = [lagStatus('AT_FL_SN')];
  const næringer = [{
    begrunnelse: 'Endringsbeskrivelse',
    endringsdato: '2019-11-22',
    erNyIArbeidslivet: false,
    erNyoppstartet: false,
    erVarigEndret: true,
    kanRegnskapsførerKontaktes: false,
    oppgittInntekt: 900000,
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
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  delete bg.dekningsgrad;
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.IKKE_VURDERT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const arbeidstakerFrilansOgSelvstendigNæringsdrivendeMedAPVarigEndringSide24 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, true),
    lagAndel('AT', 24000, undefined, undefined),
    lagAndel('FL', 596000, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  andeler[0].overstyrtPrAar = 780342;
  andeler[0].beregnetPrAar = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler, 1843)];

  perioder[0].redusertPrAar = 479318;
  perioder[0].beregnetPrAar = 631129;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1400342;

  const statuser = [lagStatus('AT_FL_SN')];
  const næringer = [{
    begrunnelse: 'Endringsbeskrivelse',
    endringsdato: '2019-11-22',
    erNyIArbeidslivet: false,
    erNyoppstartet: false,
    erVarigEndret: false,
    kanRegnskapsførerKontaktes: false,
    oppgittInntekt: 900000,
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
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  const ap = lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE);
  ap[0].begrunnelse = 'Endring eller nyoppstartet begrunnelse';
  ap[0].status.kode = 'UTFO';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const arbeidstakerFrilansOgSelvstendigNæringsdrivendeMedAPVarigEndringSide25 = () => {
  const andeler = [
    lagAndel('SN', 531000, undefined, undefined, true),
    lagAndel('AT', 551316, undefined, undefined),
    lagAndel('FL', 596000, undefined, undefined),
  ];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 631129;
  andeler[0].overstyrtPrAar = 780342;
  andeler[0].beregnetPrAar = 631129;

  const perioder = [lagPeriodeMedDagsats(andeler, 1843)];

  perioder[0].redusertPrAar = 479318;
  perioder[0].beregnetPrAar = 631129;
  perioder[0].avkortetPrAar = 599148;
  perioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1147342;

  const statuser = [lagStatus('AT_FL_SN')];
  const næringer = [{
    begrunnelse: 'Endringsbeskrivelse',
    endringsdato: '2019-11-22',
    erNyIArbeidslivet: false,
    erNyoppstartet: false,
    erVarigEndret: true,
    kanRegnskapsførerKontaktes: false,
    oppgittInntekt: 900000,
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
    lagSammenligningsGrunnlag(sammenligningType.ATFLSN, 900000, 29.9, -268871)];
  const bg = lagBG(perioder, statuser, sammenligningsgrunnlagPrStatus);
  bg.dekningsgrad = 80;
  const ap = lagAPMedKode(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE);
  ap[0].begrunnelse = 'Endring eller nyoppstartet begrunnelse';
  ap[0].status.kode = 'UTFO';
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={ap}
      submitCallback={action('button-click')}
      isReadOnly
      readOnlySubmitButton
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesTrue}
    />
  );
};
export const feil = () => {
  const bg = {
    skjaeringstidspunktBeregning: '2020-02-04',
    skjæringstidspunkt: '2020-02-04',
    aktivitetStatus: [{ kode: 'AT_SN', inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' }, kodeverk: 'AKTIVITET_STATUS' }],
    beregningsgrunnlagPeriode: [{
      beregningsgrunnlagPeriodeFom: '2020-02-04',
      beregningsgrunnlagPeriodeTom: '9999-12-31',
      beregnetPrAar: 592728.75,
      bruttoPrAar: 592728.75,
      bruttoInkludertBortfaltNaturalytelsePrAar: 592728.75,
      avkortetPrAar: 592728.75,
      redusertPrAar: 592728.75,
      periodeAarsaker: [],
      dagsats: 2280,
      beregningsgrunnlagPrStatusOgAndel: [{
        beregningsgrunnlagFom: '2019-11-01',
        beregningsgrunnlagTom: '2020-01-31',
        aktivitetStatus: { kode: 'AT', inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' }, kodeverk: 'AKTIVITET_STATUS' },
        beregningsperiodeFom: '2019-11-01',
        beregningsperiodeTom: '2020-01-31',
        beregnetPrAar: 551499.96,
        fastsattForrigePrAar: null,
        overstyrtPrAar: null,
        bruttoPrAar: 551499.96,
        avkortetPrAar: 551499.96,
        redusertPrAar: 551499.96,
        erTidsbegrensetArbeidsforhold: null,
        erNyIArbeidslivet: null,
        lonnsendringIBeregningsperioden: null,
        andelsnr: 1,
        besteberegningPrAar: null,
        inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
        arbeidsforhold: {
          arbeidsgiverNavn: 'ØRMELEN SKOLE',
          arbeidsgiverId: '975294633',
          startdato: '2012-08-01',
          opphoersdato: null,
          arbeidsforholdId: null,
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: 551499.96,
          belopFraInntektsmeldingPrMnd: 45958.33,
          organisasjonstype: null,
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        fastsattAvSaksbehandler: false,
        lagtTilAvSaksbehandler: false,
        belopPrMndEtterAOrdningen: 45958.3300000000,
        belopPrAarEtterAOrdningen: 551499.960000000000,
        dagsats: 2121,
        originalDagsatsFraTilstøtendeYtelse: null,
        fordeltPrAar: null,
        erTilkommetAndel: false,
        skalFastsetteGrunnlag: false,
      }, {
        beregningsgrunnlagFom: '2016-01-01',
        beregningsgrunnlagTom: '2018-12-31',
        aktivitetStatus: { kode: 'SN', inntektskategori: { kode: 'SELVSTENDIG_NÆRINGSDRIVENDE', kodeverk: 'INNTEKTSKATEGORI' }, kodeverk: 'AKTIVITET_STATUS' },
        beregningsperiodeFom: '2016-01-01',
        beregningsperiodeTom: '2018-12-31',
        beregnetPrAar: 41228.79,
        fastsattForrigePrAar: null,
        overstyrtPrAar: null,
        bruttoPrAar: 41228.79,
        avkortetPrAar: 41228.79,
        redusertPrAar: 41228.79,
        erTidsbegrensetArbeidsforhold: null,
        erNyIArbeidslivet: null,
        lonnsendringIBeregningsperioden: null,
        andelsnr: 2,
        besteberegningPrAar: null,
        inntektskategori: { kode: 'JORDBRUKER', kodeverk: 'INNTEKTSKATEGORI' },
        arbeidsforhold: {
          arbeidsgiverNavn: null,
          arbeidsgiverId: null,
          startdato: null,
          opphoersdato: null,
          arbeidsforholdId: null,
          arbeidsforholdType: { kode: 'NÆRING', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: null,
          belopFraInntektsmeldingPrMnd: null,
          organisasjonstype: null,
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        fastsattAvSaksbehandler: false,
        lagtTilAvSaksbehandler: false,
        belopPrMndEtterAOrdningen: null,
        belopPrAarEtterAOrdningen: null,
        dagsats: 159,
        originalDagsatsFraTilstøtendeYtelse: null,
        fordeltPrAar: null,
        erTilkommetAndel: false,
        skalFastsetteGrunnlag: false,
        pgiSnitt: 592729,
        pgiVerdier: [{ beløp: 705517, årstall: 2018 }, { beløp: 591757, årstall: 2017 }, { beløp: 551825, årstall: 2016 }],
        næringer: [{
          utenlandskvirksomhetsnavn: null,
          orgnr: '919705388',
          erVarigEndret: false,
          erNyoppstartet: true,
          virksomhetType: { kode: 'JORDBRUK_SKOGBRUK', inntektskategori: { kode: 'JORDBRUKER', kodeverk: 'INNTEKTSKATEGORI' }, kodeverk: 'VIRKSOMHET_TYPE' },
          begrunnelse: null,
          endringsdato: null,
          oppstartsdato: null,
          regnskapsførerNavn: 'Vegard Dahl',
          regnskapsførerTlf: '95968189',
          kanRegnskapsførerKontaktes: false,
          erNyIArbeidslivet: false,
          oppgittInntekt: 123000.00,
        }],
      }],
    }],
    sammenligningsgrunnlag: {
      sammenligningsgrunnlagFom: '2018-01-01',
      sammenligningsgrunnlagTom: '2018-01-01',
      rapportertPrAar: 674499.96,
      avvikPromille: 137.9572179,
      avvikProsent: 13.79572179,
      sammenligningsgrunnlagType: { kode: 'SAMMENLIGNING_ATFL_SN', kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE' },
      differanseBeregnet: -81770.96,
    },
    sammenligningsgrunnlagPrStatus: [{
      sammenligningsgrunnlagFom: '2018-01-01',
      sammenligningsgrunnlagTom: '2018-01-01',
      rapportertPrAar: 674499.96,
      avvikPromille: 137.9572179,
      avvikProsent: 13.79572179,
      sammenligningsgrunnlagType: { kode: 'SAMMENLIGNING_ATFL_SN', kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE' },
      differanseBeregnet: -81770.96,
    }],
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
    ledetekstRedusert: 'Redusert beregningsgrunnlag (100%)',
    halvG: 49929.0,
    grunnbeløp: 99858,
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
          tom: '2020-02-04',
          aktiviteter: [{
            arbeidsgiverNavn: 'ØRMELEN SKOLE',
            arbeidsgiverId: '975294633',
            eksternArbeidsforholdId: null,
            fom: '2012-08-01',
            tom: '9999-12-31',
            arbeidsforholdId: null,
            arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            aktørIdString: null,
            skalBrukes: null,
          }, {
            arbeidsgiverNavn: null,
            arbeidsgiverId: null,
            eksternArbeidsforholdId: null,
            fom: '2018-01-01',
            tom: '9999-12-31',
            arbeidsforholdId: null,
            arbeidsforholdType: { kode: 'NÆRING', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            aktørIdString: null,
            skalBrukes: null,
          }],
        }],
      },
      vurderBesteberegning: null,
      andelerForFaktaOmBeregning: [{
        belopReadOnly: 45958.33,
        fastsattBelop: 45958.3300000000,
        inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
        aktivitetStatus: { kode: 'AT', inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' }, kodeverk: 'AKTIVITET_STATUS' },
        refusjonskrav: 45958.33,
        visningsnavn: 'ØRMELEN SKOLE (975294633)',
        arbeidsforhold: {
          arbeidsgiverNavn: 'ØRMELEN SKOLE',
          arbeidsgiverId: '975294633',
          startdato: '2012-08-01',
          opphoersdato: null,
          arbeidsforholdId: null,
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: 551499.96,
          belopFraInntektsmeldingPrMnd: 45958.33,
          organisasjonstype: null,
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        andelsnr: 1,
        skalKunneEndreAktivitet: false,
        lagtTilAvSaksbehandler: false,
      }, {
        belopReadOnly: null,
        fastsattBelop: 3435.7325000000,
        inntektskategori: { kode: 'JORDBRUKER', kodeverk: 'INNTEKTSKATEGORI' },
        aktivitetStatus: { kode: 'SN', inntektskategori: { kode: 'SELVSTENDIG_NÆRINGSDRIVENDE', kodeverk: 'INNTEKTSKATEGORI' }, kodeverk: 'AKTIVITET_STATUS' },
        refusjonskrav: null,
        visningsnavn: 'Næring',
        arbeidsforhold: {
          arbeidsgiverNavn: null,
          arbeidsgiverId: null,
          startdato: null,
          opphoersdato: null,
          arbeidsforholdId: null,
          arbeidsforholdType: { kode: 'NÆRING', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: null,
          belopFraInntektsmeldingPrMnd: null,
          organisasjonstype: null,
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        andelsnr: 2,
        skalKunneEndreAktivitet: false,
        lagtTilAvSaksbehandler: false,
      }],
      vurderMilitaer: null,
      refusjonskravSomKommerForSentListe: null,
    },
    andelerMedGraderingUtenBG: null,
    hjemmel: { kode: 'F_14_7_8_41', kodeverk: 'BG_HJEMMEL' },
    faktaOmFordeling: {
      fordelBeregningsgrunnlag: {
        fordelBeregningsgrunnlagPerioder: [{
          fom: '2020-02-04',
          tom: null,
          fordelBeregningsgrunnlagAndeler: [{
            fordelingForrigeBehandlingPrAar: null,
            refusjonskravPrAar: 551500,
            fordeltPrAar: null,
            belopFraInntektsmeldingPrAar: 551500,
            refusjonskravFraInntektsmeldingPrAar: 551500,
            nyttArbeidsforhold: false,
            arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            andelsnr: 1,
            arbeidsforhold: {
              arbeidsgiverNavn: 'ØRMELEN SKOLE',
              arbeidsgiverId: '975294633',
              startdato: '2012-08-01',
              opphoersdato: null,
              arbeidsforholdId: null,
              arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
              aktørId: null,
              refusjonPrAar: 551499.96,
              belopFraInntektsmeldingPrMnd: null,
              organisasjonstype: null,
              naturalytelseBortfaltPrÅr: null,
              naturalytelseTilkommetPrÅr: null,
            },
            inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
            aktivitetStatus: { kode: 'AT', inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' }, kodeverk: 'AKTIVITET_STATUS' },
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
            andelIArbeid: [0],
          }, {
            fordelingForrigeBehandlingPrAar: null,
            refusjonskravPrAar: 0,
            fordeltPrAar: null,
            belopFraInntektsmeldingPrAar: null,
            refusjonskravFraInntektsmeldingPrAar: null,
            nyttArbeidsforhold: false,
            arbeidsforholdType: { kode: 'NÆRING', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            andelsnr: 2,
            arbeidsforhold: {
              arbeidsgiverNavn: null,
              arbeidsgiverId: null,
              startdato: null,
              opphoersdato: null,
              arbeidsforholdId: null,
              arbeidsforholdType: { kode: 'NÆRING', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
              aktørId: null,
              refusjonPrAar: null,
              belopFraInntektsmeldingPrMnd: null,
              organisasjonstype: null,
              naturalytelseBortfaltPrÅr: null,
              naturalytelseTilkommetPrÅr: null,
            },
            inntektskategori: { kode: 'JORDBRUKER', kodeverk: 'INNTEKTSKATEGORI' },
            aktivitetStatus: {
              kode: 'SN',
              inntektskategori: { kode: 'SELVSTENDIG_NÆRINGSDRIVENDE', kodeverk: 'INNTEKTSKATEGORI' },
              kodeverk: 'AKTIVITET_STATUS',
            },
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
            andelIArbeid: [0],
          }],
          harPeriodeAarsakGraderingEllerRefusjon: false,
          skalKunneEndreRefusjon: false,
        }],
        arbeidsforholdTilFordeling: [],
      },
    },
    årsinntektVisningstall: 592729,
    dekningsgrad: 100,
  };
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};

export const feil2 = () => {
  const bg = {
    skjaeringstidspunktBeregning: '2020-01-23',
    skjæringstidspunkt: '2020-01-23',
    aktivitetStatus: [{
      kode: 'FL',
      inntektskategori: { kode: 'FRILANSER', kodeverk: 'INNTEKTSKATEGORI' },
      kodeverk: 'AKTIVITET_STATUS',
    }],
    beregningsgrunnlagPeriode: [{
      beregningsgrunnlagPeriodeFom: '2020-01-23',
      beregningsgrunnlagPeriodeTom: '9999-12-31',
      beregnetPrAar: 1791572,
      bruttoPrAar: 1791572,
      bruttoInkludertBortfaltNaturalytelsePrAar: 1791572,
      avkortetPrAar: 599148,
      redusertPrAar: null,
      periodeAarsaker: [],
      dagsats: null,
      beregningsgrunnlagPrStatusOgAndel: [{
        erNyoppstartet: null,
        beregningsgrunnlagFom: '2019-10-01',
        beregningsgrunnlagTom: '2019-12-31',
        aktivitetStatus: { kode: 'FL', inntektskategori: { kode: 'FRILANSER', kodeverk: 'INNTEKTSKATEGORI' }, kodeverk: 'AKTIVITET_STATUS' },
        beregningsperiodeFom: '2019-10-01',
        beregningsperiodeTom: '2019-12-31',
        beregnetPrAar: 1791572,
        fastsattForrigePrAar: null,
        overstyrtPrAar: null,
        bruttoPrAar: 1791572,
        avkortetPrAar: null,
        redusertPrAar: null,
        erTidsbegrensetArbeidsforhold: null,
        erNyIArbeidslivet: null,
        lonnsendringIBeregningsperioden: null,
        andelsnr: 1,
        besteberegningPrAar: null,
        inntektskategori: { kode: 'FRILANSER', kodeverk: 'INNTEKTSKATEGORI' },
        arbeidsforhold: {
          arbeidsgiverNavn: null,
          arbeidsgiverId: null,
          startdato: null,
          opphoersdato: null,
          arbeidsforholdId: null,
          arbeidsforholdType: { kode: 'FRILANS', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: null,
          belopFraInntektsmeldingPrMnd: null,
          organisasjonstype: null,
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        fastsattAvSaksbehandler: false,
        lagtTilAvSaksbehandler: false,
        belopPrMndEtterAOrdningen: 149297.6666666667,
        belopPrAarEtterAOrdningen: null,
        dagsats: null,
        originalDagsatsFraTilstøtendeYtelse: null,
        fordeltPrAar: null,
        erTilkommetAndel: false,
        skalFastsetteGrunnlag: true,
      }],
    }],
    sammenligningsgrunnlag: {
      sammenligningsgrunnlagFom: '2019-01-01',
      sammenligningsgrunnlagTom: '2019-01-01',
      rapportertPrAar: 1015927.27,
      avvikPromille: 763.4845061,
      avvikProsent: 76.34845061,
      sammenligningsgrunnlagType: {
        kode: 'SAMMENLIGNING_ATFL_SN',
        kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE',
      },
      differanseBeregnet: 775644.73,
    },
    sammenligningsgrunnlagPrStatus: [{
      sammenligningsgrunnlagFom: '2019-01-01',
      sammenligningsgrunnlagTom: '2019-01-01',
      rapportertPrAar: 1015927.27,
      avvikPromille: 763.4845061,
      avvikProsent: 76.34845061,
      sammenligningsgrunnlagType: { kode: 'SAMMENLIGNING_ATFL_SN', kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE' },
      differanseBeregnet: 775644.73,
    }],
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
    ledetekstRedusert: 'Redusert beregningsgrunnlag (80%)',
    halvG: 49929.0,
    grunnbeløp: 99858,
    faktaOmBeregning: {
      kortvarigeArbeidsforhold: null,
      frilansAndel: {
        andelsnr: 1,
        arbeidsforhold: {
          arbeidsgiverNavn: null,
          arbeidsgiverId: null,
          startdato: null,
          opphoersdato: null,
          arbeidsforholdId: null,
          arbeidsforholdType: { kode: 'FRILANS', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: null,
          belopFraInntektsmeldingPrMnd: null,
          organisasjonstype: null,
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        inntektskategori: { kode: 'FRILANSER', kodeverk: 'INNTEKTSKATEGORI' },
        aktivitetStatus: null,
        lagtTilAvSaksbehandler: false,
        fastsattAvSaksbehandler: false,
        andelIArbeid: [],
      },
      kunYtelse: null,
      faktaOmBeregningTilfeller: [{ kode: 'VURDER_MOTTAR_YTELSE', kodeverk: 'FAKTA_OM_BEREGNING_TILFELLE' }],
      arbeidstakerOgFrilanserISammeOrganisasjonListe: null,
      arbeidsforholdMedLønnsendringUtenIM: null,
      besteberegningAndeler: null,
      vurderMottarYtelse: {
        erFrilans: true, frilansMottarYtelse: false, frilansInntektPrMnd: 149297.6666666667, arbeidstakerAndelerUtenIM: [],
      },
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [{
          tom: '2020-01-23',
          aktiviteter: [{
            arbeidsgiverNavn: null,
            arbeidsgiverId: null,
            eksternArbeidsforholdId: null,
            fom: '2018-11-26',
            tom: '9999-12-31',
            arbeidsforholdId: null,
            arbeidsforholdType: { kode: 'FRILANS', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            aktørIdString: null,
            skalBrukes: null,
          }],
        }, {
          tom: '2019-11-01',
          aktiviteter: [{
            arbeidsgiverNavn: 'KOMMUNELEGEN I TYSFJORD',
            arbeidsgiverId: '976834887',
            eksternArbeidsforholdId: null,
            fom: '2019-04-29',
            tom: '2019-10-31',
            arbeidsforholdId: null,
            arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            aktørIdString: null,
            skalBrukes: null,
          }],
        }, {
          tom: '2019-06-01',
          aktiviteter: [{
            arbeidsgiverNavn: 'STEIGEN LEGESENTER',
            arbeidsgiverId: '974049759',
            eksternArbeidsforholdId: null,
            fom: '2016-06-01',
            tom: '2019-05-31',
            arbeidsforholdId: null,
            arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            aktørIdString: null,
            skalBrukes: null,
          }],
        }],
      },
      vurderBesteberegning: null,
      andelerForFaktaOmBeregning: [{
        belopReadOnly: 149297.6666666667,
        fastsattBelop: 149297.6666666667,
        inntektskategori: { kode: 'FRILANSER', kodeverk: 'INNTEKTSKATEGORI' },
        aktivitetStatus: { kode: 'FL', inntektskategori: { kode: 'FRILANSER', kodeverk: 'INNTEKTSKATEGORI' }, kodeverk: 'AKTIVITET_STATUS' },
        refusjonskrav: null,
        visningsnavn: 'Frilans',
        arbeidsforhold: {
          arbeidsgiverNavn: null,
          arbeidsgiverId: null,
          startdato: null,
          opphoersdato: null,
          arbeidsforholdId: null,
          arbeidsforholdType: { kode: 'FRILANS', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: null,
          belopFraInntektsmeldingPrMnd: null,
          organisasjonstype: null,
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        andelsnr: 1,
        skalKunneEndreAktivitet: false,
        lagtTilAvSaksbehandler: false,
      }],
      vurderMilitaer: { harMilitaer: false },
      refusjonskravSomKommerForSentListe: null,
    },
    andelerMedGraderingUtenBG: null,
    hjemmel: { kode: 'F_14_7_8_38', kodeverk: 'BG_HJEMMEL' },
    faktaOmFordeling: null,
    årsinntektVisningstall: 1791572,
    dekningsgrad: 80,
  };
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS)}
      submitCallback={action('button-click')}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
      featureToggles={togglesFalse}
    />
  );
};
