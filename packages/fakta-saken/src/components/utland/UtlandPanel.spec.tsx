import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { RadioGroupField } from '@fpsak-frontend/form';
import { Image } from '@fpsak-frontend/shared-components';

import { UtlandPanelImpl as UtlandPanel } from './UtlandPanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-saken';

describe('<UtlandPanel>', () => {
  it('skal vise komponent både før og etter editeringsmodus', () => {
    const wrapper = shallowWithIntl(
      <UtlandPanel
        intl={intlMock}
        readOnly={false}
        dirty
        handleSubmit={sinon.spy()}
        reset={sinon.spy()}
      />,
    );

    expect(wrapper.find(Image)).to.have.length(1);
    expect(wrapper.find(RadioGroupField)).to.have.length(0);

    wrapper.find(Image).prop('onClick')();

    expect(wrapper.find(Image)).to.have.length(0);
    expect(wrapper.find(RadioGroupField)).to.have.length(1);
  });
});
