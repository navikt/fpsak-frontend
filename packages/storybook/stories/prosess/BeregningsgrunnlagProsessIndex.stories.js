import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';

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

const lagAndel = (aktivitetstatuskode, beregnetPrAar, overstyrtPrAar, erTidsbegrensetArbeidsforhold) => ({
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

const lagPeriodeMedDagsats = (andelsliste, dagsats) => lagPeriode(andelsliste, dagsats, standardFom, standardTom, []);

const lagStandardPeriode = (andelsliste) => lagPeriode(andelsliste, null, standardFom, standardTom, []);

const lagTidsbegrensetPeriode = (andelsliste, fom, tom) => lagPeriode(andelsliste, null, fom, tom, [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }]);

const lagStatus = (kode) => ({
  kode,
  kodeverk: 'AKTIVITET_STATUS',
});

const lagBG = (perioder, statuser) => {
  const beregningsgrunnlag = {
    skjaeringstidspunktBeregning: '2019-09-16',
    aktivitetStatus: statuser,
    beregningsgrunnlagPeriode: perioder,
    sammenligningsgrunnlag: {
      sammenligningsgrunnlagFom: '2018-09-01',
      sammenligningsgrunnlagTom: '2019-08-31',
      rapportertPrAar: 330000,
      avvikPromille: 91,
      avvikProsent: 9,
    },
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

export const arbeidstakerMedAvvik = () => {
  const andeler = [lagAndel('AT', 300000, undefined, false)];
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT')];
  const bg = lagBG(perioder, statuser);
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
  const andeler = [lagAndel('AT', 300000, undefined, false), lagAndel('FL', 130250, undefined, false)];
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT'), lagStatus('FL')];
  const bg = lagBG(perioder, statuser);
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
  const andeler = [lagAndel('MS', 300000, undefined, false)];
  const perioder = [lagPeriodeMedDagsats(andeler, 1234)];
  const statuser = [lagStatus('MS')];
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

  const bg = lagBG(perioder, statuser);
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
  const bg = lagBG(perioder, statuser);
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
  const andeler = [lagAndel('SN', 300000, undefined, undefined), lagAndel('AT', 130250, undefined, undefined), lagAndel('FL', 130250, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 154985;
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT_FL_SN')];
  const bg = lagBG(perioder, statuser);
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

export const graderingPåBeregningsgrunnlagUtenPenger = () => {
  const andeler = [lagAndel('SN', 300000, undefined, undefined), lagAndel('AT', 130250, undefined, undefined), lagAndel('FL', 130250, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 154985;
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT_FL_SN')];
  const bg = lagBG(perioder, statuser);
  bg.andelerMedGraderingUtenBG = [lagAndel('AT', 0, 0, false)];
  return (
    <BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={bg}
      aksjonspunkter={lagAPMedKode(aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG)}
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
export const arbeidstakerFrilanserOgSelvstendigNæringsdrivendeRedesign = () => {
  const andeler = [lagAndel('SN', 300000, undefined, undefined), lagAndel('AT', 130250, undefined, undefined), lagAndel('FL', 130250, undefined, undefined)];
  const pgi = lagPGIVerdier();
  andeler[0].pgiVerdier = pgi;
  andeler[0].pgiSnitt = 154985;
  const perioder = [lagStandardPeriode(andeler)];
  const statuser = [lagStatus('AT_FL_SN')];
  const bg = lagBG(perioder, statuser);
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
  const bg = lagBG(perioder, statuser);
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
