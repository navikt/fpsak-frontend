import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';

import { PersonIndex } from '@fpsak-frontend/fp-felles';
import { FaktaPanel } from './FaktaPanel';

describe('<FaktaPanel>', () => {
  const person = {
    navn: 'Espen Utvikler',
    alder: 40,
    personnummer: '1234546',
    erKvinne: false,
    personstatusType: {
      kode: 'test',
      navn: 'test',
    },
  };


  it('skal vise faktapanel for tilleggsopplysninger og medlemskap når en har aksjonspunkt for disse', () => {
    const wrapper = shallowWithIntl(<FaktaPanel
      fagsakPerson={person}
    />);

    expect(wrapper.find(PersonIndex)).to.have.length(1);
  });
});
