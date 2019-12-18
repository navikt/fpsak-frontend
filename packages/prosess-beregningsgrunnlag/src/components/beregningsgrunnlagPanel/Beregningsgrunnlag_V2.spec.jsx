import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import Beregningsgrunnlag2, { BeregningsgrunnlagImpl2, TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING } from './Beregningsgrunnlag_V2';
import GrunnlagForAarsinntektPanelAT2 from '../arbeidstaker/GrunnlagForAarsinntektPanelAT_V2';
import GrunnlagForAarsinntektPanelFL2 from '../frilanser/GrunnlagForAarsinntektPanelFL_V2';
import GrunnlagForAarsinntektPanelSN2 from '../selvstendigNaeringsdrivende/GrunnlagForAarsinntektPanelSN_V2';


import TilstotendeYtelser2 from '../tilstotendeYtelser/TilstotendeYtelser_V2';
import YtelserFraInfotrygd2 from '../tilstotendeYtelser/YtelserFraInfotrygd_V2';
import MilitaerPanel2 from '../militær/MilitaerPanel_V2';

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
    kode: aktivitetStatus.KUN_YTELSE,
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
const lagPerioderMedAndeler = (andelListe) => ([{
  bruttoPrAar: 200000,
  periodeAarsaker: [{
    kode: periodeAarsak.UDEFINERT,
  }],
  beregningsgrunnlagPrStatusOgAndel: andelListe,
}]);

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
const vurderAksjonspunktDekningsgrad = {
  id: 56,
  erAktivt: true,
  definisjon: {
    kode: aksjonspunktCodes.VURDER_DEKNINGSGRAD,
    navn: 'Vurder Dekningsgrad',
  },
  toTrinnsBehandling: false,
  status: {
    kode: 'OPPR',
    navn: 'Opprettet',
  },
  begrunnelse: 'begrunnelse dekningsgrad',
  vilkarType: null,
  kanLoses: true,
};

