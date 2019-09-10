import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Image from './Image';

describe('<Image>', () => {
  it('skal inneholde en image tag', () => {
    const imageSrc = 'https://example.com/png.png';
    const wrapper = shallow(<Image src={imageSrc} />);
    expect(wrapper.find('img')).to.have.length(1);
  });
});
