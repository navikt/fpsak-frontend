import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import BehandlingspunktSubmitButton from 'behandlingFpsak/behandlingsprosess/components/BehandlingspunktSubmitButton';
import { reduxFormPropsMock } from '@fpsak-frontend/assets/testHelpers/redux-form-test-helper';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BeregningsgrunnlagForm as UnwrappedForm } from './BeregningsgrunnlagForm';
import GrunnlagForAarsinntektPanelAT from '../arbeidstaker/GrunnlagForAarsinntektPanelAT';
import GrunnlagForAarsinntektPanelFL from '../frilanser/GrunnlagForAarsinntektPanelFL';
import GrunnlagForAarsinntektPanelSN from '../selvstendigNaeringsdrivende/GrunnlagForAarsinntektPanelSN';
import OppsummeringSN from '../selvstendigNaeringsdrivende/OppsummeringSN';
import FastsettGrunnlagSN from '../selvstendigNaeringsdrivende/FastsettNaeringsinntektSN';
import TilstotendeYtelser from '../tilstotendeYtelser/TilstotendeYtelser';
import YtelserFraInfotrygd from '../tilstotendeYtelser/YtelserFraInfotrygd';
import MilitaerPanel from '../militær/MilitaerPanel';

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

const tyAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.TILSTOTENDE_YTELSE,
  },
  beregnetPrAar: 300000,
  beregningsperiodeFom: '2016-01-01',
  beregningsperiodeTom: '2017-01-01',
};

const dagpengerAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.DAGPENGER,
  },
  beregnetPrAar: 300000,
  beregningsperiodeFom: '2016-01-01',
  beregningsperiodeTom: '2017-01-01',
};

const aapAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.ARBEIDSAVKLARINGSPENGER,
  },
  beregnetPrAar: 300000,
  beregningsperiodeFom: '2016-01-01',
  beregningsperiodeTom: '2017-01-01',
};

const militaerAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.MILITAER_ELLER_SIVIL,
  },
  beregnetPrAar: 300000,
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
  bruttoPrAar: 200000,
  periodeAarsaker: [{
    kode: periodeAarsak.UDEFINERT,
  }],
}];

const inntekt = 250000;

describe('<BeregningsgrunnlagForm>', () => {
  it('Skal teste at korrekte komponenter vises for arbeidstaker uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      beregnetAarsinntekt={inntekt}
      alleAndelerIForstePeriode={[arbeidstakerAndel]}
      allePerioder={perioder}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isArbeidstaker: true, isKombinasjonsstatus: true }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
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
      beregnetAarsinntekt={inntekt}
      alleAndelerIForstePeriode={[frilanserAndel]}
      allePerioder={perioder}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isFrilanser: true, isKombinasjonsstatus: true }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
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
      beregnetAarsinntekt={inntekt}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel]}
      allePerioder={perioder}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isSelvstendigNaeringsdrivende: true }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
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
      beregnetAarsinntekt={inntekt}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel]}
      allePerioder={perioder}
      gjeldendeAksjonspunkt={selvstendigNyIArbAksjonspunkt}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isSelvstendigNaeringsdrivende: true }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
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
      beregnetAarsinntekt={inntekt}
      allePerioder={perioder}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel, arbeidstakerAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isArbeidstaker: true, isSelvstendigNaeringsdrivende: true, isKombinasjonsstatus: true }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
    />);

    expect(wrapper.find(MilitaerPanel)).to.have.length(0);
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
      beregnetAarsinntekt={inntekt}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel, frilanserAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{
        isFrilanser: true,
        isSelvstendigNaeringsdrivende: true,
        isKombinasjonsstatus: true,
      }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
    />);

    expect(wrapper.find(MilitaerPanel)).to.have.length(0);
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
      beregnetAarsinntekt={inntekt}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel, frilanserAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{
        isArbeidstaker: true,
        isFrilanser: true,
        isKombinasjonsstatus: true,
      }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
    />);

    expect(wrapper.find(MilitaerPanel)).to.have.length(0);
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
      beregnetAarsinntekt={inntekt}
      alleAndelerIForstePeriode={[selvstedigNaeringsdrivendeAndel, frilanserAndel, arbeidstakerAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{
        isArbeidstaker: true,
        isFrilanser: true,
        isSelvstendigNaeringsdrivende: true,
        isKombinasjonsstatus: true,
      }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
    />);

    expect(wrapper.find(MilitaerPanel)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN)).to.have.length(1);
    expect(wrapper.find(OppsummeringSN)).to.have.length(1);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(1);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(1);
  });

  it('Skal teste at korrekte komponenter vises for dagpenger / aap', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      allePerioder={perioder}
      gjeldendeAksjonspunkt={undefined}
      beregnetAarsinntekt={inntekt}
      alleAndelerIForstePeriode={[aapAndel, dagpengerAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ harDagpengerEllerAAP: true, isKombinasjonsstatus: false, isSelvstendigNaeringsdrivende: false }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
    />);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN)).to.have.length(0);
    expect(wrapper.find(OppsummeringSN)).to.have.length(0);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(0);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(0);
    expect(wrapper.find(MilitaerPanel)).to.have.length(0);
    expect(wrapper.find(TilstotendeYtelser)).to.have.length(1);

    const ytelsePanel = wrapper.find(TilstotendeYtelser);
    expect(ytelsePanel.props().skalViseOppjustertGrunnlag).to.equal(false);
  });

  it('Skal teste at korrekte komponenter vises for andre tilstøtende ytelser', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      allePerioder={perioder}
      gjeldendeAksjonspunkt={undefined}
      beregnetAarsinntekt={inntekt}
      alleAndelerIForstePeriode={[tyAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ harDagpengerEllerAAP: false, isKombinasjonsstatus: false, harAndreTilstotendeYtelser: true }}
      readOnlySubmitButton
      tilstøtendeYtelseType="Sykepeger"
      gjelderBesteberegning={false}
    />);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN)).to.have.length(0);
    expect(wrapper.find(OppsummeringSN)).to.have.length(0);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(0);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(0);
    expect(wrapper.find(TilstotendeYtelser)).to.have.length(0);
    expect(wrapper.find(YtelserFraInfotrygd)).to.have.length(1);
    expect(wrapper.find(MilitaerPanel)).to.have.length(0);
  });

  it('Skal teste at korrekte komponenter vises for militær', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      submitCallback={sinon.spy()}
      readOnly
      allePerioder={perioder}
      gjeldendeAksjonspunkt={undefined}
      beregnetAarsinntekt={inntekt}
      alleAndelerIForstePeriode={[militaerAndel]}
      harTidligeregrunnlag={false}
      relevanteStatuser={{ isMilitaer: true }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
    />);

    expect(wrapper.find(GrunnlagForAarsinntektPanelAT)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN)).to.have.length(0);
    expect(wrapper.find(OppsummeringSN)).to.have.length(0);
    expect(wrapper.find(FastsettGrunnlagSN)).to.have.length(0);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(0);
    expect(wrapper.find(TilstotendeYtelser)).to.have.length(0);
    expect(wrapper.find(YtelserFraInfotrygd)).to.have.length(0);
    expect(wrapper.find(MilitaerPanel)).to.have.length(1);
  });
});
