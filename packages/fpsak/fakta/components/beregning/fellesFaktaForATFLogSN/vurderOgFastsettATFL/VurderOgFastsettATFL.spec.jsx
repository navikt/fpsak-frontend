import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/faktaOmBeregningTilfelle';
import VurderOgFastsettATFL from './VurderOgFastsettATFL';
import LonnsendringForm from './forms/LonnsendringForm';
import NyoppstartetFLForm from './forms/NyoppstartetFLForm';
import FastsettATFLInntektForm from './forms/FastsettATFLInntektForm';

describe('<VurderOgFastsettATFL>', () => {
  it('Skal vise kun LonnsendringForm', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const wrapper = shallow(<VurderOgFastsettATFL.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      skalViseATFLTabell={false}
      tilfeller={tilfeller}
      formName="ikkeSåViktig"
      manglerInntektsmelding={false}
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
      skalViseATFLTabell={false}
      tilfeller={tilfeller}
      formName="ikkeSåViktig"
      manglerInntektsmelding={false}
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

  it('Skal vise LonnsendringForm, NyoppstartetFLForm og FastsettATFLInntektForm', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(<VurderOgFastsettATFL.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      skalViseATFLTabell
      tilfeller={tilfeller}
      formName="ikkeSåViktig"
      manglerInntektsmelding={false}
      erLonnsendring={undefined}
      erNyoppstartetFL={undefined}
    />);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm).to.have.length(1);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm).to.have.length(1);
    const fastsettATFLInntektForm = wrapper.find(FastsettATFLInntektForm);
    expect(fastsettATFLInntektForm).to.have.length(1);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt lønnsendring og nyoppstartet FL', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(<VurderOgFastsettATFL.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      skalViseATFLTabell
      tilfeller={tilfeller}
      formName="ikkeSåViktig"
      manglerInntektsmelding={false}
      erLonnsendring
      erNyoppstartetFL={false}
    />);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm.prop('skalViseInntektstabell')).to.eql(true);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm.prop('skalViseInntektstabell')).to.eql(false);
  });

  it('Skal teste at underkomponenter mottar korrekt prop for radioknapp overskrift når ikke det er spesialtilfelle', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const overskriftNyoppstartteFL = ['BeregningInfoPanel.VurderOgFastsettATFL.ErSokerNyoppstartetFL'];
    const overskriftLonnsendring = ['BeregningInfoPanel.VurderOgFastsettATFL.HarSokerEndring'];

    const wrapper = shallow(<VurderOgFastsettATFL.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      skalViseATFLTabell={false}
      tilfeller={tilfeller}
      formName="ikkeSåViktig"
      manglerInntektsmelding
      erLonnsendring
      erNyoppstartetFL
    />);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm.prop('radioknappOverskrift')).to.deep.eql(overskriftLonnsendring);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm.prop('radioknappOverskrift')).to.deep.eql(overskriftNyoppstartteFL);
  });

  it('Skal teste at underkomponenter mottar korrekt prop for radioknapp overskrift når det er spesialtilfelle', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const overskriftNyoppstartteFL = [
      'BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgUtenIM',
      'BeregningInfoPanel.VurderOgFastsettATFL.OgsaNyoppstartetFL'];
    const overskriftLonnsendring = ['BeregningInfoPanel.VurderOgFastsettATFL.HarSokerEndring'];

    const wrapper = shallow(<VurderOgFastsettATFL.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      skalViseATFLTabell
      tilfeller={tilfeller}
      formName="ikkeSåViktig"
      manglerInntektsmelding
      erLonnsendring
      erNyoppstartetFL={false}
    />);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm.prop('radioknappOverskrift')).to.deep.eql(overskriftLonnsendring);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm.prop('radioknappOverskrift')).to.deep.eql(overskriftNyoppstartteFL);
  });
});
