import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme/build';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

import { BeregningFormImpl, transformValues } from './BeregningForm';
import InntektsopplysningerPanel from '../fellesPaneler/InntektsopplysningerPanel';
import SkjeringspunktOgStatusPanel from '../fellesPaneler/SkjeringspunktOgStatusPanel';
import Beregningsgrunnlag from '../beregningsgrunnlagPanel/Beregningsgrunnlag';

const apVurderDekningsgrad = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_DEKNINGSGRAD,
    navn: 'apNavn2',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn2',
  },
  kanLoses: true,
  erAktivt: true,
};
const apFastsettBgATFL = {
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    navn: 'apNavn1',
  },
  status: {
    kode: 'UTFO',
    navn: 'statusNavn1',
  },
  kanLoses: false,
  erAktivt: false,
};
const apVurderVarigEndretEllerNyoppstartetSN = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    navn: 'apNavn3',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn3',
  },
  kanLoses: true,
  erAktivt: true,
};
const apFastsettBgSnNyIArbeidslivet = {
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
    navn: 'apNavn4',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn4',
  },
  kanLoses: true,
  erAktivt: true,
};
const apFastsettBgTidsbegrensetArbeidsforhold = {
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
    navn: 'apNavn5',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn5',
  },
  kanLoses: true,
  erAktivt: true,
};
const apEttLukketOgEttApent = [apFastsettBgATFL, apVurderDekningsgrad];
const allAndeler = [{
  aktivitetStatus: {
    kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  },
  elementNavn: 'arbeidsgiver 1',
  beregnetPrAar: 200000,
  overstyrtPrAar: 100,
}];
const allPerioder = [{
  bruttoPrAar: 300000,
  beregningsgrunnlagPrStatusOgAndel: allAndeler,
}];
const relevanteStatuser = {
  isArbeidstaker: true,
  isKombinasjonsstatus: true,
};

