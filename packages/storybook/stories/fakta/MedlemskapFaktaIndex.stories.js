import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
  },
  behandlingPaaVent: false,
  status: behandlingStatus.OPPRETTET,
};

const soknad = {
  oppgittFordeling: {
    startDatoForPermisjon: '2019-01-01',
  },
  oppgittTilknytning: {
    oppholdNorgeNa: true,
    oppholdNestePeriode: true,
    oppholdSistePeriode: true,
    utlandsoppholdFor: [{
      landNavn: 'SVERIGE',
      fom: '2010-01-01',
      tom: '2011-01-01',
    }],
    utlandsoppholdEtter: [{
      landNavn: 'DANMARK',
      fom: '2018-01-01',
      tom: '2019-01-01',
    }],
  },
};

const inntektArbeidYtelse = {
  inntektsmeldinger: [{
    arbeidsgiverStartdato: '2019-02-02',
    arbeidsgiver: 'Studio Espen',
  }, {
    arbeidsgiverStartdato: '2019-02-03',
    arbeidsgiver: 'Auto Joachim bilpleie',
  }],
};
const medlemskap = {
  inntekt: [{
    navn: 'MYGG ROBUST',
    utbetaler: '973861778',
    fom: '2018-09-01',
    tom: '2018-09-30',
    ytelse: false,
    belop: 35000,
  }, {
    navn: 'MYGG ROBUST',
    utbetaler: '973861778',
    fom: '2019-02-01',
    tom: '2019-02-28',
    ytelse: false,
    belop: 35000,
  }],
  medlemskapPerioder: [{
    fom: '2019-01-01',
    tom: '2021-10-13',
    medlemskapType: {
      kode: 'AVKLARES',
      kodeverk: 'MEDLEMSKAP_TYPE',
    },
    dekningType: {
      kode: 'OPPHOR',
      kodeverk: 'MEDLEMSKAP_DEKNING',
    },
    kildeType: {
      kode: 'FS22',
      kodeverk: 'MEDLEMSKAP_KILDE',
    },
    beslutningsdato: null,
  }],
  perioder: [{
    vurderingsdato: '2019-11-07',
    personopplysninger: {
      fnr: null,
      aktoerId: '1615078487209',
      diskresjonskode: null,
      nummer: null,
      navBrukerKjonn: {
        kode: 'K',
        kodeverk: 'BRUKER_KJOENN',
      },
      statsborgerskap: {
        kode: 'NOR',
        kodeverk: 'LANDKODER',
        navn: 'Norge',
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        overstyrtPersonstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
      },
      personstatus: {
        kode: 'BOSA',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      sivilstand: {
        kode: 'UGIF',
        kodeverk: 'SIVILSTAND_TYPE',
      },
      navn: 'Mygg Robust',
      dodsdato: null,
      fodselsdato: '1966-08-02',
      adresser: [{
        adresseType: {
          kode: 'BOSTEDSADRESSE',
          kodeverk: 'ADRESSE_TYPE',
        },
        mottakerNavn: 'Mygg Robust',
        adresselinje1: 'Skogvegen 3',
        adresselinje2: null,
        adresselinje3: null,
        postNummer: '4353',
        poststed: 'Klepp Stasjon',
        land: 'NOR',
      }],
      region: {
        kode: 'NORDEN',
        kodeverk: 'REGION',
      },
      annenPart: null,
      ektefelle: null,
      barn: [],
      barnSoktFor: [],
      barnFraTpsRelatertTilSoknad: [],
      harVerge: false,
    },
    aksjonspunkter: [
      '5021',
    ],
    årsaker: [
      'SKJÆRINGSTIDSPUNKT',
    ],
    oppholdsrettVurdering: null,
    erEosBorger: null,
    lovligOppholdVurdering: null,
    bosattVurdering: null,
    medlemskapManuellVurderingType: null,
    begrunnelse: null,
  }, {
    vurderingsdato: '2018-11-07',
    personopplysninger: {
      fnr: null,
      aktoerId: '1615078487209',
      diskresjonskode: null,
      nummer: null,
      navBrukerKjonn: {
        kode: 'K',
        kodeverk: 'BRUKER_KJOENN',
      },
      statsborgerskap: {
        kode: 'NOR',
        kodeverk: 'LANDKODER',
        navn: 'Norge',
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        overstyrtPersonstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
      },
      personstatus: {
        kode: 'BOSA',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      sivilstand: {
        kode: 'UGIF',
        kodeverk: 'SIVILSTAND_TYPE',
      },
      navn: 'Mygg Robust',
      dodsdato: null,
      fodselsdato: '1966-08-02',
      adresser: [],
      region: {
        kode: 'NORDEN',
        kodeverk: 'REGION',
      },
      annenPart: null,
      ektefelle: null,
      barn: [],
      barnSoktFor: [],
      barnFraTpsRelatertTilSoknad: [],
      harVerge: false,
    },
    aksjonspunkter: [
      '5021',
    ],
    årsaker: [
      'SKJÆRINGSTIDSPUNKT',
    ],
    oppholdsrettVurdering: null,
    erEosBorger: null,
    lovligOppholdVurdering: null,
    bosattVurdering: null,
    medlemskapManuellVurderingType: null,
    begrunnelse: null,
  }],
};
const fagsakPerson = {};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-medlemskap',
  component: MedlemskapFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForAvklaringAvStartdatoForForeldrepengerperioden = () => (
  <MedlemskapFaktaIndex
    behandling={object('behandling', behandling)}
    medlemskap={object('medlemskap', medlemskap)}
    medlemskapV2={object('medlemskap', medlemskap)}
    soknad={object('soknad', soknad)}
    inntektArbeidYtelse={object('inntektArbeidYtelse', inntektArbeidYtelse)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    fagsakPerson={object('fagsakPerson', fagsakPerson)}
    isForeldrepengerFagsak={boolean('isForeldrepengerFagsak', true)}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlyBehandling={boolean('readOnly', false)}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
  />
);

export const visAksjonspunktForAlleAndreMedlemskapsaksjonspunkter = () => (
  <MedlemskapFaktaIndex
    behandling={object('behandling', behandling)}
    medlemskap={object('medlemskap', medlemskap)}
    medlemskapV2={object('medlemskap', medlemskap)}
    soknad={object('soknad', soknad)}
    inntektArbeidYtelse={object('inntektArbeidYtelse', inntektArbeidYtelse)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }, {
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }, {
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }, {
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    fagsakPerson={object('fagsakPerson', fagsakPerson)}
    isForeldrepengerFagsak={boolean('isForeldrepengerFagsak', true)}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      [aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      [aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlyBehandling={boolean('readOnly', false)}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
  />
);
