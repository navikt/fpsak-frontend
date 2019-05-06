import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import FodselSammenligningPanel from 'behandlingForstegangOgRevurdering/src/components/fodselSammenligning/FodselSammenligningPanel';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { SjekkFodselDokForm, buildInitialValues } from './SjekkFodselDokForm';

describe('<SjekkFodselDokForm>', () => {
  it('skal rendre form', () => {
    const wrapper = shallow(<SjekkFodselDokForm
      {...reduxFormPropsMock}
      readOnly={false}
      initialValues={{ begrunnelse: 'test' }}
      submittable
    />);
    expect(wrapper.find(FodselSammenligningPanel)).has.length(1);
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
