import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { PersonIndex } from '@fpsak-frontend/person-info';
import { FaktaKlagePanel } from './FaktaKlagePanel';

describe('<FaktaKlagePanel>', () => {
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
    const wrapper = shallowWithIntl(<FaktaKlagePanel
      fagsakPerson={person}
    />);

    expect(wrapper.find(PersonIndex)).to.have.length(1);
  });
});
