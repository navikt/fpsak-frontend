import React from 'react';
import { expect } from 'chai';

import { Image } from '@fpsak-frontend/shared-components';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import TilbakekrevingTidslinjeHjelpetekster from './TilbakekrevingTidslinjeHjelpetekster';

describe('<TilbakekrevingTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(
      <TilbakekrevingTidslinjeHjelpetekster.WrappedComponent
        intl={intlMock}
      />,
    );

    expect(wrapper.find(Image)).has.length(3);
  });
});
