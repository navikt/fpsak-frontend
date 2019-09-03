import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { transformValues, UttakFaktaForm } from './UttakFaktaForm';


const ap5070 = {
  aksjonspunktType: {
    kode: 'MANU',
    navn: 'Manuell',
    kodeverk: 'AKSJONSPUNKT_TYPE',
  },
  kode: 'MANU',
  kodeverk: 'AKSJONSPUNKT_TYPE',
  navn: 'Manuell',
  begrunnelse: 'test2',
  besluttersBegrunnelse: null,
  definisjon: {
    kode: '5070',
    navn: 'Avklar annen forelder har ikke rett',
  },
  erAktivt: true,
  kanLoses: true,
  status: {
    kode: 'UTFO',
    navn: 'Utført',
    kodeverk: 'AKSJONSPUNKT_STATUS',
  },
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
};

const ap6070 = {
  aksjonspunktType: {
    kode: 'MANU',
    navn: 'Manuell',
    kodeverk: 'AKSJONSPUNKT_TYPE',
  },
  kode: 'MANU',
  kodeverk: 'AKSJONSPUNKT_TYPE',
  navn: 'Manuell',
  begrunnelse: 'test2',
  besluttersBegrunnelse: null,
  definisjon: {
    kode: '6070',
    navn: 'Avklar annen forelder har ikke rett',
  },
  erAktivt: true,
  kanLoses: true,
  status: {
    kode: 'UTFO',
    navn: 'Utført',
    kodeverk: 'AKSJONSPUNKT_STATUS',
  },
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
};

const ap6013 = {
  aksjonspunktType: {
    kode: 'MANU',
    navn: 'Manuell',
    kodeverk: 'AKSJONSPUNKT_TYPE',
  },
  kode: 'MANU',
  kodeverk: 'AKSJONSPUNKT_TYPE',
  navn: 'Manuell',
  begrunnelse: 'test2',
  besluttersBegrunnelse: null,
  definisjon: {
    kode: '6013',
    navn: 'Avklar annen forelder har ikke rett',
  },
  erAktivt: true,
  kanLoses: true,
  status: {
    kode: 'OPPR',
    navn: 'Opprettet',
    kodeverk: 'AKSJONSPUNKT_STATUS',
  },
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
};

describe('<UttakFaktaForm>', () => {
  it('skal vise error melding hvis det er noe error', () => {
    const formProps = {
      error: 'Perioder overlapper',
    };
    const wrapper = shallowWithIntl(
      <UttakFaktaForm
        readOnly={false}
        hasOpenAksjonspunkter
        behandlingFormPrefix="UttakFaktaForm"
        initialValues={{}}
        aksjonspunkter={[]}
        submitting={false}
        hasRevurderingOvertyringAp={false}
        {...formProps}
      />,
    );

    const span = wrapper.find('span');
    expect(span).to.have.length(1);
    expect(span.text()).to.equal('Perioder overlapper');
  });

  it('skal kun sende 5070 når man har både 5070 og 6070', () => {
    const values = {
      perioder: [],
    };

    const transformedValues = transformValues(values, {}, [ap6070, ap5070]);
    expect(transformedValues.filter((ap) => ap.kode === aksjonspunktCodes.AVKLAR_UTTAK)).has.length(1);
  });

  it('skal sende 6013 hvis ingen andre aksjonspunkter og manuelloverstyrt', () => {
    const values = {
      perioder: [],
      faktaUttakManuellOverstyring: true,
    };

    const transformedValues = transformValues(values, {}, []);
    expect(transformedValues.filter((ap) => ap.kode === aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK)).has.length(1);
  });

  it('skal sende 6013 hvis 6013 er OPPR og ikke 5070', () => {
    const values = {
      perioder: [],
      faktaUttakManuellOverstyring: false,
    };

    const transformedValues = transformValues(values, {}, [ap6013]);
    expect(transformedValues.filter((ap) => ap.kode === aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK)).has.length(1);
  });
});
