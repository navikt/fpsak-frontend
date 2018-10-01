import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import { TilleggsopplysningerInfoPanelImpl } from './TilleggsopplysningerInfoPanel';

describe('<TilleggsopplysningerInfoPanel>', () => {
  it('skal vise faktapanel og form for tilleggsopplysninger', () => {
    const wrapper = shallowWithIntl(<TilleggsopplysningerInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={['tilleggsopplysninger']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly={false}
    />);

    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel).to.have.length(1);
    expect(panel.prop('title')).to.eql('Tilleggsopplysninger');
    expect(panel.prop('hasOpenAksjonspunkter')).is.true;
    expect(panel.prop('isInfoPanelOpen')).is.true;
    expect(panel.prop('faktaId')).to.eql('tilleggsopplysninger');

    const form = wrapper.find('Connect(TilleggsopplysningerFaktaFormImpl)');
    expect(form).to.have.length(1);
    expect(form.prop('readOnly')).is.false;
    expect(form.prop('submitting')).is.false;
  });

  it('skal vise lukket faktapanel når panelet er markert lukket', () => {
    const wrapper = shallowWithIntl(<TilleggsopplysningerInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly={false}
    />);

    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel.prop('isInfoPanelOpen')).is.false;
  });

  it('skal vise readonly form når ingen åpne aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<TilleggsopplysningerInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={['tilleggsopplysninger']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      readOnly={false}
    />);

    const form = wrapper.find('Connect(TilleggsopplysningerFaktaFormImpl)');
    expect(form.prop('readOnly')).is.true;
  });

  it('skal vise readonly form når ikke rettigheter', () => {
    const wrapper = shallowWithIntl(<TilleggsopplysningerInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={['tilleggsopplysninger']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly
    />);

    const form = wrapper.find('Connect(TilleggsopplysningerFaktaFormImpl)');
    expect(form.prop('readOnly')).is.true;
  });
});
