import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import UttakFaktaIndex from '@fpsak-frontend/fakta-uttak';

import withReduxProvider from '../../decorators/withRedux';

const alleKodeverk = require('../mocks/alleKodeverk.json'); // eslint-disable-line

const aksjonspunkter = [
  {
    definisjon: {
      kode: '5070',
      kodeverk: 'AKSJONSPUNKT_DEF',
    },
    status: {
      kode: 'OPPR',
      kodeverk: 'AKSJONSPUNKT_STATUS',
    },
    begrunnelse: null,
    vilkarType: null,
    toTrinnsBehandling: false,
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

const uttakKontrollerFaktaPerioder = {
  perioder: [
    {
      tom: '2019-10-31',
      fom: '2019-10-11',
      uttakPeriodeType: {
        kode: 'FORELDREPENGER_FØR_FØDSEL',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseÅrsak: {
        kode: '-',
        kodeverk: 'UTSETTELSE_AARSAK_TYPE',
      },
      overføringÅrsak: {
        kode: '-',
        kodeverk: 'OVERFOERING_AARSAK_TYPE',
      },
      oppholdÅrsak: {
        kode: '-',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      resultat: {
        kode: 'PERIODE_OK',
        kodeverk: 'UTTAK_PERIODE_VURDERING_TYPE',
      },
      dokumentertePerioder: [],
      arbeidstidsprosent: null,
      begrunnelse: null,
      bekreftet: true,
      arbeidsgiver: null,
      erArbeidstaker: false,
      erFrilanser: false,
      erSelvstendig: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      flerbarnsdager: false,
      morsAktivitet: {
        kode: '-',
        kodeverk: 'MORS_AKTIVITET',
      },
      periodeKilde: {
        kode: 'SØKNAD',
        kodeverk: 'FORDELING_PERIODE_KILDE',
      },
    },
    {
      tom: '2020-01-31',
      fom: '2019-11-01',
      uttakPeriodeType: {
        kode: 'MØDREKVOTE',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseÅrsak: {
        kode: '-',
        kodeverk: 'UTSETTELSE_AARSAK_TYPE',
      },
      overføringÅrsak: {
        kode: '-',
        kodeverk: 'OVERFOERING_AARSAK_TYPE',
      },
      oppholdÅrsak: {
        kode: '-',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      resultat: {
        kode: 'PERIODE_OK',
        kodeverk: 'UTTAK_PERIODE_VURDERING_TYPE',
      },
      dokumentertePerioder: [],
      arbeidstidsprosent: null,
      begrunnelse: null,
      bekreftet: true,
      arbeidsgiver: null,
      erArbeidstaker: false,
      erFrilanser: false,
      erSelvstendig: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      flerbarnsdager: false,
      morsAktivitet: {
        kode: '-',
        kodeverk: 'MORS_AKTIVITET',
      },
      periodeKilde: {
        kode: 'SØKNAD',
        kodeverk: 'FORDELING_PERIODE_KILDE',
      },
    },
    {
      tom: '2020-02-27',
      fom: '2020-02-03',
      uttakPeriodeType: {
        kode: '-',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseÅrsak: {
        kode: 'ARBEID',
        kodeverk: 'UTSETTELSE_AARSAK_TYPE',
      },
      overføringÅrsak: {
        kode: '-',
        kodeverk: 'OVERFOERING_AARSAK_TYPE',
      },
      oppholdÅrsak: {
        kode: '-',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      resultat: {
        kode: 'PERIODE_OK',
        kodeverk: 'UTTAK_PERIODE_VURDERING_TYPE',
      },
      dokumentertePerioder: [],
      arbeidstidsprosent: null,
      begrunnelse: null,
      bekreftet: true,
      arbeidsgiver: null,
      erArbeidstaker: true,
      erFrilanser: false,
      erSelvstendig: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      flerbarnsdager: false,
      morsAktivitet: {
        kode: '-',
        kodeverk: 'MORS_AKTIVITET',
      },
      periodeKilde: {
        kode: 'SØKNAD',
        kodeverk: 'FORDELING_PERIODE_KILDE',
      },
    },
    {
      tom: '2020-06-04',
      fom: '2020-02-28',
      uttakPeriodeType: {
        kode: 'FELLESPERIODE',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseÅrsak: {
        kode: '-',
        kodeverk: 'UTSETTELSE_AARSAK_TYPE',
      },
      overføringÅrsak: {
        kode: '-',
        kodeverk: 'OVERFOERING_AARSAK_TYPE',
      },
      oppholdÅrsak: {
        kode: '-',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      resultat: {
        kode: 'PERIODE_OK',
        kodeverk: 'UTTAK_PERIODE_VURDERING_TYPE',
      },
      dokumentertePerioder: [],
      arbeidstidsprosent: null,
      begrunnelse: null,
      bekreftet: true,
      arbeidsgiver: null,
      erArbeidstaker: false,
      erFrilanser: false,
      erSelvstendig: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      flerbarnsdager: false,
      morsAktivitet: {
        kode: '-',
        kodeverk: 'MORS_AKTIVITET',
      },
      periodeKilde: {
        kode: 'SØKNAD',
        kodeverk: 'FORDELING_PERIODE_KILDE',
      },
    },
    {
      tom: '2020-06-18',
      fom: '2020-06-12',
      uttakPeriodeType: {
        kode: 'ANNET',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseÅrsak: {
        kode: '-',
        kodeverk: 'UTSETTELSE_AARSAK_TYPE',
      },
      overføringÅrsak: {
        kode: '-',
        kodeverk: 'OVERFOERING_AARSAK_TYPE',
      },
      oppholdÅrsak: {
        kode: 'UTTAK_FEDREKVOTE_ANNEN_FORELDER',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      resultat: {
        kode: 'PERIODE_OK',
        kodeverk: 'UTTAK_PERIODE_VURDERING_TYPE',
      },
      dokumentertePerioder: [],
      arbeidstidsprosent: null,
      begrunnelse: null,
      bekreftet: true,
      arbeidsgiver: null,
      erArbeidstaker: false,
      erFrilanser: false,
      erSelvstendig: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      flerbarnsdager: false,
      morsAktivitet: {
        kode: '-',
        kodeverk: 'MORS_AKTIVITET',
      },
      periodeKilde: {
        kode: 'SØKNAD',
        kodeverk: 'FORDELING_PERIODE_KILDE',
      },
    },
    {
      tom: '2020-06-25',
      fom: '2020-06-19',
      uttakPeriodeType: {
        kode: 'FELLESPERIODE',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseÅrsak: {
        kode: '-',
        kodeverk: 'UTSETTELSE_AARSAK_TYPE',
      },
      overføringÅrsak: {
        kode: '-',
        kodeverk: 'OVERFOERING_AARSAK_TYPE',
      },
      oppholdÅrsak: {
        kode: '-',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      resultat: {
        kode: 'PERIODE_OK',
        kodeverk: 'UTTAK_PERIODE_VURDERING_TYPE',
      },
      dokumentertePerioder: [],
      arbeidstidsprosent: null,
      begrunnelse: null,
      bekreftet: true,
      arbeidsgiver: null,
      erArbeidstaker: false,
      erFrilanser: false,
      erSelvstendig: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      flerbarnsdager: false,
      morsAktivitet: {
        kode: '-',
        kodeverk: 'MORS_AKTIVITET',
      },
      periodeKilde: {
        kode: 'SØKNAD',
        kodeverk: 'FORDELING_PERIODE_KILDE',
      },
    },
    {
      tom: '2020-06-11',
      fom: '2020-06-05',
      uttakPeriodeType: {
        kode: 'FEDREKVOTE',
        kodeverk: 'UTTAK_PERIODE_TYPE',
      },
      utsettelseÅrsak: {
        kode: '-',
        kodeverk: 'UTSETTELSE_AARSAK_TYPE',
      },
      overføringÅrsak: {
        kode: 'INSTITUSJONSOPPHOLD_ANNEN_FORELDER',
        kodeverk: 'OVERFOERING_AARSAK_TYPE',
      },
      oppholdÅrsak: {
        kode: '-',
        kodeverk: 'OPPHOLD_AARSAK_TYPE',
      },
      resultat: {
        kode: 'PERIODE_IKKE_VURDERT',
        kodeverk: 'UTTAK_PERIODE_VURDERING_TYPE',
      },
      dokumentertePerioder: [],
      arbeidstidsprosent: null,
      begrunnelse: null,
      bekreftet: false,
      arbeidsgiver: null,
      erArbeidstaker: false,
      erFrilanser: false,
      erSelvstendig: false,
      samtidigUttak: false,
      samtidigUttaksprosent: null,
      flerbarnsdager: false,
      morsAktivitet: {
        kode: '-',
        kodeverk: 'MORS_AKTIVITET',
      },
      periodeKilde: {
        kode: 'SØKNAD',
        kodeverk: 'FORDELING_PERIODE_KILDE',
      },
    },
  ],
};

const behandling = {
  id: 1,
  versjon: 1,
  type: {
    kode: 'BT-002',
    kodeverk: 'BEHANDLING_TYPE',
  },
  behandlingArsaker: [
    {
      erAutomatiskRevurdering: false,
      behandlingArsakType: {
        kode: 'RE-END-INNTEKTSMELD',
        kodeverk: 'BEHANDLING_AARSAK',
      },
      manueltOpprettet: false,
    },
  ],
  status: {
    kode: 'UTRED',
    kodeverk: 'BEHANDLING_STATUS',
  },
  behandlingPaVent: false,
};

const ytelsefordeling = {
  ikkeOmsorgPerioder: null,
  aleneOmsorgPerioder: null,
  annenforelderHarRettDto: {
    annenforelderHarRett: null,
    begrunnelse: null,
    annenforelderHarRettPerioder: null,
  },
  endringsdato: '2019-10-11',
  gjeldendeDekningsgrad: 100,
  førsteUttaksdato: '2019-10-11',
};

const faktaArbeidsforhold = [
  {
    arbeidsgiver: {
      identifikator: '973861778',
      aktørId: null,
      fødselsdato: null,
      navn: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
      virksomhet: true,
    },
    arbeidType: {
      kode: 'ORDINÆRT_ARBEID',
      kodeverk: 'UTTAK_ARBEID_TYPE',
    },
  },
];

const personopplysninger = {
  navBrukerKjonn: {
    kode: 'K',
    kodeverk: 'BRUKER_KJOENN',
  },
};

const familiehendelse = {
  gjeldende: {
    skjaringstidspunkt: '2019-11-01',
    avklartBarn: [
      {
        fodselsdato: '2019-11-01',
        dodsdato: null,
      },
    ],
    brukAntallBarnFraTps: false,
    dokumentasjonForeligger: true,
    termindato: '2019-11-01',
    antallBarnTermin: 1,
    utstedtdato: null,
    morForSykVedFodsel: null,
    vedtaksDatoSomSvangerskapsuke: null,
  },
};

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/fakta-uttak',
  component: UttakFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visKompleksFaktaOmUttak = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.UTTAK]);
  const readOnly = false;
  const visKompleksYtelsefordeling = { ...ytelsefordeling };

  return (
    <UttakFaktaIndex
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      shouldOpenDefaultInfoPanels={false}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      ytelsefordeling={object('ytelsefordeling', visKompleksYtelsefordeling)}
      uttakKontrollerFaktaPerioder={uttakKontrollerFaktaPerioder}
      alleKodeverk={alleKodeverk}
      faktaArbeidsforhold={faktaArbeidsforhold}
      personopplysninger={personopplysninger}
      familiehendelse={familiehendelse}
      readOnly={boolean('readOnly', readOnly)}
      kanOverstyre={false}
    />
  );
};
