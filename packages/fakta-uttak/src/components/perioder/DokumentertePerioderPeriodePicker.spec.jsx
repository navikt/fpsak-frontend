import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { MockFields } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { PeriodpickerField } from '@fpsak-frontend/form';
import DokumentertePerioderPeriodePicker from './DokumentertePerioderPeriodePicker';

const periode = {
  tom: '10-10-2017',
  fom: '01-10-2017',
};

const fields = new MockFields('perioder', 1);

const getRemoveButton = () => <button id="avslutt" type="button" />;

describe('<DokumentertePerioderPeriodePicker>', () => {
  it('skal vise DokumentertePerioderPeriodePicker', () => {
    const wrapper = shallow(<DokumentertePerioderPeriodePicker
      fields={fields}
      fraDato={periode.fom}
      tilDato={periode.tom}
      readOnly={false}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0, getRemoveButton);
    const innerWrapper = shallow(comp);

    expect(innerWrapper.find(PeriodpickerField)).to.have.length(1);
  });
});
