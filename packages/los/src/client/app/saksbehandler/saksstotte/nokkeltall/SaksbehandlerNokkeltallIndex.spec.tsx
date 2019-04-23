
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { SaksbehandlerNokkeltallIndex } from './SaksbehandlerNokkeltallIndex';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';

describe('<SaksbehandlerNokkeltallIndex>', () => {
  it('skal hente statistikk ved lasting av komponent', () => {
    const fetchNyeOgFerdigstilteBehandlerForIdagFn = sinon.spy();

    const wrapper = shallow(<SaksbehandlerNokkeltallIndex
      fetchNyeOgFerdigstilteOppgaverNokkeltall={fetchNyeOgFerdigstilteBehandlerForIdagFn}
      valgtSakslisteId={2}
    />);

    expect(wrapper.find(SaksbehandlerNokkeltallPanel)).to.have.length(1);

    expect(fetchNyeOgFerdigstilteBehandlerForIdagFn.calledOnce).to.be.true;
    const { args: args1 } = fetchNyeOgFerdigstilteBehandlerForIdagFn.getCalls()[0];
    expect(args1).to.have.length(1);
    expect(args1[0]).to.eql(2);
  });

  it('skal hente statistikk ved oppdatering av komponent', () => {
    const fetchNyeOgFerdigstilteBehandlerForIdagFn = sinon.spy();

    const wrapper = shallow(<SaksbehandlerNokkeltallIndex
      fetchNyeOgFerdigstilteOppgaverNokkeltall={fetchNyeOgFerdigstilteBehandlerForIdagFn}
      valgtSakslisteId={2}
    />);

    wrapper.setProps({ valgtSakslisteId: 1 });

    expect(fetchNyeOgFerdigstilteBehandlerForIdagFn.calledTwice).to.be.true;
  });
});
