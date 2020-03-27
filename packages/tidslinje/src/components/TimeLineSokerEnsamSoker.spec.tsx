import React from 'react';
import { expect } from 'chai';
import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import Image from '@fpsak-frontend/shared-components/src/Image';
import TimeLineSokerEnsamSoker from './TimeLineSokerEnsamSoker';


describe('<TimeLineSokerEnsamSoker>', () => {
  it('skal teste at TimeLineSoker viser korrekte bilder för korrekte soker', () => {
    const wrapper = mountWithIntl(<TimeLineSokerEnsamSoker
      hovedsokerKjonnKode="K"
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    expect(rows.find(Image).at(0).props().tooltip).to.have.length.above(3);
  });
});
