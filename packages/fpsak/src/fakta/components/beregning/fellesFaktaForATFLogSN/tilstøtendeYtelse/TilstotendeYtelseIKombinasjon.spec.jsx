import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/faktaOmBeregningTilfelle';
import InntektstabellPanel from '../InntektstabellPanel';
import { TilstotendeYtelseIKombinasjonImpl, erTilstotendeYtelseIKombinasjon } from './TilstotendeYtelseIKombinasjon';

describe('<TilstøtendeYtelseForm>', () => {
  it('skal rendre Inntektstabell med tidsbegrenset', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const wrapper = shallow(<TilstotendeYtelseIKombinasjonImpl
      readOnly={false}
      tilfeller={tilfeller}
      formName="test"
      isAksjonspunktClosed={false}
    />);
    const tyKombinasjon = wrapper.find(InntektstabellPanel);
    expect(tyKombinasjon).to.have.length(1);
    expect(tyKombinasjon.prop('children')).to.have.length(1);
  });
  it('skal rendre Inntektstabell med tidsbegrenset og nyoppstartet SN', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD, faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    const wrapper = shallow(<TilstotendeYtelseIKombinasjonImpl
      readOnly={false}
      tilfeller={tilfeller}
      formName="test"
      isAksjonspunktClosed={false}
    />);
    const tyKombinasjon = wrapper.find(InntektstabellPanel);
    expect(tyKombinasjon).to.have.length(1);
    expect(tyKombinasjon.prop('children')).to.have.length(2);
  });
  it('skal returnere true om det er tilstøtende ytelse i kombinasjon', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
      faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET, faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE];
    const tyKombinasjon = erTilstotendeYtelseIKombinasjon(tilfeller);
    expect(tyKombinasjon).to.equal(true);
  });
  it('skal returnere false om det kun er tilstøtende ytelse', () => {
    const tilfeller = [faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE];
    const tyKombinasjon = erTilstotendeYtelseIKombinasjon(tilfeller);
    expect(tyKombinasjon).to.equal(false);
  });
  it('skal returnere false om det ikkje er tilstøtende ytelse', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    const tyKombinasjon = erTilstotendeYtelseIKombinasjon(tilfeller);
    expect(tyKombinasjon).to.equal(false);
  });
});
