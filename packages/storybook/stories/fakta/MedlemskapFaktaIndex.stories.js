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
  fom: '2019-01-01',
  perioder: [{
    aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
    personopplysninger: {
      annenPart: {},
    },
    vurderingsdato: '2019-02-03',
    årsaker: ['SKJÆRINGSTIDSPUNKT', 'STATSBORGERSKAP'],
  }],
  inntekt: [{
    navn: 'Espen Utvikler',
    utbetaler: 'NAV',
    fom: '2019-01-01',
    tom: '2019-03-01',
    ytelse: true,
    belop: 20000,
  }],
  medlemskapPerioder: [{
    fom: '2019-01-01',
    tom: '2019-03-01',
    medlemskapType: {
      kode: 'ENDELIG',
      kodeverk: 'MEDLEMSKAP_TYPE',
    },
    dekningType: {
      kode: 'FTL_2_6',
      kodeverk: 'MEDLEMSKAP_DEKNING',
    },
    beslutningsdato: '2019-02-02',
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
    />
  );
};
