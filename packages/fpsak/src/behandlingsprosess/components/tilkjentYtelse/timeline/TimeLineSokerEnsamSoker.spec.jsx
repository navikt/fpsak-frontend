import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import TimeLineSokerEnsamSoker from './TimeLineSokerEnsamSoker';


describe('<TimeLineSokerEnsamSoker>', () => {
  it('skal teste at TimeLineSoker viser korrekte bilder för korrekte soker', () => {
    const wrapper = shallowWithIntl(<TimeLineSokerEnsamSoker
      hovedsokerKjonnKode="K"
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    expect(rows.children().at(0).props().titleCode).to.equal('Person.Woman');
  });
});
