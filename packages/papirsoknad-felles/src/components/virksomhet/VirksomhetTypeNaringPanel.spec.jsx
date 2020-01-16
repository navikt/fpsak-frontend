import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { CheckboxField } from '@fpsak-frontend/form';

import { VirksomhetTypeNaringPanel } from './VirksomhetTypeNaringPanel';

describe('<VirksomhetTypeNaringPanel>', () => {
  const naringTyper = [
    { navn: 'Fiske', kode: 'FISKE' },
    { navn: 'Frilanser', kode: 'FRILANSER' },
  ];

  it('skal rendre korrekt ved default props', () => {
    const wrapper = shallow(<VirksomhetTypeNaringPanel naringvirksomhetTyper={naringTyper} readOnly={false} />);

    const undertekst = wrapper.find('Undertekst');
    expect(undertekst).to.have.length(1);

    const checkboxes = wrapper.find(CheckboxField);
    expect(checkboxes).to.have.length(2);
  });
});
