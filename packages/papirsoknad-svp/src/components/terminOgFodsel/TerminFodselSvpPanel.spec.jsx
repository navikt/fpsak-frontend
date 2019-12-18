import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { DatepickerField } from '@fpsak-frontend/form';

import TerminFodselSvpPanel from './TerminFodselSvpPanel';

describe('<TerminFodselSvpPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(<TerminFodselSvpPanel.WrappedComponent
      intl={intlMock}
      readOnly={false}
    />);

    expect(wrapper.find(DatepickerField)).to.have.length(2);
  });
});
