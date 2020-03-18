import React from 'react';
import { expect } from 'chai';
import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import Image from '@fpsak-frontend/shared-components/src/Image';
import EditedIcon from './EditedIcon';

describe('EditedIcon', () => {
  it('skal vise icon', () => {
    const wrapper = mountWithIntl(
      <EditedIcon />,
    );
    const komponent = wrapper.find('EditedIcon');
    expect(komponent.length).to.equal(1);
    const image = komponent.find(Image);
    expect(image.props().alt).to.have.length.above(10);
    expect(image.props().tooltip).to.have.length.above(10);
  });
});
