import React from 'react';
import { expect } from 'chai';
import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import Image from '@fpsak-frontend/shared-components/src/Image';
// eslint-disable-next-line import/extensions
import TimeLineSoker from './TimeLineSoker';


describe('<TimeLineSoker>', () => {
  it('skal teste at TimeLineSoker viser korrekte bilder för korrekte soker', () => {
    const wrapper = mountWithIntl(<TimeLineSoker
      hovedsokerKjonnKode="K"
      medsokerKjonnKode="M"
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(2);
    expect(rows.find(Image).at(0).props().tooltip).to.have.length.above(3);
    expect(rows.find(Image).at(1).props().tooltip).to.have.length.above(3);
  });
});
