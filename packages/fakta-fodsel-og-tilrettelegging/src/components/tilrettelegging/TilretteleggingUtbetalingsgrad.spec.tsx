import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { DecimalField } from '@fpsak-frontend/form';
import { Image } from '@fpsak-frontend/shared-components';

import TilretteleggingUtbetalingsgrad from './TilretteleggingUtbetalingsgrad';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-fodsel-og-tilrettelegging';

describe('<TilretteleggingUtbetalingsgrad>', () => {
  it('skal vise inputfelt som kan editeres når overstyrer velger å overstyre', () => {
    const wrapper = shallowWithIntl(<TilretteleggingUtbetalingsgrad.WrappedComponent
      intl={intlMock}
      tilretteleggingKode="TEST"
      readOnly={false}
      erOverstyrer
      fieldId="1"
      setOverstyrtUtbetalingsgrad={() => undefined}
    />);

    expect(wrapper.find(DecimalField).prop('readOnly')).is.true;

    const image = wrapper.find(Image);
    image.prop('onClick')();

    expect(wrapper.find(DecimalField).prop('readOnly')).is.false;
  });
});
