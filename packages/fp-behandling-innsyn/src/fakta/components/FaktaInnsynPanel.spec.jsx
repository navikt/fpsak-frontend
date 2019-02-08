import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';

import { PersonIndex } from '@fpsak-frontend/fp-felles';
import { FaktaInnsynPanel } from './FaktaInnsynPanel';

describe('<FaktaInnsynPanel>', () => {
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


  it('skal alltid vise faktapanel for person', () => {
    const wrapper = shallowWithIntl(<FaktaInnsynPanel
      fagsakPerson={person}
    />);

    expect(wrapper.find(PersonIndex)).to.have.length(1);
  });
});
