
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SistBehandledeSaker from './SistBehandledeSaker';
import SaksstottePaneler from './SaksstottePaneler';
import SaksbehandlerNokkeltallIndex from '../nokkeltall/SaksbehandlerNokkeltallIndex';

describe('<SaksstottePaneler>', () => {
  it('skal vise sist behandlede saker', () => {
    const oppgaver = [];
    const wrapper = shallow(<SaksstottePaneler
      fpsakUrl="www.fpsak.no"
      sistBehandledeSaker={oppgaver}
    />);

    expect(wrapper.find(SistBehandledeSaker)).to.have.length(1);
  });

  it('skal ikke vise nøkkeldata når det ikke er valgt saksliste', () => {
    const oppgaver = [];
    const wrapper = shallow(<SaksstottePaneler
      fpsakUrl="www.fpsak.no"
      sistBehandledeSaker={oppgaver}
    />);

    expect(wrapper.find(SaksbehandlerNokkeltallIndex)).to.have.length(0);
  });

  it('skal vise nøkkeldata når det er valgt saksliste', () => {
    const oppgaver = [];
    const wrapper = shallow(<SaksstottePaneler
      fpsakUrl="www.fpsak.no"
      sistBehandledeSaker={oppgaver}
      valgtSakslisteId={1}
    />);

    expect(wrapper.find(SaksbehandlerNokkeltallIndex)).to.have.length(1);
  });
});