const formName = 'BeregningForm';
const alleKodeverk = {
  test: 'test',
};
describe('<Beregningsgrunnlag2>', () => {
  it('Skal teste at korrekte komponenter vises for arbeidstaker uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      allePerioder={lagPerioderMedAndeler([arbeidstakerAndel])}
      relevanteStatuser={{ isArbeidstaker: true, isKombinasjonsstatus: true }}
      gjeldendeAksjonspunkter={[]}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    const atPanel = wrapper.find(GrunnlagForAarsinntektPanelAT2);
    expect(atPanel).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN2)).to.have.length(0);
    expect(atPanel.props().alleAndeler[0]).to.equal(arbeidstakerAndel);
    expect(atPanel.props().aksjonspunkt).to.equal(undefined);
  });
  it('Skal teste at korrekte komponenter vises for frilanser uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      allePerioder={lagPerioderMedAndeler([frilanserAndel])}
      relevanteStatuser={{ isFrilanser: true, isKombinasjonsstatus: true }}
      gjeldendeAksjonspunkter={[]}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    const flPanel = wrapper.find(GrunnlagForAarsinntektPanelFL2);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT2)).to.have.length(0);
    expect(flPanel).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN2)).to.have.length(0);
    expect(flPanel.props().alleAndeler[0]).to.equal(frilanserAndel);
    expect(flPanel.props().aksjonspunkt).to.equal(undefined);
  });
  it('Skal teste at korrekte komponenter vises for selvstendig næringsdrivende uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      allePerioder={lagPerioderMedAndeler([selvstedigNaeringsdrivendeAndel])}
      relevanteStatuser={{ isSelvstendigNaeringsdrivende: true }}
      gjeldendeAksjonspunkter={[]}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    const snPanel = wrapper.find(GrunnlagForAarsinntektPanelSN2);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL2)).to.have.length(0);
    expect(snPanel).to.have.length(1);
    expect(snPanel.props().alleAndeler[0]).to.equal(selvstedigNaeringsdrivendeAndel);
    expect(snPanel.props().aksjonspunkt).to.equal(undefined);
  });
  it('Skal teste at korrekte komponenter vises for selvstendig næringsdrivende med NyIArbeidslivet aksjonspunkt', () => {
    const ap = [selvstendigNyIArbAksjonspunkt];
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      allePerioder={lagPerioderMedAndeler([selvstedigNaeringsdrivendeAndel])}
      gjeldendeAksjonspunkter={ap}
      relevanteStatuser={{ isSelvstendigNaeringsdrivende: true }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    const snPanel = wrapper.find(GrunnlagForAarsinntektPanelSN2);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL2)).to.have.length(0);
    expect(snPanel).to.have.length(1);

    expect(snPanel.props().alleAndeler[0]).to.equal(selvstedigNaeringsdrivendeAndel);
    expect(snPanel.props().aksjonspunkt).to.equal(undefined);
  });
  it('Skal teste at korrekte komponenter vises for selvstendig næringsdrivende / arbeidstaker med aksjonspunkt', () => {
    const ap = [selvstendigAksjonspunkt];
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      gjeldendeAksjonspunkter={ap}
      allePerioder={lagPerioderMedAndeler([selvstedigNaeringsdrivendeAndel, arbeidstakerAndel])}
      relevanteStatuser={{ isArbeidstaker: true, isSelvstendigNaeringsdrivende: true, isKombinasjonsstatus: true }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    expect(wrapper.find(MilitaerPanel2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT2)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN2)).to.have.length(1);
  });
  it('Skal teste at korrekte komponenter vises for selvstendig næringsdrivende / frilanser uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      allePerioder={lagPerioderMedAndeler([selvstedigNaeringsdrivendeAndel, frilanserAndel])}
      relevanteStatuser={{
        isFrilanser: true,
        isSelvstendigNaeringsdrivende: true,
        isKombinasjonsstatus: true,
      }}
      gjeldendeAksjonspunkter={[]}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    expect(wrapper.find(MilitaerPanel2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL2)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN2)).to.have.length(1);
  });
  it('Skal teste at korrekte komponenter vises for arbeidstaker / frilanser med aksjonspunkt', () => {
    const ap = [atflAksjonspunkt];
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      allePerioder={lagPerioderMedAndeler([selvstedigNaeringsdrivendeAndel, frilanserAndel])}
      gjeldendeAksjonspunkter={ap}
      relevanteStatuser={{
        isArbeidstaker: true,
        isFrilanser: true,
        isKombinasjonsstatus: true,
      }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    expect(wrapper.find(MilitaerPanel2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT2)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL2)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN2)).to.have.length(0);
  });
  it('Skal teste at korrekte komponenter vises for arbeidstaker / frilanser / selvstendig næringsdrivende med aksjonspunkt', () => {
    const ap = [selvstendigAksjonspunkt];
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      allePerioder={lagPerioderMedAndeler([selvstedigNaeringsdrivendeAndel, frilanserAndel, arbeidstakerAndel])}
      gjeldendeAksjonspunkter={ap}
      relevanteStatuser={{
        isArbeidstaker: true,
        isFrilanser: true,
        isSelvstendigNaeringsdrivende: true,
        isKombinasjonsstatus: true,
      }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    expect(wrapper.find(MilitaerPanel2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT2)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL2)).to.have.length(1);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN2)).to.have.length(1);
  });
  it('Skal teste at korrekte komponenter vises for dagpenger / aap uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      allePerioder={lagPerioderMedAndeler([aapAndel, dagpengerAndel])}
      gjeldendeAksjonspunkter={[]}
      relevanteStatuser={{ harDagpengerEllerAAP: true, isKombinasjonsstatus: false, isSelvstendigNaeringsdrivende: false }}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN2)).to.have.length(0);
    expect(wrapper.find(MilitaerPanel2)).to.have.length(0);
    expect(wrapper.find(TilstotendeYtelser2)).to.have.length(1);

    const ytelsePanel = wrapper.find(TilstotendeYtelser2);
    expect(ytelsePanel.props().gjelderBesteberegning).to.equal(false);
  });
  it('Skal teste at korrekte komponenter vises for andre tilstøtende ytelser uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      allePerioder={lagPerioderMedAndeler([tyAndel])}
      relevanteStatuser={{ harDagpengerEllerAAP: false, isKombinasjonsstatus: false, harAndreTilstotendeYtelser: true }}
      gjeldendeAksjonspunkter={[]}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN2)).to.have.length(0);
    expect(wrapper.find(TilstotendeYtelser2)).to.have.length(0);
    expect(wrapper.find(YtelserFraInfotrygd2)).to.have.length(1);
    expect(wrapper.find(MilitaerPanel2)).to.have.length(0);
  });
  it('Skal teste at korrekte komponenter vises for militær uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<BeregningsgrunnlagImpl2
      readOnly
      allePerioder={lagPerioderMedAndeler([militaerAndel])}
      relevanteStatuser={{ isMilitaer: true }}
      gjeldendeAksjonspunkter={[]}
      readOnlySubmitButton
      gjelderBesteberegning={false}
      alleKodeverk={alleKodeverk}
      behandlingId={1}
      behandlingVersjon={1}
      formName={formName}
    />);
    expect(wrapper.find(GrunnlagForAarsinntektPanelAT2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelFL2)).to.have.length(0);
    expect(wrapper.find(GrunnlagForAarsinntektPanelSN2)).to.have.length(0);
    expect(wrapper.find(TilstotendeYtelser2)).to.have.length(0);
    expect(wrapper.find(YtelserFraInfotrygd2)).to.have.length(0);
    expect(wrapper.find(MilitaerPanel2)).to.have.length(1);
  });
  it('Skal teste buildInitialValues med ATFL og vurderDekningsgrad aksjonspunkt', () => {
    const aksjonspunkter = [vurderAksjonspunktDekningsgrad, atflAksjonspunkt];
    const values = Beregningsgrunnlag2.buildInitialValues(aksjonspunkter);
    expect(values[TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING]).to.equal('begrunnelse dekningsgrad');
    expect(values.ATFLVurdering).to.equal('begrunnelse arbeidstaker/frilans');
  });
  it('Skal teste buildInitialValues uten aksjonspunkter', () => {
    const aksjonspunkter = [];
    const values = Beregningsgrunnlag2.buildInitialValues(aksjonspunkter);
    expect(values[TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING]).to.equal('');
    expect(values.ATFLVurdering).to.equal('');
  });
  it('Skal teste at transformValues gir forventet resultat  ', () => {
    const values = {
      ATFLVurdering: 'aaa',
      inntektFrilanser: 100,
    };
    const transformedValues = Beregningsgrunnlag2.transformValues(values, []);
    expect(transformedValues.kode).to.equal('5047');
    expect(transformedValues.begrunnelse).to.equal('aaa');
    expect(transformedValues.fastsatteTidsbegrensedePerioder).to.lengthOf(0);
    expect(transformedValues.frilansInntekt).to.equal(100);
  });
});
