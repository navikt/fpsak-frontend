import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { metaMock, MockFields } from 'testHelpers/redux-form-test-helper';

import { DatepickerField } from 'form/Fields';
import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import FrilansPerioderFieldArray from './FrilansPerioderFieldArray';

const fields = new MockFields('perioder', 1);

const getRemoveButton = () => <button id="avslutt" type="button" />;

describe('<FrilansPerioderFieldArray>', () => {
  it('Skal rendre FrilansPerioderFieldArray', () => {
    const wrapper = shallow(<FrilansPerioderFieldArray
      fields={fields}
      meta={metaMock}
      readOnly={false}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0, getRemoveButton);
    const innerWrapper = shallow(comp);

    const dateFields = innerWrapper.find(DatepickerField);
    expect(dateFields).has.length(2);
    expect(dateFields.first().prop('name')).is.eql('fieldId1.periodeFom');
    expect(dateFields.first().prop('label')).is.eql({ id: 'Registrering.Frilans.periodeFom' });
    expect(dateFields.last().prop('name')).is.eql('fieldId1.periodeTom');
    expect(dateFields.last().prop('label')).is.eql({ id: 'Registrering.Frilans.periodeTom' });
    expect(innerWrapper.find('#avslutt')).has.length(1);
  });
});
