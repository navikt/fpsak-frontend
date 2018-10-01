import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import TimeLineSoker from './TimeLineSoker';


describe('<TimeLineSoker>', () => {
  it('skal teste at TimeLineSoker viser korrekte bilder för korrekte soker', () => {
    const wrapper = shallowWithIntl(<TimeLineSoker
      hovedsokerKjonnKode="K"
      medsokerKjonnKode="M"
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(2);
    expect(rows.children().at(0).props().titleCode).to.equal('Person.Woman');
    expect(rows.children().at(1).props().titleCode).to.equal('Person.Man');
  });
});
