import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { FormattedMessage } from 'react-intl';
import AksjonspunktHelpTextHTML from './AksjonspunktHelpTextHTML';

describe('<AksjonspunktHelpTextHTML>', () => {
  it('Skal teste at aksjonspunkt hjelp viser riktig', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktHelpTextHTML.WrappedComponent intl={intlMock}>
        {[<FormattedMessage
          key="1"
          id="Beregningsgrunnlag.Helptext.Arbeidstaker2"
          values={{ verdi: 23 }}
        />]}
      </AksjonspunktHelpTextHTML.WrappedComponent>,
    );
    const flexContainer = wrapper.find('FlexContainer');
    const messages = flexContainer.first().find('FormattedMessage');
    expect(messages.at(0).prop('id')).is.eql('Beregningsgrunnlag.Helptext.Arbeidstaker2');
    expect(messages.at(0).prop('values')).is.eql({ verdi: 23 });
    const image = flexContainer.first().find('Image');
    expect(image.length).to.equal(1);
  });
  it('Skal teste at aksjonspunkt hjelp ikke vises når ikke aksjonspunkt', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktHelpTextHTML.WrappedComponent intl={intlMock}>
        {[]}
      </AksjonspunktHelpTextHTML.WrappedComponent>,
    );
    const flexContainer = wrapper.find('FlexContainer');
    expect(flexContainer.length).to.equal(0);
  });
});
