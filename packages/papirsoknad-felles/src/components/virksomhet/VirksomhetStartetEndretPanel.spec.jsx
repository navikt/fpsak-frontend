import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { CheckboxField } from '@fpsak-frontend/form';

import { VirksomhetStartetEndretPanel } from './VirksomhetStartetEndretPanel';

describe('<VirksomhetStartetEndretPanel>', () => {
  it('skal rendre visning korrekt når det ikke er varig endring eller nyoppstartet', () => {
    const wrapper = shallow(<VirksomhetStartetEndretPanel readOnly={false} varigEndretEllerStartetSisteFireAr={false} />);
    expect(wrapper.find(CheckboxField)).to.have.length(0);
  });

  it('skal rendre visning korrekt når virksomhet er varig endret i løpet av de fire siste årene', () => {
    const wrapper = shallow(<VirksomhetStartetEndretPanel readOnly={false} varigEndretEllerStartetSisteFireAr />);
    expect(wrapper.find(CheckboxField)).to.have.length(3);
  });
});
