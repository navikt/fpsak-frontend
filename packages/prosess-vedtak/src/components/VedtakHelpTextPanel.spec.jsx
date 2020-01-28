import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import { VedtakHelpTextPanelImpl } from './VedtakHelpTextPanel';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-vedtak';

describe('<VedtakHelpTextPanel>', () => {
  it('skal vise hjelpetekst for vurdering av dokument når en har dette aksjonspunktet', () => {
    const wrapper = shallowWithIntl(<VedtakHelpTextPanelImpl
      intl={intlMock}
      aksjonspunktKoder={[aksjonspunktCodes.VURDERE_DOKUMENT]}
      readOnly={false}
    />);

    const helpText = wrapper.find(AksjonspunktHelpTextTemp);
    expect(helpText.prop('isAksjonspunktOpen')).is.true;
    expect(helpText.children()).to.have.length(1);
    expect(helpText.childAt(0).text()).is.eql('Vurder om den åpne oppgaven «Vurder dokument» påvirker behandlingen');
  });


  it('skal vise hjelpetekst for vurdering av dokument og vurdering av annen ytelse når en har disse aksjonspunktetene', () => {
    const wrapper = shallowWithIntl(<VedtakHelpTextPanelImpl
      intl={intlMock}
      aksjonspunktKoder={[aksjonspunktCodes.VURDERE_ANNEN_YTELSE, aksjonspunktCodes.VURDERE_DOKUMENT]}
      readOnly={false}
    />);

    const helpText = wrapper.find(AksjonspunktHelpTextTemp);
    expect(helpText.prop('isAksjonspunktOpen')).is.true;
    expect(helpText.children()).to.have.length(2);
    expect(helpText.childAt(0).text()).is.eql('Vurder om den åpne oppgaven «Vurder konsekvens for ytelse» påvirker behandlingen');
    expect(helpText.childAt(1).text()).is.eql('Vurder om den åpne oppgaven «Vurder dokument» påvirker behandlingen');
  });


  it('skal ikke vise hjelpetekst når en ikke har gitte aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<VedtakHelpTextPanelImpl
      intl={intlMock}
      aksjonspunktKoder={[aksjonspunktCodes.FORESLA_VEDTAK]}
      readOnly={false}
    />);

    expect(wrapper.find('HelpText')).to.have.length(0);
  });
});
