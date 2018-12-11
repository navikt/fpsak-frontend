import React from 'react';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import AksjonspunktHelpText from './AksjonspunktHelpText';

describe('<AksjonspunktHelpText>', () => {
  it('skal vise hjelpetekst og ikon når aksjonspunkt er åpent', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktHelpText isAksjonspunktOpen intl={intlMock}>
        {[<FormattedMessage key="1" id="HelpText.Aksjonspunkt" />]}
      </AksjonspunktHelpText>,
    );
    expect(wrapper.find('InjectIntl(Image)')).to.have.length(1);
    expect(wrapper.find('Element').childAt(0).prop('id')).is.eql('HelpText.Aksjonspunkt');
  });

  it('skal kun vise hjelpetekst når aksjonspunkt er lukket', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktHelpText isAksjonspunktOpen={false}>
        {[<FormattedMessage key="1" id="HelpText.Aksjonspunkt" />]}
      </AksjonspunktHelpText>,
    );
    expect(wrapper.find('InjectIntl(Image)')).to.have.length(0);
    expect(wrapper.find('Normaltekst').childAt(2).prop('id')).is.eql('HelpText.Aksjonspunkt');
  });
});
