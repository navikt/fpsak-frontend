import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import Image from './Image';

describe('<Image>', () => {
  it('skal inneholde en image tag', () => {
    const imageSrcCallback = sinon.spy();
    const wrapper = shallowWithIntl(<Image.WrappedComponent imageSrcFunction={imageSrcCallback} intl={intlMock} />);
    expect(wrapper.find('img')).to.have.length(1);
  });
});
