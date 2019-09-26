import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { TextAreaField } from '@fpsak-frontend/form';

import { SykdomPanel } from './SykdomPanel';

describe('<SykdomPanel>', () => {
  it('skal rendre Sykdomspanel', () => {
    const wrapper = shallow(<SykdomPanel
      readOnly={false}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT]: {},
      }}
    />);

    expect(wrapper.find(TextAreaField)).to.have.length(1);
  });
});
