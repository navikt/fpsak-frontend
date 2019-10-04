import React from 'react';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Normaltekst } from 'nav-frontend-typografi';
import AksjonspunktHelpText from './AksjonspunktHelpText';
import Image from './Image';

describe('<AksjonspunktHelpText>', () => {
  it('skal vise hjelpetekst og ikon når aksjonspunkt er åpent', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktHelpText.WrappedComponent isAksjonspunktOpen intl={intlMock}>
        {[<FormattedMessage key="1" id="HelpText.Aksjonspunkt" />]}
      </AksjonspunktHelpText.WrappedComponent>,
    );
    expect(wrapper.find(Image)).to.have.length(1);
    expect(wrapper.find('Element').childAt(0).prop('id')).is.eql('HelpText.Aksjonspunkt');
  });

  it('skal kun vise hjelpetekst når aksjonspunkt er lukket', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktHelpText.WrappedComponent isAksjonspunktOpen={false} intl={intlMock}>
        {[<FormattedMessage key="1" id="HelpText.Aksjonspunkt" />]}
      </AksjonspunktHelpText.WrappedComponent>,
    );
    expect(wrapper.find(Image)).to.have.length(0);
    expect(wrapper.find(Normaltekst).childAt(1).prop('id')).is.eql('HelpText.Aksjonspunkt');
  });
});
