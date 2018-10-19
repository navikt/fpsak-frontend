import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import FaktaPanel from 'fakta/components/FaktaPanel';
import { FaktaIndex } from './FaktaIndex';

describe('<FaktaIndex>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(1, 1);

  it('skal vise fakta-paneler', () => {
    const wrapper = shallow(<FaktaIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={1}
      resetFakta={sinon.spy()}
      openInfoPanels={['fakta1', 'fakta2']}
      location={{}}
      push={sinon.spy()}
      resolveFaktaAksjonspunkter={sinon.spy()}
      resolveFaktaOverstyrAksjonspunkter={sinon.spy()}
      shouldOpenDefaultInfoPanels
    />);

    expect(wrapper.find(FaktaPanel)).to.have.length(1);
  });

  it('skal åpne info panel ved panel-toggling når det ikke allerede er åpnet', () => {
    const pushCallback = sinon.spy();
    const wrapper = shallow(<FaktaIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={1}
      resetFakta={sinon.spy()}
      openInfoPanels={['fakta1', 'fakta2']}
      location={{}}
      push={pushCallback}
      resolveFaktaAksjonspunkter={sinon.spy()}
      resolveFaktaOverstyrAksjonspunkter={sinon.spy()}
      shouldOpenDefaultInfoPanels
    />);

    const newPanelId = 'fakta3';
    wrapper.find(FaktaPanel).prop('toggleInfoPanelCallback')(newPanelId);

    expect(pushCallback.calledOnce).to.be.true;
    const { args } = pushCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql({ search: '?fakta=fakta1%2Cfakta2%2Cfakta3' });
  });

  it('skal lukke info panel ved panel-toggling når det allerede er åpnet', () => {
    const pushCallback = sinon.spy();
    const wrapper = shallow(<FaktaIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={1}
      resetFakta={sinon.spy()}
      openInfoPanels={['fakta1', 'fakta2', 'fakta3']}
      location={{}}
      push={pushCallback}
      resolveFaktaAksjonspunkter={sinon.spy()}
      resolveFaktaOverstyrAksjonspunkter={sinon.spy()}
      shouldOpenDefaultInfoPanels
    />);

    const existingPanelId = 'fakta3';
    wrapper.find(FaktaPanel).prop('toggleInfoPanelCallback')(existingPanelId);

    expect(pushCallback.calledOnce).to.be.true;
    const { args } = pushCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql({ search: '?fakta=fakta1%2Cfakta2' });
  });

  it('skal avklare fakta-aksjonspunkter', () => {
    const resolveCallback = sinon.stub().returns(Promise.resolve());
    const wrapper = shallow(<FaktaIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={1}
      resetFakta={sinon.spy()}
      openInfoPanels={['fakta1', 'fakta2']}
      location={{}}
      push={sinon.spy()}
      resolveFaktaAksjonspunkter={resolveCallback}
      resolveFaktaOverstyrAksjonspunkter={sinon.spy()}
      shouldOpenDefaultInfoPanels
    />);

    const aksjonspunkter = [{
      kode: aksjonspunktCodes.TERMINBEKREFTELSE,
      testProp: 'Dette er en tekst',
    }];
    wrapper.find(FaktaPanel).prop('submitCallback')(aksjonspunkter);

    expect(resolveCallback.calledOnce).to.be.true;
    const { args } = resolveCallback.getCalls()[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql({
      behandlingId: 1,
      saksnummer: '1',
      behandlingVersjon: 1,
      bekreftedeAksjonspunktDtoer: [{
        '@type': aksjonspunktCodes.TERMINBEKREFTELSE,
        ...aksjonspunkter[0],
      }],
    });
    expect(args[1]).to.eql(behandlingIdentifier);
  });
});
