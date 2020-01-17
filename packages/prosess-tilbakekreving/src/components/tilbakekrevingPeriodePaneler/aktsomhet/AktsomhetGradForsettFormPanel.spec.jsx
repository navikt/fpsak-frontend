import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Normaltekst } from 'nav-frontend-typografi';

import { RadioOption } from '@fpsak-frontend/form';
import AktsomhetGradForsettFormPanel from './AktsomhetGradForsettFormPanel';

describe('<AktsomhetGradForsettFormPanel>', () => {
  it('skal vise panel for å forsett når denne radio-knappen er valgt', () => {
    const wrapper = shallow(<AktsomhetGradForsettFormPanel
      readOnly={false}
    />);

    expect(wrapper.find(Normaltekst)).to.have.length(2);
  });

  it('skal vise valg for om det skal tillegges renter når forsett er valgt og det er forsto eller burde forstått', () => {
    const wrapper = shallow(<AktsomhetGradForsettFormPanel
      readOnly={false}
      erValgtResultatTypeForstoBurdeForstaatt
    />);

    expect(wrapper.find(Normaltekst)).to.have.length(1);
    expect(wrapper.find(RadioOption)).to.have.length(2);
  });
});
