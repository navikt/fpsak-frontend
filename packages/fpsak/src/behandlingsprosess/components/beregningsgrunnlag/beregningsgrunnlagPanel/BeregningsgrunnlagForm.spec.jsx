import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';
import periodeAarsak from 'kodeverk/periodeAarsak';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { BeregningsgrunnlagForm as UnwrappedForm } from './BeregningsgrunnlagForm';
import GrunnlagForAarsinntektPanelAT from '../arbeidstaker/GrunnlagForAarsinntektPanelAT';
import GrunnlagForAarsinntektPanelFL from '../frilanser/GrunnlagForAarsinntektPanelFL';
import GrunnlagForAarsinntektPanelSN from '../selvstendigNaeringsdrivende/GrunnlagForAarsinntektPanelSN';
import OppsummeringSN from '../selvstendigNaeringsdrivende/OppsummeringSN';
import FastsettGrunnlagSN from '../selvstendigNaeringsdrivende/FastsettNaeringsinntektSN';

const arbeidstakerAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.ARBEIDSTAKER,
  },
  elementNavn: 'arbeidsgiver 1',
  beregnetPrAar: 100000,
  overstyrtPrAar: 150000,
  beregningsperiodeFom: '2014-01-01',
  beregningsperiodeTom: '2015-01-01',

};

const frilanserAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.FRILANSER,
  },
  elementNavn: 'frilansinntekt',
  beregnetPrAar: 200000,
  overstyrtPrAar: 250000,
  beregningsperiodeFom: '2015-01-01',
  beregningsperiodeTom: '2016-01-01',

};

const selvstedigNaeringsdrivendeAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  },
  elementNavn: 'pensjonsgivende inntekt',
  beregnetPrAar: 300000,
  overstyrtPrAar: 350000,
  beregningsperiodeFom: '2016-01-01',
  beregningsperiodeTom: '2017-01-01',

};

const atflAksjonspunkt = {
  id: 55,
  erAktivt: true,
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    navn: 'Fastsett varig brutto beregning ATFL',
  },
  toTrinnsBehandling: false,
  status: {
    kode: 'OPPR',
    navn: 'Opprettet',
  },
  begrunnelse: 'begrunnelse arbeidstaker/frilans',
  vilkarType: null,
  kanLoses: true,
};

const selvstendigAksjonspunkt = {
  id: 55,
  erAktivt: true,
  definisjon: {
    kode: aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    navn: 'Fastsett varig brutto beregning SN',
  },
  toTrinnsBehandling: false,
  status: {
    kode: 'OPPR',
    navn: 'Opprettet',
  },
  begrunnelse: 'begrunnelse selvstendig',
  vilkarType: null,
  kanLoses: true,
};

const selvstendigNyIArbAksjonspunkt = {
  id: 55,
  erAktivt: true,
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
    navn: 'Fastsett varig brutto beregning SN',
  },
  toTrinnsBehandling: false,
  status: {
    kode: 'OPPR',
    navn: 'Opprettet',
  },
  begrunnelse: 'begrunnelse selvstendig',
  vilkarType: null,
  kanLoses: true,
};


const perioder = [{
  periodeAarsaker: [{
    kode: periodeAarsak.UDEFINERT,
  }],
}];

const naeringsinntekt = 250000;

