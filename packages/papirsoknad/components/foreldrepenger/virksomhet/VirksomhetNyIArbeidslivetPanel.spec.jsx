import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import DatepickerField from 'form/fields/DatepickerField';
import VirksomhetNyIArbeidslivetPanel from './VirksomhetNyIArbeidslivetPanel';

describe('<VirksomhetNyIArbeidslivetPanel>', () => {
  it('skal vise komponent med datofelt når det er valgt at en er ny i arbeidslivet', () => {
    const wrapper = shallow(<VirksomhetNyIArbeidslivetPanel.WrappedComponent
      erNyIArbeidslivet
      readOnly={false}
    />);

    expect(wrapper.find(DatepickerField)).to.have.length(1);
  });

  it('skal vise komponent uten datofelt når det ikke er valgt at en er ny i arbeidslivet', () => {
    const wrapper = shallow(<VirksomhetNyIArbeidslivetPanel.WrappedComponent
      erNyIArbeidslivet={false}
      readOnly={false}
    />);

    expect(wrapper.find(DatepickerField)).to.have.length(0);
  });
});
