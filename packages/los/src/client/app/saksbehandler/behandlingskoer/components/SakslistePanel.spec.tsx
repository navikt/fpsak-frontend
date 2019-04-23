
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import SakslisteVelgerForm from './SakslisteVelgerForm';
import OppgaverTabell from './OppgaverTabell';

import SakslistePanel from './SakslistePanel';

describe('<SakslistePanel>', () => {
  it('skal vise kriterievelger og liste over neste saker', () => {
    const fetchFn = sinon.spy();
    const reserverteOppgaver = [];
    const sakslister = [];
    const wrapper = shallow(<SakslistePanel
      fetchSakslisteOppgaver={fetchFn}
      oppgaverTilBehandling={reserverteOppgaver}
      reserverteOppgaver={reserverteOppgaver}
      sakslister={sakslister}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      finnSaksbehandler={sinon.spy()}
      resetSaksbehandler={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      fetchSakslistensSaksbehandlere={sinon.spy()}
    />);

    expect(wrapper.find(SakslisteVelgerForm)).to.have.length(1);
    expect(wrapper.find(OppgaverTabell)).to.have.length(1);
  });
});
