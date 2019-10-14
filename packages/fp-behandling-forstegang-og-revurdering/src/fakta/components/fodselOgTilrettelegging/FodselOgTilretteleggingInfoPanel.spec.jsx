import React from 'react';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';

import { faktaPanelCodes, FaktaEkspandertpanel } from '@fpsak-frontend/fp-felles';
import { FodselOgTilretteleggingInfoPanelImpl } from './FodselOgTilretteleggingInfoPanel';

describe('<FodselOgTilretteleggingInfoPanel>', () => {
  it('skal vise gammelt panel med toggle disabled', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingInfoPanelImpl
      intl={intlMock}
      openInfoPanels={['fodseltilrettelegging']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      readOnly
      submitCallback={sinon.spy()}
      submittable
      toggle={false}
    />);

    const faktaEkspandertpanel = wrapper.find(FaktaEkspandertpanel);
    expect(faktaEkspandertpanel).to.have.length(1);
    expect(faktaEkspandertpanel.prop('title')).to.eql('Fakta om fødsel og tilrettelegging');
    expect(faktaEkspandertpanel.prop('faktaId')).to.eql(faktaPanelCodes.FODSELTILRETTELEGGING);

    const faktaForm = faktaEkspandertpanel.find('Connect(Connect(ComponentWithRequiredProps(WithBehandlingForm)))');
    expect(faktaForm).to.have.length(1);
  });
  it('skal vise nytt panel med toggle enabled', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingInfoPanelImpl
      intl={intlMock}
      openInfoPanels={['fodseltilrettelegging']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      readOnly
      submitCallback={sinon.spy()}
      submittable
      toggle
    />);

    const faktaEkspandertpanel = wrapper.find(FaktaEkspandertpanel);
    expect(faktaEkspandertpanel).to.have.length(1);
    expect(faktaEkspandertpanel.prop('title')).to.eql('Fakta om fødsel og tilrettelegging');
    expect(faktaEkspandertpanel.prop('faktaId')).to.eql(faktaPanelCodes.FODSELTILRETTELEGGING);

    const faktaForm = faktaEkspandertpanel.find('Connect(Connect(ComponentWithRequiredProps(WithBehandlingForm)))');
    expect(faktaForm).to.have.length(1);
  });
});
