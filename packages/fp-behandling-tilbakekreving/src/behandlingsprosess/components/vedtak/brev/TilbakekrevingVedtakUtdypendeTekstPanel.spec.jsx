import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Image } from '@fpsak-frontend/shared-components';
import { TextAreaField } from '@fpsak-frontend/form';

import { TilbakekrevingVedtakUtdypendeTekstPanel, feltnavn } from './TilbakekrevingVedtakUtdypendeTekstPanel';

describe('<TilbakekrevingVedtakUtdypendeTekstPanel>', () => {
  it('skal vise lenke for å skrive inn tekst når felt ikke har verdi', () => {
    const wrapper = shallowWithIntl(<TilbakekrevingVedtakUtdypendeTekstPanel
      intl={intlMock}
      isEmpty
      type={feltnavn.OPPSUMMERING}
      readOnly={false}
    />);

    expect(wrapper.find(Image)).to.have.length(1);
    expect(wrapper.find(TextAreaField)).to.have.length(0);
  });
});
