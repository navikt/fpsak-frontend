import React from 'react';
import { expect } from 'chai';
import { MockFieldsWithContent } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { RenderUttakTableImpl } from './RenderUttakTable';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-proses-uttak';

const uttakFields1 = [
  {
    prosentArbeid: 100,
    stillingsprosent: 100,
    arbeidsgiver: {
      navn: 'Statoil',
      identifikator: '987',
    },
    arbeidsforholdId: 907,
    uttakArbeidType: '',
    utbetalingsgrad: 0,
    days: 23,
  },
];

const uttakFields2 = [
  {
    prosentArbeid: 100,
    stillingsprosent: 100,
    arbeidsgiver: {
      navn: 'Statoil',
      identifikator: '987',
    },
    arbeidsforholdId: 907,
    uttakArbeidType: '',
    utbetalingsgrad: 0,
    days: 23,
  },
  ...uttakFields1,
];

describe('<RenderUttakTable>', () => {
  it('render uttakstable 1 rad', () => {
    const fields = new MockFieldsWithContent('UttakFieldArray', uttakFields1);
    const wrapper = shallowWithIntl(<RenderUttakTableImpl
      readOnly={false}
      fields={fields}
      periodeTyper={[]}
      meta={{}}
      selectedItemData={{}}
    />);
    const tableRow = wrapper.find('TableRow');
    expect(tableRow).to.have.length(1);
    const tableColumn = wrapper.find('TableColumn');
    expect(tableColumn).to.have.length(5);
    const selectField = wrapper.find('SelectField');
    expect(selectField).to.have.length(1);
    const inputField = wrapper.find('InputField');
    expect(inputField).to.have.length(1);
    const decimalField = wrapper.find('DecimalField');
    expect(decimalField).to.have.length(2);
  });
  it('render uttakstable 2 rader', () => {
    const fields = new MockFieldsWithContent('UttakFieldArray', uttakFields2);
    const wrapper = shallowWithIntl(<RenderUttakTableImpl
      readOnly={false}
      fields={fields}
      periodeTyper={[]}
      selectedItemData={{}}
      meta={{}}
    />);
    const tableRow = wrapper.find('TableRow');
    expect(tableRow).to.have.length(2);
    const tableColumn = wrapper.find('TableColumn');
    expect(tableColumn).to.have.length(10);
    const selectField = wrapper.find('SelectField');
    expect(selectField).to.have.length(2);
    const inputField = wrapper.find('InputField');
    expect(inputField).to.have.length(2);
    const decimalField = wrapper.find('DecimalField');
    expect(decimalField).to.have.length(4);
  });
});
