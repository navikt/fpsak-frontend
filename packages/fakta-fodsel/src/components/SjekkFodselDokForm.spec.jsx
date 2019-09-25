import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import FodselSammenligningIndex from '@fpsak-frontend/prosess-fakta-fodsel-sammenligning';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { buildInitialValues, SjekkFodselDokForm } from './SjekkFodselDokForm';

const soknad = {
  fodselsdatoer: { 1: '2019-01-01' },
  antallBarn: 1,
  soknadType: {
    kode: soknadType.FODSEL,
  },
};
const alleMerknaderFraBeslutter = {
  [aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL]: {},
};

describe('<SjekkFodselDokForm>', () => {
  it('skal rendre form', () => {
    const wrapper = shallow(<SjekkFodselDokForm
      {...reduxFormPropsMock}
      readOnly={false}
      initialValues={{ begrunnelse: 'test' }}
      submittable
      behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      soknad={soknad}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
    />);
    expect(wrapper.find(FodselSammenligningIndex)).has.length(1);
  });

  it('skal sette korrekte initielle verdier når vi har avklarte data', () => {
    const familiehendelse = {
      avklartBarn: [],
      dokumentasjonForeligger: true,
      brukAntallBarnFraTps: false,
    };
    const aksjonspunkter = [{ definisjon: { kode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL }, begrunnelse: 'test' }];

    const initialValues = buildInitialValues.resultFunc(familiehendelse, aksjonspunkter);

    expect(initialValues).to.eql({
      avklartBarn: [{
        dodsDato: '',
        fodselsdato: '',
        isBarnDodt: false,
      },
      ],
      dokumentasjonForeligger: true,
      brukAntallBarnITps: false,
      begrunnelse: 'test',
    });
  });

  it('skal sette korrekte initielle verdier når vi ikke har avklarte data', () => {
    const familiehendelse = {};
    const aksjonspunkter = [{ definisjon: { kode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL }, begrunnelse: 'test' }];
    const initialValues = buildInitialValues.resultFunc(familiehendelse, aksjonspunkter);

    expect(initialValues).to.eql({
      avklartBarn: [{
        dodsDato: '',
        fodselsdato: '',
        isBarnDodt: false,
      },
      ],
      dokumentasjonForeligger: undefined,
      brukAntallBarnITps: undefined,
      begrunnelse: 'test',
    });
  });
});
