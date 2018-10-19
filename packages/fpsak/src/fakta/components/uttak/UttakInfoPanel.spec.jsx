import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import { UttakInfoPanelImpl } from './UttakInfoPanel';
import UttakFaktaForm from './UttakFaktaForm';

const førsteUttaksDato = '2018-08-01';

describe('<UttakInfoPanel>', () => {
  it('skal vise UttakInfoPanel', () => {
    const toggleInfoPanelCallback = sinon.spy();

    const wrapper = shallowWithIntl(<UttakInfoPanelImpl
      intl={intlMock}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      submitValidation={sinon.spy()}
      openInfoPanels={[]}
      readOnly
      hasOpenAksjonspunkter
      aksjonspunkter={[]}
      førsteUttaksDato={førsteUttaksDato}
      initialUttaksPerioder={[]}
      handleSubmit={sinon.spy()}
      isRevurdering={false}
      hasStatusUtredes
    />);

    const faktaEkspandertpanel = wrapper.find(FaktaEkspandertpanel);
    const form = faktaEkspandertpanel.find('form');
    const uttakFaktaForm = faktaEkspandertpanel.find(UttakFaktaForm);
    expect(faktaEkspandertpanel).to.have.length(1);
    expect(form).to.have.length(1);
    expect(uttakFaktaForm).to.have.length(1);
  });

  it('skal vise error melding hvis det er noe error', () => {
    const toggleInfoPanelCallback = sinon.spy();
    const formProps = {
      error: 'Perioder overlapper',
    };
    const wrapper = shallowWithIntl(<UttakInfoPanelImpl
      intl={intlMock}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      submitValidation={sinon.spy()}
      openInfoPanels={[]}
      readOnly
      hasOpenAksjonspunkter
      aksjonspunkter={[]}
      førsteUttaksDato={førsteUttaksDato}
      initialUttaksPerioder={[]}
      handleSubmit={sinon.spy()}
      isRevurdering={false}
      hasStatusUtredes
      {...formProps}
    />);
    const span = wrapper.find('span');
    expect(span).to.have.length(1);
    expect(span.text()).to.equal('Perioder overlapper');
  });

  it('skal ikke vise error melding hvis det er ikke noe error', () => {
    const toggleInfoPanelCallback = sinon.spy();
    const wrapper = shallowWithIntl(<UttakInfoPanelImpl
      intl={intlMock}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      submitValidation={sinon.spy()}
      openInfoPanels={[]}
      readOnly
      hasOpenAksjonspunkter
      aksjonspunkter={[]}
      initialUttaksPerioder={[]}
      handleSubmit={sinon.spy()}
      førsteUttaksDato={førsteUttaksDato}
      isRevurdering={false}
      hasStatusUtredes
    />);
    const span = wrapper.find('span');
    expect(span).to.have.length(0);
  });
});
