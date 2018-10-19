import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import { BeregningFPImpl as UnwrappedForm } from './BeregningFP';
import BeregningTable from './beregningsresultatPanel/BeregningsresultatTable';
import InntektsopplysningerPanel from './fellesPaneler/InntektsopplysningerPanel';

const beregningsgrunnlag = {
  halvG: 30000,
  ledetekstBrutto: 'Brutto tekst',
  ledetekstAvkortet: 'Avkortet tekst',
  ledetekstRedusert: 'Redusert tekst',
  skjaeringstidspunktBeregning: '12.12.2017',
  aktivitetStatus: [{
    aktivitetStatus: {
      kode: aktivitetStatus.ARBEIDSTAKER,
      navn: 'Arbeidstaker',
      kodeverk: 'test',
    },
  }],
};

const vilkar = {
  vilkarStatus: {
    kode: vilkarUtfallType.OPPFYLT,
  },
};

const aksjonpukter = ['test'];
describe('<BeregningFP>', () => {
  it('skal teste at BeregningTable får korrekte props fra BeregningFP', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      apCodes={aksjonpukter}
      readOnly={false}
      submitCallback={sinon.spy}
      beregnetAarsinntekt={100000}
      berGr={beregningsgrunnlag}
      gjeldendeVilkar={vilkar}
      relevanteStatuser={{}}
      aktivitetStatusCodes={[]}
      readOnlySubmitButton
    />);
    const beregning = wrapper.find(BeregningTable);
    expect(beregning.props().halvGVerdi).to.have.equal(30000);
    expect(beregning.props().ledetekstBrutto).to.have.equal('Brutto tekst');
    expect(beregning.props().ledetekstAvkortet).to.have.equal('Avkortet tekst');
    expect(beregning.props().ledetekstRedusert).to.have.equal('Redusert tekst');
  });

  it('skal teste at InntektsopplysningerPanel får korrekte props fra BeregningFP', () => {
    const statuser = {
      isArbeidstaker: true,
    };

    const wrapper = shallowWithIntl(<UnwrappedForm
      apCodes={aksjonpukter}
      readOnly={false}
      submitCallback={sinon.spy}
      beregnetAarsinntekt={100000}
      sammenligningsgrunnlag={100000}
      berGr={beregningsgrunnlag}
      isVilkarVurdert
      isArbeidstaker
      relevanteStatuser={statuser}
      aktivitetStatusCodes={[]}
      readOnlySubmitButton
    />);
    const inntektpanel = wrapper.find(InntektsopplysningerPanel);
    expect(inntektpanel.props().beregnetAarsinntekt).to.have.equal(100000);
    expect(inntektpanel.props().sammenligningsgrunnlag).to.have.equal(100000);
    expect(inntektpanel.props().sammenligningsgrunnlagTekst).to.have.length(2);
  });
});
