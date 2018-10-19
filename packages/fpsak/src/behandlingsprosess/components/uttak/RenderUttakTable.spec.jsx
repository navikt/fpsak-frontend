import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { MockFields } from 'testHelpers/redux-form-test-helper';

import { RenderUttakTableImpl } from './RenderUttakTable';

describe('<RenderUttakTable>', () => {
  it('render uttakstable 1 rad', () => {
    const fields = new MockFields('UttakFieldArray', 1);
    const wrapper = shallowWithIntl(<RenderUttakTableImpl
      readOnly={false}
      fields={fields}
      periodeTyper={[]}
      meta={{}}
    />);
    const tableRow = wrapper.find('TableRow');
    expect(tableRow).to.have.length(1);
    const tableColumn = wrapper.find('TableColumn');
    expect(tableColumn).to.have.length(5);
    const selectField = wrapper.find('SelectField');
    expect(selectField).to.have.length(1);
    const inputField = wrapper.find('InputField');
    expect(inputField).to.have.length(2);
    const decimalField = wrapper.find('DecimalField');
    expect(decimalField).to.have.length(1);
  });
  it('render uttakstable 2 rader', () => {
    const fields = new MockFields('UttakFieldArray', 2);
    const wrapper = shallowWithIntl(<RenderUttakTableImpl
      readOnly={false}
      fields={fields}
      periodeTyper={[]}
      meta={{}}
    />);
    const tableRow = wrapper.find('TableRow');
    expect(tableRow).to.have.length(2);
    const tableColumn = wrapper.find('TableColumn');
    expect(tableColumn).to.have.length(10);
    const selectField = wrapper.find('SelectField');
    expect(selectField).to.have.length(2);
    const inputField = wrapper.find('InputField');
    expect(inputField).to.have.length(4);
    const decimalField = wrapper.find('DecimalField');
    expect(decimalField).to.have.length(2);
  });
});
