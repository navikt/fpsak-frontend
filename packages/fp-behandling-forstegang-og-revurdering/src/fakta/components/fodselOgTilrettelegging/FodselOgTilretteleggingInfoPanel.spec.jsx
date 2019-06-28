import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';

import { FaktaEkspandertpanel } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { FodselOgTilretteleggingInfoPanelImpl } from './FodselOgTilretteleggingInfoPanel';
import FodselOgTilretteleggingFaktaForm from './FodselOgTilretteleggingFaktaForm';

describe('<FodselOgTilretteleggingInfoPanel>', () => {
  it('skal vise ekspanderbart panel', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingInfoPanelImpl
      intl={intlMock}
      openInfoPanels={['fodseltilrettelegging']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      readOnly
      submitCallback={sinon.spy()}
      submittable
    />);

    const faktaEkspandertpanel = wrapper.find(FaktaEkspandertpanel);
    expect(faktaEkspandertpanel).has.length(1);
    expect(faktaEkspandertpanel.prop('title')).to.eql('Fakta om fødsel og tilrettelegging');
    expect(faktaEkspandertpanel.prop('faktaId')).to.eql(faktaPanelCodes.FODSELTILRETTELEGGING);
    const fodselOgTilretteleggingFaktaForm = faktaEkspandertpanel.find(FodselOgTilretteleggingFaktaForm);
    expect(fodselOgTilretteleggingFaktaForm).to.have.length(1);
  });
});
