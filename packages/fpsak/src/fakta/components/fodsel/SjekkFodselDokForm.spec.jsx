import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import FodselSammenligningPanel from 'behandling/components/fodselSammenligning/FodselSammenligningPanel';
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
      antallBarnFodsel: 2,
      fodselsdato: '2016-09-15',
      dokumentasjonForeligger: true,
      brukAntallBarnFraTps: false,
    };
    const aksjonspunkter = [{ definisjon: { kode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL }, begrunnelse: 'test' }];

    const initialValues = buildInitialValues.resultFunc(familiehendelse, aksjonspunkter);

    expect(initialValues).to.eql({
      fodselsdato: '2016-09-15',
      antallBarnFodt: 2,
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
      fodselsdato: null,
      antallBarnFodt: null,
      dokumentasjonForeligger: undefined,
      brukAntallBarnITps: undefined,
      begrunnelse: 'test',
    });
  });
});
