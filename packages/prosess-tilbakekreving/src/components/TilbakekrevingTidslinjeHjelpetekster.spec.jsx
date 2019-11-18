import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { LegendBox } from '@fpsak-frontend/tidslinje';
import TilbakekrevingTidslinjeHjelpetekster from './TilbakekrevingTidslinjeHjelpetekster';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-tilbakekreving';

describe('<TilbakekrevingTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(
      <TilbakekrevingTidslinjeHjelpetekster.WrappedComponent
        intl={intlMock}
      />,
    );

    expect(wrapper.find(LegendBox)).has.length(1);
  });
});
