import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';

import BostedSokerFaktaIndex from './BostedSokerFaktaIndex';
import BostedSokerView from './components/BostedSokerView';

describe('<BostedSokerFaktaIndex>', () => {
  it('vise rendre komponent korrekt', () => {
    const wrapper = shallow(<BostedSokerFaktaIndex
      personopplysninger={{
        navn: 'Espen Utvikler',
        adresser: [{
          adresseType: {
            kode: opplysningAdresseType.BOSTEDSADRESSE,
          },
        }],
        personstatus: {
          kode: personstatusType.BOSATT,
        },
      }}
      alleKodeverk={{}}
    />);

    expect(wrapper.find(BostedSokerView)).has.length(1);
  });
});
