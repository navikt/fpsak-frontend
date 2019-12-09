import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import AksjonspunktHelpTextV2 from './AksjonspunktHelpText_V2';


const aksjonspunkter = [{
  begrunnelse: null,
  definisjon: { kode: '5039' },
  status: { kode: 'OPPR' },
}];
describe('<AksjonspunktHelpText2>', () => {
  it('Skal teste at aksjonspunkt hjelp viser riktig', () => {
    const wrapper = shallowWithIntl(<AksjonspunktHelpTextV2.WrappedComponent
      apneAksjonspunkt={aksjonspunkter}
      intl={intlMock}
      avvikProsent={77}
      erVarigEndring
      erNyArbLivet={false}
      erNyoppstartett={false}
    />);
    const flexContainer = wrapper.find('FlexContainer');
    const messages = flexContainer.first().find('FormattedMessage');
    expect(messages.first().prop('id')).is.eql('Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende.VarigEndring.Ingress');
    expect(messages.at(1).prop('id')).is.eql('Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende.VarigEndring');
    const image = flexContainer.first().find('Image');
    expect(image.length).to.equal(1);
  });
  it('Skal teste at aksjonspunkt hjelp ikke vises når ikke aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<AksjonspunktHelpTextV2.WrappedComponent
      apneAksjonspunkt={[]}
      intl={intlMock}
      avvikProsent={77}
      erVarigEndring
      erNyArbLivet={false}
      erNyoppstartett={false}
    />);
    const flexContainer = wrapper.find('FlexContainer');
    expect(flexContainer.length).to.equal(0);
  });
});
