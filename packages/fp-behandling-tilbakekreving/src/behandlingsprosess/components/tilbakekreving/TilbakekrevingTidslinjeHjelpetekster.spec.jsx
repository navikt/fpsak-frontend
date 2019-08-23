import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Image } from '@fpsak-frontend/shared-components';

import TilbakekrevingTidslinjeHjelpetekster from './TilbakekrevingTidslinjeHjelpetekster';

describe('<TilbakekrevingTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(
      <TilbakekrevingTidslinjeHjelpetekster />,
    );

    expect(wrapper.find(Image)).has.length(3);
  });
});
