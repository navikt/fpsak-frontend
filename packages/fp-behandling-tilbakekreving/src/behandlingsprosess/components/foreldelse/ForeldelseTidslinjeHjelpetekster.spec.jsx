import React from 'react';
import { expect } from 'chai';

import { Image } from '@fpsak-frontend/shared-components';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import ForeldelseTidslinjeHjelpetekster from './ForeldelseTidslinjeHjelpetekster';


describe('<ForeldelseTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(
      <ForeldelseTidslinjeHjelpetekster.WrappedComponent
        intl={intlMock}
      />,
    );
    expect(wrapper.find(Image)).has.length(3);
  });
});
