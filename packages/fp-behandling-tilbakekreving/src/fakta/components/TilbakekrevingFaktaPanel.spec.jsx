import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { PersonIndex } from '@fpsak-frontend/person-info';

import { TilbakekrevingFaktaPanel } from './TilbakekrevingFaktaPanel';
import FeilutbetalingInfoPanel from './feilutbetaling/FeilutbetalingInfoPanel';

describe('TilbakekrevingFaktaPanel', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<TilbakekrevingFaktaPanel
      aksjonspunkter={[]}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      readOnly={false}
      fagsakPerson={{}}
    />);
    expect(wrapper.find(PersonIndex)).to.have.length(1);
    expect(wrapper.find(FeilutbetalingInfoPanel)).to.have.length(0);
  });

  it('skal vise panel for feilutbetaling når en har dette', () => {
    const wrapper = shallow(<TilbakekrevingFaktaPanel
      aksjonspunkter={[]}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      readOnly={false}
      fagsakPerson={{}}
      feilutbetaling={{}}
    />);
    expect(wrapper.find(FeilutbetalingInfoPanel)).to.have.length(1);
  });
});
