import React from 'react';
import { expect } from 'chai';
import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import Image from '@fpsak-frontend/shared-components/src/Image';
import EditedIconV2 from './EditedIconV2';

describe('EditedIconV2', () => {
  it('skal vise icon', () => {
    const wrapper = mountWithIntl(
      <EditedIconV2 />,
    );
    const komponent = wrapper.find('EditedIconV2');
    expect(komponent.length).to.equal(1);
    const image = komponent.find(Image);
    expect(image.props().alt).to.have.length.above(10);
    expect(image.props().title).to.have.length.above(10);
  });
});
