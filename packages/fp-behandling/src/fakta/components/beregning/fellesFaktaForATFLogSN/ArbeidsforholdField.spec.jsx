
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { MockFieldsWithContent } from '@fpsak-frontend/assets/testHelpers//redux-form-test-helper';
import { InputField, SelectField } from '@fpsak-frontend/form';
import { getUniqueListOfArbeidsforhold } from '../ArbeidsforholdHelper';
import ArbeidsforholdField from './ArbeidsforholdField';

const andelField = {
  nyAndel: false,
  andel: 'Sopra Steria AS (233647823)',
  andelsnr: 1,
  fastsattBeløp: '0',
  lagtTilAvSaksbehandler: false,
  inntektskategori: 'ARBEIDSTAKER',
};

const arbeidsforhold1 = {
  arbeidsgiverNavn: 'Sopra Steria AS',
  arbeidsgiverId: '233647823',
  startdato: '01.01.1967',
  opphoersdato: null,
  arbeidsforholdId: null,
  arbeidsforholdType: '',
  aktørId: null,
};


const andel = {
  fastsattBelopPrMnd: null,
  andelsnr: 1,
  arbeidsforhold: arbeidsforhold1,
  inntektskategori: { kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' },
  aktivitetStatus: { kode: 'AT', navn: 'Arbeidstaker' },
  lagtTilAvSaksbehandler: false,
  fastsattAvSaksbehandler: false,
  andelIArbeid: [],
};

const fields = new MockFieldsWithContent('fieldArrayName', [andelField]);


describe('<ArbeidsforholdField>', () => {
  it('skal render ArbeidsforholdField med input for eksisterende andel', () => {
    const wrapper = shallow(<ArbeidsforholdField
      fields={fields}
      arbeidsforholdList={getUniqueListOfArbeidsforhold([andel])}
      readOnly={false}
      name="andel"
      index={0}
    />);
    expect(wrapper.find(InputField).length).to.eql(1);
  });


  it('skal render ArbeidsforholdField med selectField for ny andel', () => {
    const copyAndel = { ...andelField, nyAndel: true };
    const fields2 = new MockFieldsWithContent('fieldArrayName', [copyAndel]);

    const wrapper = shallow(<ArbeidsforholdField
      fields={fields2}
      arbeidsforholdList={getUniqueListOfArbeidsforhold([andel])}
      readOnly={false}
      name="andel"
      index={0}
    />);
    const select = wrapper.find(SelectField);
    expect(select.length).to.eql(1);
    const { selectValues } = select.first().props();
    expect(selectValues.length).to.eql(1);
    expect(selectValues[0].key).to.eql('1');
    expect(selectValues[0].props.value).to.eql('1');
    expect(selectValues[0].props.children).to.eql('Sopra Steria AS (233647823)');
  });
});