const lagBeregningsgrunnlag = (avvikPromille, årsinntektVisningstall,
  sammenligningSum, dekningsgrad, tilfeller) => ({
  sammenligningsgrunnlag: {
    avvikPromille,
    rapportertPrAar: sammenligningSum,
  },
  dekningsgrad,
  årsinntektVisningstall,
  faktaOmBeregning: {
    faktaOmBeregningTilfeller: tilfeller,
  },
});
const alleKodeverk = {
  test: 'test',
};
lagBeregningsgrunnlag(0, 100000, 100000, 100, []);
describe('<BeregningForm>', () => {
  it('skal teste at InntektsopplysningerPanel får korrekte props fra BeregningFP uten status SN', () => {
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      {...reduxFormPropsMock}
    />);
    const inntektpanel = wrapper.find(InntektsopplysningerPanel);
    expect(inntektpanel.props().beregnetAarsinntekt).to.have.equal(100000);
    expect(inntektpanel.props().sammenligningsgrunnlag).to.have.equal(100000);
    expect(inntektpanel.props().avvik).to.have.equal(0);
    expect(inntektpanel.props().sammenligningsgrunnlagTekst).to.have.length(2);
    expect(inntektpanel.props().sammenligningsgrunnlagTekst[0]).to.equal('Beregningsgrunnlag.Inntektsopplysninger.Sammenligningsgrunnlag');
    expect(inntektpanel.props().sammenligningsgrunnlagTekst[1]).to.equal('Beregningsgrunnlag.Inntektsopplysninger.Sum12Mnd');
  });
  it('skal teste at InntektsopplysningerPanel får korrekte props fra BeregningFP med status SN', () => {
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={{ isSelvstendigNaeringsdrivende: true }}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      {...reduxFormPropsMock}
    />);
    const inntektpanel = wrapper.find(InntektsopplysningerPanel);
    expect(inntektpanel.props().beregnetAarsinntekt).to.have.equal(100000);
    expect(inntektpanel.props().sammenligningsgrunnlag).to.have.equal(100000);
    expect(inntektpanel.props().avvik).to.have.equal(0);
    expect(inntektpanel.props().sammenligningsgrunnlagTekst).to.have.length(1);
    expect(inntektpanel.props().sammenligningsgrunnlagTekst[0]).to.equal('Beregningsgrunnlag.Inntektsopplysninger.OppgittInntekt');
  });
  it('skal teste at SkjeringspunktOgStatusPanel får korrekte props fra BeregningFP', () => {
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      {...reduxFormPropsMock}
    />);
    const skjeringspunktOgStatusPanel = wrapper.find(SkjeringspunktOgStatusPanel);
    expect(skjeringspunktOgStatusPanel.props().gjeldendeAksjonspunkter).to.equal(apEttLukketOgEttApent);
  });
  it('skal teste at Beregningsgrunnlag får korrekte props fra BeregningFP', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = true;
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      {...reduxFormPropsMock}
    />);
    const formName = 'BeregningForm';
    const beregningsgrunnlag = wrapper.find(Beregningsgrunnlag);
    expect(beregningsgrunnlag.props().relevanteStatuser).to.have.equal(relevanteStatuser);
    expect(beregningsgrunnlag.props().readOnly).to.have.equal(false);
    expect(beregningsgrunnlag.props().gjeldendeAksjonspunkter).to.have.equal(apEttLukketOgEttApent);
    expect(beregningsgrunnlag.props().formName).to.have.equal(formName);
    expect(beregningsgrunnlag.props().readOnlySubmitButton).to.have.equal(true);
    expect(beregningsgrunnlag.props().submitCallback).to.have.equal(sinon.spy);
  });
  it('skal teste at Beregningsgrunnlag ikke blir vist', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = false;
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      {...reduxFormPropsMock}
    />);
    const beregningsgrunnlag = wrapper.find(Beregningsgrunnlag);
    expect(beregningsgrunnlag).to.have.lengthOf(0);
  });
  it('skal teste et ett åpent aksjonspunkt og ett lukket aksjonspunkt blir vist riktig', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = false;
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      {...reduxFormPropsMock}
    />);
    const aksjonspunkter = wrapper.find(AksjonspunktHelpTextTemp);
    const aktiveAksjonspunkter = aksjonspunkter.get(0);
    const lukkedeAksjonspunkter = aksjonspunkter.get(1);
    expect(aksjonspunkter).to.have.lengthOf(2);
    expect(aktiveAksjonspunkter.props.children[0].key).to.have.equal('5087');
    expect(aktiveAksjonspunkter.props.isAksjonspunktOpen).to.have.equal(true);
    expect(aktiveAksjonspunkter.props.children[0].props.id).to.have.equal('Beregningsgrunnlag.Helptext.BarnetHarDødDeFørsteSeksUkene');
    expect(lukkedeAksjonspunkter.props.children[0].key).to.have.equal('5038');
    expect(lukkedeAksjonspunkter.props.isAksjonspunktOpen).to.have.equal(false);
    expect(lukkedeAksjonspunkter.props.children[0].props.id).to.have.equal('Beregningsgrunnlag.Helptext.Arbeidstaker');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5039, samt varigEndring', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
      erVarigEndretNaering: true,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5039');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5039, uten varigEndring', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
      erVarigEndretNaering: false,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5039');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5049', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apFastsettBgSnNyIArbeidslivet];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5049');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5047', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apFastsettBgTidsbegrensetArbeidsforhold];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5047');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5039', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5039');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087', () => {
    const values = {
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
    };
    const aksjonspunkt = [apVurderDekningsgrad];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5087');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5039', () => {
    const values = {
      fellesVurdering: 'bbb',
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkt = [apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5039');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5049', () => {
    const values = {
      fellesVurdering: 'bbb',
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkt = [apFastsettBgSnNyIArbeidslivet];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5049');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5047', () => {
    const values = {};
    const aksjonspunkt = [apFastsettBgTidsbegrensetArbeidsforhold];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5047');
  });
});
