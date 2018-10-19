import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import VurderOgFastsettATFL from './VurderOgFastsettATFL';
import LonnsendringForm from './forms/LonnsendringForm';
import NyoppstartetFLForm from './forms/NyoppstartetFLForm';
import FastsettATFLInntektForm from './forms/FastsettATFLInntektForm';
import InntektstabellPanel from '../InntektstabellPanel';

const showTableCallback = sinon.spy();


describe('<VurderOgFastsettATFL>', () => {
  it('Skal vise kun LonnsendringForm', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const wrapper = shallow(<VurderOgFastsettATFL.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfeller={tilfeller}
      formName="ikkeSåViktig"
      manglerInntektsmelding={false}
      showTableCallback={showTableCallback}
      erLonnsendring={undefined}
      erNyoppstartetFL={undefined}
    />);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm).to.have.length(1);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm).to.have.length(0);
    const fastsettATFLInntektForm = wrapper.find(FastsettATFLInntektForm);
    expect(fastsettATFLInntektForm).to.have.length(0);
  });
  it('Skal vise kun Lønnsendringsformen', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(<VurderOgFastsettATFL.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfeller={tilfeller}
      formName="ikkeSåViktig"
      manglerInntektsmelding={false}
      showTableCallback={showTableCallback}
      erLonnsendring={undefined}
      erNyoppstartetFL={undefined}
    />);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm).to.have.length(0);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm).to.have.length(1);
    const fastsettATFLInntektForm = wrapper.find(FastsettATFLInntektForm);
    expect(fastsettATFLInntektForm).to.have.length(0);
  });

  it('Skal vise LonnsendringForm, NyoppstartetFLForm i Inntektstabell', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(<VurderOgFastsettATFL.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfeller={tilfeller}
      formName="ikkeSåViktig"
      manglerInntektsmelding={false}
      showTableCallback={showTableCallback}
      erLonnsendring={undefined}
      erNyoppstartetFL={undefined}
    />);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm).to.have.length(1);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm).to.have.length(1);
    const inntektstabellPanel = wrapper.find(InntektstabellPanel);
    expect(inntektstabellPanel).to.have.length(1);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt lønnsendring og nyoppstartet FL', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(<VurderOgFastsettATFL.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfeller={tilfeller}
      formName="ikkeSåViktig"
      manglerInntektsmelding={false}
      showTableCallback={showTableCallback}
      erLonnsendring
      erNyoppstartetFL={false}
    />);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm.prop('skalViseInntektstabell')).to.eql(true);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm.prop('skalViseInntektstabell')).to.eql(false);
  });
});
