import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Image } from '@fpsak-frontend/shared-components';

import ForeldelseTidslinjeHjelpetekster from './ForeldelseTidslinjeHjelpetekster';

describe('<ForeldelseTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(
      <ForeldelseTidslinjeHjelpetekster />,
    );

    expect(wrapper.find(Image)).has.length(3);
  });
});
