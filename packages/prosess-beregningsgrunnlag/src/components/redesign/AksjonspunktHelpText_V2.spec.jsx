import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { FormattedHTMLMessage } from 'react-intl';
import AksjonspunktHelpTextV2 from './AksjonspunktHelpText_V2';


describe('<AksjonspunktHelpText2>', () => {
  it('Skal teste at aksjonspunkt hjelp viser riktig', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktHelpTextV2.WrappedComponent intl={intlMock}>
        {[<FormattedHTMLMessage
          key="1"
          id="Beregningsgrunnlag.Helptext.Arbeidstaker2"
          values={{ verdi: 23 }}
        />]}
      </AksjonspunktHelpTextV2.WrappedComponent>,
    );
    const flexContainer = wrapper.find('FlexContainer');
    const messages = flexContainer.first().find('FormattedHTMLMessage');
    expect(messages.at(0).prop('id')).is.eql('Beregningsgrunnlag.Helptext.Arbeidstaker2');
    expect(messages.at(0).prop('values')).is.eql({ verdi: 23 });
    const image = flexContainer.first().find('Image');
    expect(image.length).to.equal(1);
  });
  it('Skal teste at aksjonspunkt hjelp ikke vises når ikke aksjonspunkt', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktHelpTextV2.WrappedComponent intl={intlMock}>
        {[]}
      </AksjonspunktHelpTextV2.WrappedComponent>,
    );
    const flexContainer = wrapper.find('FlexContainer');
    expect(flexContainer.length).to.equal(0);
  });
});
