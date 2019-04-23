
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import SaksbehandlerNokkeltallPanel from './SaksbehandlerNokkeltallPanel';
import NyeOgFerdigstilteOppgaverForIdagPanel from './nyeOgFerdigstilteOppgaverForIdag/NyeOgFerdigstilteOppgaverForIdagPanel';
import NyeOgFerdigstilteOppgaverForSisteSyvPanel from './nyeOgFerdigstilteOppgaverForSisteSyv/NyeOgFerdigstilteOppgaverForSisteSyvPanel';

describe('<SaksbehandlerNokkeltallPanel>', () => {
  it('skal vise grafpaneler', () => {
    const wrapper = shallow(<SaksbehandlerNokkeltallPanel />);

    expect(wrapper.find(NyeOgFerdigstilteOppgaverForIdagPanel)).to.have.length(1);
    expect(wrapper.find(NyeOgFerdigstilteOppgaverForSisteSyvPanel)).to.have.length(1);
  });
});
