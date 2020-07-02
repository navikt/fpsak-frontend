import React from 'react';
import { expect } from 'chai';

import { Image } from '@fpsak-frontend/shared-components';

import { intlMock, mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import ForeldelseTidslinjeHjelpetekster from './ForeldelseTidslinjeHjelpetekster';

describe('<ForeldelseTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = mountWithIntl(
      <ForeldelseTidslinjeHjelpetekster.WrappedComponent
        intl={intlMock}
      />,
    );

    expect(wrapper.find(Image)).has.length(4);
  });
});
