import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { MockFieldsWithContent } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { SelectField } from '@fpsak-frontend/form';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { PeriodFieldArray } from '@fpsak-frontend/shared-components';

import BehovForTilrettteleggingFieldArray from './BehovForTilrettteleggingFieldArray';

describe('<TilretteleggingForArbeidsgiverFieldArray>', () => {
  it('skal rendre komponent korrekt', () => {
    const getRemoveButton = () => undefined;
    const fields = new MockFieldsWithContent('tilrettelegging', [{ tilretteleggingType: 1 }, { tilretteleggingType: 2 }]);
    const wrapper = shallowWithIntl(<BehovForTilrettteleggingFieldArray.WrappedComponent
      intl={intlMock}
      fields={fields}
      meta={{}}
      readOnly={false}
    />);


    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0, getRemoveButton);
    const innerWrapper = shallow(comp);

    expect(innerWrapper.find(SelectField)).has.length(1);
  });
});
