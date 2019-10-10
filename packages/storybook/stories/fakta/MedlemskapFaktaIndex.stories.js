import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
  },
  behandlingPaaVent: false,
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
      opplysningsKilde: {
        kode: 'TPS',
        kodeverk: 'OPPLYSNINGSKILDE',
      },
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
      opplysningsKilde: {
        kode: 'TPS',
        kodeverk: 'OPPLYSNINGSKILDE',
      },
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

const alleKodeverk = {
  [kodeverkTyper.MEDLEMSKAP_DEKNING]: [{
    kode: 'FTL_2_6',
    navn: 'Folketrygdloven § 2-6',
  }],
  [kodeverkTyper.MEDLEMSKAP_TYPE]: [{
    kode: 'ENDELIG',
    navn: 'Endelig',
  }],
  [kodeverkTyper.MEDLEMSKAP_MANUELL_VURDERING_TYPE]: [{
    kode: 'MEDLEM',
    navn: 'Medlem',
  }, {
    kode: 'UNNTAK',
    navn: 'Unntak',
  }, {
    kode: 'IKKE_RELEVANT',
    navn: 'Ikke relevant',
  }],
  [kodeverkTyper.PERSONSTATUS_TYPE]: [{
    kode: 'BOSA',
    navn: 'Bosatt',
    kodeverk: 'PERSONSTATUS_TYPE',
  }],
  [kodeverkTyper.SIVILSTAND_TYPE]: [{
    kode: 'UGIF',
    navn: 'Ugift',
    kodeverk: 'SIVILSTAND_TYPE',
  }],
  [kodeverkTyper.REGION]: [{
    kode: 'NORDEN',
    navn: 'Norden',
    kodeverk: 'REGION',
  }],
};

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/MedlemskapFaktaIndex',
  component: MedlemskapFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForAvklaringAvStartdatoForForeldrepengerperioden = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.MEDLEMSKAPSVILKARET]);
  return (
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
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      readOnlyBehandling={boolean('readOnly', false)}
    />
  );
};

export const visAksjonspunktForAlleAndreMedlemskapsaksjonspunkter = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.MEDLEMSKAPSVILKARET]);
  return (
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
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      readOnlyBehandling={boolean('readOnly', false)}
    />
  );
};