describe('<BeregningsgrunnlagForm>', () => {
  it('Skal teste at korrekte komponenter vises for arbeidstaker uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      beregnetAarsinntekt={naeringsinntekt}
      alleAndelerIForstePeriode={[arbeidstakerAndel]}
      allePerioder={perioder}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isArbeidstaker: true, isKombinasjonsstatus: true }}
      readOnlySubmitButton
    />);

    const atPanel = wrapper.find(GrunnlagForAarsinntektPanelAT);

    expect(atPanel).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN)).to.have.length(0);
    expect(wrapper.find(OppsummeringSN)).to.have.length(0);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(0);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(0);

    expect(atPanel.props().alleAndeler[0]).to.equal(arbeidstakerAndel);
    expect(atPanel.props().aksjonspunkt).to.equal(undefined);
  });

  it('Skal teste at korrekte komponenter vises for frilanser uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      beregnetAarsinntekt={naeringsinntekt}
      alleAndelerIForstePeriode={[frilanserAndel]}
      allePerioder={perioder}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isFrilanser: true, isKombinasjonsstatus: true }}
      readOnlySubmitButton
    />);

    const flPanel = wrapper.find(GrunnlagForAarsinntektPanelFL);

    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(0);
    expect(flPanel).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN)).to.have.length(0);
    expect(wrapper.find(OppsummeringSN)).to.have.length(0);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(0);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(0);

    expect(flPanel.props().alleAndeler[0]).to.equal(frilanserAndel);
    expect(flPanel.props().aksjonspunkt).to.equal(undefined);
  });

  it('Skal teste at korrekte komponenter vises for selvstendig næringsdrivende uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      beregnetAarsinntekt={naeringsinntekt}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel]}
      allePerioder={perioder}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isSelvstendigNaeringsdrivende: true }}
      readOnlySubmitButton
    />);

    const snPanel = wrapper.find(GrunnlagForAarsinntektPanelSN);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(0);
    expect(snPanel).to.have.length(1);
    expect(wrapper.find(OppsummeringSN)).to.have.length(0);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(0);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(0);

    expect(snPanel.props().alleAndeler[0]).to.equal(selvstedigNaeringsdrivendeAndel);
    expect(snPanel.props().aksjonspunkt).to.equal(undefined);
  });

  it('Skal teste at korrekte komponenter vises for selvstendig næringsdrivende med NyIArbeidslivet aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      beregnetAarsinntekt={naeringsinntekt}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel]}
      allePerioder={perioder}
      gjeldendeAksjonspunkt={selvstendigNyIArbAksjonspunkt}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isSelvstendigNaeringsdrivende: true }}
      readOnlySubmitButton
    />);

    const snPanel = wrapper.find(GrunnlagForAarsinntektPanelSN);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(0);
    expect(snPanel).to.have.length(1);
    expect(wrapper.find(OppsummeringSN)).to.have.length(0);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(1);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(1);

    expect(snPanel.props().alleAndeler[0]).to.equal(selvstedigNaeringsdrivendeAndel);
    expect(snPanel.props().aksjonspunkt).to.equal(undefined);
  });


  it('Skal teste at korrekte komponenter vises for selvstendig næringsdrivende / arbeidstaker med aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      gjeldendeAksjonspunkt={selvstendigAksjonspunkt}
      beregnetAarsinntekt={naeringsinntekt}
      allePerioder={perioder}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel, arbeidstakerAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isArbeidstaker: true, isSelvstendigNaeringsdrivende: true, isKombinasjonsstatus: true }}
      readOnlySubmitButton
    />);

    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN)).to.have.length(1);
    expect(wrapper.find(OppsummeringSN)).to.have.length(1);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(1);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(1);
    expect(wrapper.find(OppsummeringSN).props().alleAndeler).to.have.length(2);
  });

  it('Skal teste at korrekte komponenter vises for selvstendig næringsdrivende / frilanser uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      beregnetAarsinntekt={naeringsinntekt}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel, frilanserAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{
        isFrilanser: true,
        isSelvstendigNaeringsdrivende: true,
        isKombinasjonsstatus: true,
      }}
      readOnlySubmitButton
    />);

    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN)).to.have.length(1);
    expect(wrapper.find(OppsummeringSN)).to.have.length(1);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(0);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(0);
    expect(wrapper.find(OppsummeringSN).props().alleAndeler).to.have.length(2);
  });

  it('Skal teste at korrekte komponenter vises for arbeidstaker / frilanser med aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      allePerioder={perioder}
      gjeldendeAksjonspunkt={atflAksjonspunkt}
      beregnetAarsinntekt={naeringsinntekt}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel, frilanserAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{
        isArbeidstaker: true,
        isFrilanser: true,
        isKombinasjonsstatus: true,
      }}
      readOnlySubmitButton
    />);

    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN)).to.have.length(0);
    expect(wrapper.find(OppsummeringSN)).to.have.length(0);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(0);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(1);
  });

  it('Skal teste at korrekte komponenter vises for arbeidstaker / frilanser / selvstendig næringsdrivende med aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      allePerioder={perioder}
      gjeldendeAksjonspunkt={selvstendigAksjonspunkt}
      beregnetAarsinntekt={naeringsinntekt}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel, frilanserAndel, arbeidstakerAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{
        isArbeidstaker: true,
        isFrilanser: true,
        isSelvstendigNaeringsdrivende: true,
        isKombinasjonsstatus: true,
      }}
      readOnlySubmitButton
    />);

    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN)).to.have.length(1);
    expect(wrapper.find(OppsummeringSN)).to.have.length(1);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(1);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(1);
  });
});
