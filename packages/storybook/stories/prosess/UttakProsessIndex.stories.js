import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import UttakProsessIndex from '@fpsak-frontend/prosess-uttak';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

export default {
  title: 'prosess/prosess-uttak',
  component: UttakProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

const aksjonspunkter = [
  {
    definisjon: {
      kode: '5071',
      kodeverk: 'AKSJONSPUNKT_DEF',
    },
    status: {
      kode: 'OPPR',
      kodeverk: 'AKSJONSPUNKT_STATUS',
    },
    begrunnelse: null,
    vilkarType: null,
    toTrinnsBehandling: true,
    toTrinnsBehandlingGodkjent: null,
    vurderPaNyttArsaker: null,
    besluttersBegrunnelse: null,
    aksjonspunktType: {
      kode: 'MANU',
      kodeverk: 'AKSJONSPUNKT_TYPE',
    },
    kanLoses: true,
    erAktivt: true,
    fristTid: null,
  },
];

const fagsak = {
  saksnummer: 1,
};

const familiehendelse = {
  gjeldende: {
    skjaringstidspunkt: '2019-11-04',
    avklartBarn: [
      {
        fodselsdato: '2019-11-04',
        dodsdato: null,
      },
    ],
    brukAntallBarnFraTps: null,
    dokumentasjonForeligger: null,
    termindato: null,
    antallBarnTermin: null,
    utstedtdato: null,
    morForSykVedFodsel: null,
    vedtaksDatoSomSvangerskapsuke: null,
  },
};

const behandling = {
  id: 1,
  versjon: 1,
  type: {
    kode: 'BT-002',
    kodeverk: 'BEHANDLING_TYPE',
  },
  behandlingsresultat: {
    skjaeringstidspunktForeldrepenger: '2019-10-14',
  },
  status: {
    kode: 'UTRED',
    kodeverk: 'BEHANDLING_STATUS',
  },
  sprakkode: {
    kode: '-',
    kodeverk: 'SPRAAK_KODE',
  },
};

const uttakStonadskontoer = {
  maksDatoUttak: null,
  stonadskontoer: {
    FEDREKVOTE: {
      stonadskontotype: 'FEDREKVOTE',
      maxDager: 75,
      saldo: 50,
      aktivitetSaldoDtoList: [
        {
          aktivitetIdentifikator: {
            uttakArbeidType: {
              kode: 'ORDINÆRT_ARBEID',
              kodeverk: 'UTTAK_ARBEID_TYPE',
            },
            arbeidsgiver: {
              identifikator: '910909088',
              aktørId: null,
              fødselsdato: null,
              navn: 'BEDRIFT AS',
              virksomhet: true,
            },
            arbeidsforholdId: null,
          },
          saldo: 50,
        },
      ],
      gyldigForbruk: true,
      kontoUtvidelser: null,
    },
    MØDREKVOTE: {
      stonadskontotype: 'MØDREKVOTE',
      maxDager: 75,
      saldo: 35,
      aktivitetSaldoDtoList: [
        {
          aktivitetIdentifikator: {
            uttakArbeidType: {
              kode: 'ORDINÆRT_ARBEID',
              kodeverk: 'UTTAK_ARBEID_TYPE',
            },
            arbeidsgiver: {
              identifikator: '910909088',
              aktørId: null,
              fødselsdato: null,
              navn: 'BEDRIFT AS',
              virksomhet: true,
            },
            arbeidsforholdId: null,
          },
          saldo: 35,
        },
      ],
      gyldigForbruk: true,
      kontoUtvidelser: null,
    },
    FELLESPERIODE: {
      stonadskontotype: 'FELLESPERIODE',
      maxDager: 80,
      saldo: 80,
      aktivitetSaldoDtoList: [
        {
          aktivitetIdentifikator: {
            uttakArbeidType: {
              kode: 'ORDINÆRT_ARBEID',
              kodeverk: 'UTTAK_ARBEID_TYPE',
            },
            arbeidsgiver: {
              identifikator: '910909088',
              aktørId: null,
              fødselsdato: null,
              navn: 'BEDRIFT AS',
              virksomhet: true,
            },
            arbeidsforholdId: null,
          },
          saldo: 80,
        },
      ],
      gyldigForbruk: true,
      kontoUtvidelser: null,
    },
    FORELDREPENGER_FØR_FØDSEL: {
      stonadskontotype: 'FORELDREPENGER_FØR_FØDSEL',
      maxDager: 15,
      saldo: 0,
      aktivitetSaldoDtoList: [
        {
          aktivitetIdentifikator: {
            uttakArbeidType: {
              kode: 'ORDINÆRT_ARBEID',
              kodeverk: 'UTTAK_ARBEID_TYPE',
            },
            arbeidsgiver: {
              identifikator: '910909088',
              aktørId: null,
              fødselsdato: null,
              navn: 'BEDRIFT AS',
              virksomhet: true,
            },
            arbeidsforholdId: null,
          },
          saldo: 0,
        },
      ],
      gyldigForbruk: true,
      kontoUtvidelser: null,
    },
  },
};

const uttaksresultatPerioder = {
  perioderSøker: [
    {
      fom: '2019-10-14',
      tom: '2019-11-03',
      aktiviteter: [
        {
          stønadskontoType: {
            kode: 'FORELDREPENGER_FØR_FØDSEL',
            kodeverk: 'STOENADSKONTOTYPE',
          },
          prosentArbeid: 0,
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsgiver: {
            identifikator: '910909088',
            aktørId: null,
            fødselsdato: null,
            navn: 'BEDRIFT AS',
            virksomhet: true,
          },
          utbetalingsgrad: 100,
          uttakArbeidType: {
            kode: 'ORDINÆRT_ARBEID',
            kodeverk: 'UTTAK_ARBEID_TYPE',
          },
          gradering: false,
          trekkdagerDesimaler: 15,
          trekkdager: null,
        },
      ],
      periodeResultatType: {
        kode: 'INNVILGET',
        kodeverk: 'PERIODE_RESULTAT_TYPE',
      },
      begrunnelse: null,
      periodeResultatÅrsak: {
        kode: '2006',
        navn: '§14-10: Innvilget foreldrepenger før fødsel',
        kodeverk: 'INNVILGET_AARSAK',
        gyldigFom: '2000-01-01',
        gyldigTom: '9999-12-31',
      },
      manuellBehandlingÅrsak: {
        kode: '-',
        kodeverk: 'MANUELL_BEHANDLING_AARSAK',
      },
      graderingAvslagÅrsak: {
        kode: '-',
        navn: 'Ikke definert',
        kodeverk: 'GRADERING_AVSLAG_AARSAK',
        gyldigFom: '2001-01-01',
        gyldigTom: '9999-12-31',
      },
      flerbarnsdager: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      graderingInnvilget: false,
      periodeType: {
        kode: 'FORELDREPENGER_FØR_FØDSEL',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseType: {
        kode: '-',
        kodeverk: 'UTTAK_UTSETTELSE_TYPE',
      },
      oppholdÅrsak: {
        kode: '-',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      graderingsAvslagÅrsakLovhjemmel: null,
      gradertAktivitet: null,
      periodeResultatÅrsakLovhjemmel: '{"fagsakYtelseType": {"FP": {"lovreferanse": "14-10"}}}',
    },
    {
      fom: '2019-11-04',
      tom: '2019-12-15',
      aktiviteter: [
        {
          stønadskontoType: {
            kode: 'MØDREKVOTE',
            kodeverk: 'STOENADSKONTOTYPE',
          },
          prosentArbeid: 0,
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsgiver: {
            identifikator: '910909088',
            aktørId: null,
            fødselsdato: null,
            navn: 'BEDRIFT AS',
            virksomhet: true,
          },
          utbetalingsgrad: 100,
          uttakArbeidType: {
            kode: 'ORDINÆRT_ARBEID',
            kodeverk: 'UTTAK_ARBEID_TYPE',
          },
          gradering: false,
          trekkdagerDesimaler: 30,
          trekkdager: null,
        },
      ],
      periodeResultatType: {
        kode: 'INNVILGET',
        kodeverk: 'PERIODE_RESULTAT_TYPE',
      },
      begrunnelse: null,
      periodeResultatÅrsak: {
        kode: '2003',
        navn: '§14-12: Innvilget uttak av kvote',
        kodeverk: 'INNVILGET_AARSAK',
        gyldigFom: '2000-01-01',
        gyldigTom: '9999-12-31',
      },
      manuellBehandlingÅrsak: {
        kode: '-',
        kodeverk: 'MANUELL_BEHANDLING_AARSAK',
      },
      graderingAvslagÅrsak: {
        kode: '-',
        navn: 'Ikke definert',
        kodeverk: 'GRADERING_AVSLAG_AARSAK',
        gyldigFom: '2001-01-01',
        gyldigTom: '9999-12-31',
      },
      flerbarnsdager: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      graderingInnvilget: false,
      periodeType: {
        kode: 'MØDREKVOTE',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseType: {
        kode: '-',
        kodeverk: 'UTTAK_UTSETTELSE_TYPE',
      },
      oppholdÅrsak: {
        kode: '-',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      graderingsAvslagÅrsakLovhjemmel: null,
      gradertAktivitet: null,
      periodeResultatÅrsakLovhjemmel: '{"fagsakYtelseType": {"FP": {"lovreferanse": "14-12"}}}',
    },
    {
      fom: '2019-12-16',
      tom: '2019-12-29',
      aktiviteter: [
        {
          stønadskontoType: {
            kode: 'MØDREKVOTE',
            kodeverk: 'STOENADSKONTOTYPE',
          },
          prosentArbeid: 0,
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsgiver: {
            identifikator: '910909088',
            aktørId: null,
            fødselsdato: null,
            navn: 'BEDRIFT AS',
            virksomhet: true,
          },
          utbetalingsgrad: 100,
          uttakArbeidType: {
            kode: 'ORDINÆRT_ARBEID',
            kodeverk: 'UTTAK_ARBEID_TYPE',
          },
          gradering: false,
          trekkdagerDesimaler: 10,
          trekkdager: null,
        },
      ],
      periodeResultatType: {
        kode: 'INNVILGET',
        kodeverk: 'PERIODE_RESULTAT_TYPE',
      },
      begrunnelse: null,
      periodeResultatÅrsak: {
        kode: '2003',
        navn: '§14-12: Innvilget uttak av kvote',
        kodeverk: 'INNVILGET_AARSAK',
        gyldigFom: '2000-01-01',
        gyldigTom: '9999-12-31',
      },
      manuellBehandlingÅrsak: {
        kode: '-',
        kodeverk: 'MANUELL_BEHANDLING_AARSAK',
      },
      graderingAvslagÅrsak: {
        kode: '-',
        navn: 'Ikke definert',
        kodeverk: 'GRADERING_AVSLAG_AARSAK',
        gyldigFom: '2001-01-01',
        gyldigTom: '9999-12-31',
      },
      flerbarnsdager: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      graderingInnvilget: false,
      periodeType: {
        kode: 'MØDREKVOTE',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseType: {
        kode: '-',
        kodeverk: 'UTTAK_UTSETTELSE_TYPE',
      },
      oppholdÅrsak: {
        kode: '-',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      graderingsAvslagÅrsakLovhjemmel: null,
      gradertAktivitet: null,
      periodeResultatÅrsakLovhjemmel: '{"fagsakYtelseType": {"FP": {"lovreferanse": "14-12"}}}',
    },
    {
      fom: '2019-12-30',
      tom: '2020-02-02',
      aktiviteter: [
        {
          stønadskontoType: {
            kode: 'FEDREKVOTE',
            kodeverk: 'STOENADSKONTOTYPE',
            navn: 'Fedrekvote',
          },
          prosentArbeid: 0,
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsgiver: {
            identifikator: '910909088',
            aktørId: null,
            fødselsdato: null,
            navn: 'BEDRIFT AS',
            virksomhet: true,
          },
          utbetalingsgrad: null,
          uttakArbeidType: {
            kode: 'ORDINÆRT_ARBEID',
            kodeverk: 'UTTAK_ARBEID_TYPE',
          },
          gradering: false,
          trekkdagerDesimaler: 25,
          trekkdager: null,
        },
      ],
      periodeResultatType: {
        kode: 'MANUELL_BEHANDLING',
        kodeverk: 'PERIODE_RESULTAT_TYPE',
      },
      begrunnelse: null,
      periodeResultatÅrsak: {
        kode: '4007',
        navn: '§14-12 tredje ledd: Den andre part syk/skadet ikke oppfylt',
        kodeverk: 'IKKE_OPPFYLT_AARSAK',
        gyldigFom: '2000-01-01',
        gyldigTom: '9999-12-31',
      },
      manuellBehandlingÅrsak: {
        kode: '5002',
        kodeverk: 'MANUELL_BEHANDLING_AARSAK',
      },
      graderingAvslagÅrsak: {
        kode: '-',
        navn: 'Ikke definert',
        kodeverk: 'GRADERING_AVSLAG_AARSAK',
        gyldigFom: '2001-01-01',
        gyldigTom: '9999-12-31',
      },
      flerbarnsdager: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      graderingInnvilget: false,
      periodeType: {
        kode: 'FEDREKVOTE',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseType: {
        kode: '-',
        kodeverk: 'UTTAK_UTSETTELSE_TYPE',
      },
      oppholdÅrsak: {
        kode: '-',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      graderingsAvslagÅrsakLovhjemmel: null,
      gradertAktivitet: null,
      periodeResultatÅrsakLovhjemmel: '{"fagsakYtelseType": {"FP": {"lovreferanse": "14-12"}}}',
    },
  ],
  perioderAnnenpart: [],
  annenForelderHarRett: true,
  aleneomsorg: false,
};

const uttakPeriodeGrense = {
  mottattDato: '2019-11-18',
  soknadsfristForForsteUttaksdato: '2020-01-31',
  soknadsperiodeStart: '2019-10-14',
  soknadsperiodeSlutt: '2020-02-02',
  antallDagerLevertForSent: -74,
};

const soknad = {
  soknadType: {
    kode: 'ST-001',
  },
  mottattDato: '2019-11-18',
  dekningsgrad: 100,
  termindato: null,
  fodselsdatoer: {
    1: '2019-11-04',
  },
};

const personopplysninger = {
  navBrukerKjonn: {
    kode: 'K',
    kodeverk: 'BRUKER_KJOENN',
  },
  dodsdato: null,
  annenPart: null,
};

const ytelsefordeling = {
  ikkeOmsorgPerioder: null,
  aleneOmsorgPerioder: null,
  annenforelderHarRettDto: {
    annenforelderHarRett: null,
    begrunnelse: null,
    annenforelderHarRettPerioder: null,
  },
  endringsdato: '2019-10-14',
  gjeldendeDekningsgrad: 100,
  førsteUttaksdato: '2019-10-14',
};

export const visProsessUttak = () => (
  <UttakProsessIndex
    fagsak={fagsak}
    behandling={behandling}
    uttaksresultatPerioder={uttaksresultatPerioder}
    uttakStonadskontoer={uttakStonadskontoer}
    aksjonspunkter={aksjonspunkter}
    familiehendelse={familiehendelse}
    soknad={soknad}
    personopplysninger={personopplysninger}
    uttakPeriodeGrense={uttakPeriodeGrense}
    ytelsefordeling={ytelsefordeling}
    alleKodeverk={alleKodeverk}
    employeeHasAccess={boolean('employeeHasAccess', true)}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    tempUpdateStonadskontoer={action('button-click')}
    isAksjonspunktOpen={boolean('isAksjonspunktOpen', true)}
  />
);
