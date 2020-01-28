import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { TilleggsopplysningerInfoPanel } from './TilleggsopplysningerInfoPanel';
import TilleggsopplysningerFaktaForm from './TilleggsopplysningerFaktaForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-tilleggsopplysninger';

describe('<TilleggsopplysningerInfoPanel>', () => {
  it('skal vise faktapanel og form for tilleggsopplysninger', () => {
    const wrapper = shallowWithIntl(<TilleggsopplysningerInfoPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={['tilleggsopplysninger']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly={false}
      behandlingId={1}
      behandlingVersjon={1}
    />);

    const form = wrapper.find(TilleggsopplysningerFaktaForm);
    expect(form).to.have.length(1);
    expect(form.prop('readOnly')).is.false;
    expect(form.prop('submitting')).is.false;
  });

  it('skal vise readonly form når ingen åpne aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<TilleggsopplysningerInfoPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={['tilleggsopplysninger']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      readOnly={false}
      behandlingId={1}
      behandlingVersjon={1}
    />);

    const form = wrapper.find(TilleggsopplysningerFaktaForm);
    expect(form.prop('readOnly')).is.true;
  });

  it('skal vise readonly form når ikke rettigheter', () => {
    const wrapper = shallowWithIntl(<TilleggsopplysningerInfoPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={['tilleggsopplysninger']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly
      behandlingId={1}
      behandlingVersjon={1}
    />);

    const form = wrapper.find(TilleggsopplysningerFaktaForm);
    expect(form.prop('readOnly')).is.true;
  });
});
