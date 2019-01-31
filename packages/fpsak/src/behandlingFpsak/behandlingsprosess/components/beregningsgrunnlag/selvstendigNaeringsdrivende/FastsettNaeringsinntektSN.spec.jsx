import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FastsettNaeringsinntektSN, { FastsettNaeringsinntektSNImpl } from './FastsettNaeringsinntektSN';

const varigEndretNaeringBeg = 'Dette er en begrunnelse for varig endret næring';
const fastsettBruttoBeg = 'Dette er en begrunnelse for fastsett brutto næringsinntekt';

const periode1 = {
  bruttoPrAar: 300000,
  beregningsgrunnlagPrStatusOgAndel: [
    {
      aktivitetStatus: {
        kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
      },
      elementNavn: 'arbeidsgiver 1',
      beregnetPrAar: 200000,
      overstyrtPrAar: 100,
    },
  ],
};
const periode2 = {
  bruttoPrAar: 300000,
  beregningsgrunnlagPrStatusOgAndel: [
    {
      aktivitetStatus: {
        kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
      },
      elementNavn: 'arbeidsgiver 1',
      beregnetPrAar: 200000,
    },
  ],
};
const varigEndringAP = {
  definisjon: {
    navn: 'test',
    kode: aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  },
  status: {
    navn: 'test',
    kode: aksjonspunktStatus.UTFORT,
  },
  kanLoses: true,
  erAktivt: true,
  begrunnelse: varigEndretNaeringBeg,
};
const varigEndringOgFastsettBruttoAP1 = [
  {
    definisjon: {
      navn: 'test',
      kode: aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    },
    status: {
      navn: 'test',
      kode: aksjonspunktStatus.UTFORT,
    },
    kanLoses: true,
    erAktivt: true,
    begrunnelse: varigEndretNaeringBeg,
  },
  {
    definisjon: {
      navn: 'test',
      kode: aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
    },
    status: {
      navn: 'test',
      kode: aksjonspunktStatus.UTFORT,
    },
    kanLoses: true,
    erAktivt: true,
    begrunnelse: fastsettBruttoBeg,
  },
];
const varigEndringUtenBegrunnelseAP = [
  {
    definisjon: {
      navn: 'test',
      kode: aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    },
    status: {
      navn: 'test',
      kode: aksjonspunktStatus.OPPRETTET,
    },
    kanLoses: true,
    erAktivt: true,
  },
];
const nyIArbeidslivetAP = {
  definisjon: {
    navn: 'test',
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  },
  status: {
    navn: 'test',
    kode: aksjonspunktStatus.UTFORT,
  },
  kanLoses: true,
  erAktivt: true,
  begrunnelse: varigEndretNaeringBeg,
};
const nyIArbeidslivetUtenBegrunnelseAP = {
  definisjon: {
    navn: 'test',
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  },
  status: {
    navn: 'test',
    kode: aksjonspunktStatus.UTFORT,
  },
  kanLoses: true,
  erAktivt: true,
};
const vurderDekningsgradAP = {
  definisjon: {
    navn: 'test',
    kode: aksjonspunktCodes.VURDER_DEKNINGSGRAD,
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
    navn: 'test',
  },
  kanLoses: true,
  erAktivt: true,
  begrunnelse: varigEndretNaeringBeg,
};

describe('<FastsettNaeringsinntektSN>', () => {
  it('skal teste at de korrekte komponentene blir satt hvis det ikke er varig endret næring', () => {
    const ap = [varigEndringAP];
    const wrapper = shallowWithIntl(<FastsettNaeringsinntektSNImpl
      intl={intlMock}
      isAksjonspunktClosed={false}
      readOnly={false}
      gjeldendeAksjonspunkter={ap}
      alleAndeler={periode1.beregningsgrunnlagPrStatusOgAndel}
      erVarigEndretNaering={false}
    />);
    const radios = wrapper.find('RadioOption');
    const textarea = wrapper.find('TextAreaField');
    expect(radios).to.have.length(2);
    expect(textarea).to.have.length(1);
  });
  it('skal teste at de korrekte komponentene blir satt hvis det er varig endret næring', () => {
    const wrapper = shallowWithIntl(<FastsettNaeringsinntektSNImpl
      intl={intlMock}
      readOnly={false}
      erVarigEndretNaering
      isAksjonspunktClosed={false}
      gjeldendeAksjonspunkter={varigEndringOgFastsettBruttoAP1}
      alleAndeler={periode1.beregningsgrunnlagPrStatusOgAndel}
    />);
    const radios = wrapper.find('RadioOption');
    const textarea = wrapper.find('TextAreaField');
    const inputfield = wrapper.find('InputField');
    expect(radios).to.have.length(2);
    expect(textarea).to.have.length(2);
    expect(inputfield).to.have.length(1);
  });
  it('skal teste at de korrekte komponentene blir satt hvis aksjonspunkt er å fastsette næringsinntekt for sn ny i arbeidslivet', () => {
    const ap = [nyIArbeidslivetAP];
    const wrapper = shallowWithIntl(<FastsettNaeringsinntektSNImpl
      intl={intlMock}
      isAksjonspunktClosed={false}
      readOnly={false}
      gjeldendeAksjonspunkter={ap}
      alleAndeler={periode1.beregningsgrunnlagPrStatusOgAndel}
      erVarigEndretNaering={false}
    />);
    const radios = wrapper.find('RadioOption');
    const textarea = wrapper.find('TextAreaField');
    const inputs = wrapper.find('InputField');
    expect(radios).to.have.length(0);
    expect(inputs).to.have.length(1);
    expect(inputs.props().label.id).to.have.equal('Beregningsgrunnlag.FastsettSelvstendigNaeringForm.BruttoBerGr');
    expect(textarea).to.have.length(1);
    expect(textarea.props().label.props.id).to.have.equal('Beregningsgrunnlag.Forms.Vurdering');
  });
  it('skal teste at de korrekte komponentene blir satt med aksjonspunktene ny i arbeidslivet og vurder dekningsgrad',
    () => {
      const aksjonspunkter = [vurderDekningsgradAP, nyIArbeidslivetAP];
      const wrapper = shallowWithIntl(<FastsettNaeringsinntektSNImpl
        intl={intlMock}
        isAksjonspunktClosed={false}
        readOnly={false}
        gjeldendeAksjonspunkter={aksjonspunkter}
        alleAndeler={periode1.beregningsgrunnlagPrStatusOgAndel}
        erVarigEndretNaering={false}
      />);
      const radios = wrapper.find('RadioOption');
      const textarea = wrapper.find('TextAreaField');
      const inputs = wrapper.find('InputField');
      expect(radios).to.have.length(0);
      expect(inputs).to.have.length(1);
      expect(textarea).to.have.length(1);
      expect(textarea.props().label.props.id).to.have.equal('Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag');
    });
  it('skal teste at buildInitialValues returnerer undefined når aksjonspunkter er undefined', () => {
    const initialValues = FastsettNaeringsinntektSN.buildInitialValues(periode1.beregningsgrunnlagPrStatusOgAndel, undefined);
    expect(initialValues).to.eql(undefined);
  });
  it('skal teste at buildInitialValues returnerer undefined når ingen aksjonspunkt', () => {
    const initialValues = FastsettNaeringsinntektSN.buildInitialValues(periode1.beregningsgrunnlagPrStatusOgAndel, []);
    expect(initialValues).to.eql(undefined);
  });
  it('skal teste at buildInitialValues returnerer undefined når ingen perioder', () => {
    const initialValues = FastsettNaeringsinntektSN.buildInitialValues([], varigEndringOgFastsettBruttoAP1);
    expect(initialValues).to.eql(undefined);
  });
  it('skal teste at de korrekte props blir satt med buildInitialValues med varig endring og fastsett brutto aksjonspunkt', () => {
    const initialValues = FastsettNaeringsinntektSN.buildInitialValues(periode1.beregningsgrunnlagPrStatusOgAndel, varigEndringOgFastsettBruttoAP1);
    expect(initialValues).to.eql({
      bruttoBeregningsgrunnlag: formatCurrencyNoKr(100),
      erVarigEndretNaering: true,
      fellesVurdering: varigEndretNaeringBeg,
      vurderFastsettBruttoBeregningsgrunnlag: fastsettBruttoBeg,
    });
  });
  it('skal teste at de korrekte props blir satt med buildInitialValues med kun varig endring aksjonspunkt ', () => {
    const initialValues = FastsettNaeringsinntektSN.buildInitialValues(periode2.beregningsgrunnlagPrStatusOgAndel, varigEndringUtenBegrunnelseAP);
    expect(initialValues).to.eql({
      bruttoBeregningsgrunnlag: '',
      erVarigEndretNaering: undefined,
      fellesVurdering: '',
      vurderFastsettBruttoBeregningsgrunnlag: '',
    });
  });
  it('skal teste at de korrekte props blir satt med buildInitialValues med SN ny i arbeidslivet aksjonspunkt', () => {
    const aksjonspunkter = [nyIArbeidslivetAP];
    const initialValues = FastsettNaeringsinntektSN.buildInitialValues(periode1.beregningsgrunnlagPrStatusOgAndel, aksjonspunkter);
    expect(initialValues).to.eql({
      bruttoBeregningsgrunnlag: formatCurrencyNoKr(100),
      fellesVurdering: varigEndretNaeringBeg,
    });
  });
  it('skal teste at de korrekte props blir satt med buildInitialValues med SN ny i arbeidslivet aksjonspunkt', () => {
    const aksjonspunkter = [nyIArbeidslivetUtenBegrunnelseAP];
    const initialValues = FastsettNaeringsinntektSN.buildInitialValues(periode2.beregningsgrunnlagPrStatusOgAndel, aksjonspunkter);
    expect(initialValues).to.eql({
      bruttoBeregningsgrunnlag: '',
      fellesVurdering: '',
    });
  });
  it('skal teste at SN ny i arbeidslivet blir transformert riktig', () => {
    const aksjonspunkter = [nyIArbeidslivetAP];
    const values = {
      fellesVurdering: 'vurdering',
      bruttoBeregningsgrunnlag: 100,
    };
    const transformedValues = FastsettNaeringsinntektSN.transformValues(values, aksjonspunkter);
    expect(transformedValues).to.eql([{
      kode: '5049',
      begrunnelse: 'vurdering',
      bruttoBeregningsgrunnlag: 100,
    }]);
  });
  it('skal teste transformValues for aksjonspunkt varigEndringAP hvor varEndring er false', () => {
    const aksjonspunkter = [varigEndringAP];
    const values = {
      fellesVurdering: 'vurdering',
      erVarigEndretNaering: false,
    };
    const transformedValues = FastsettNaeringsinntektSN.transformValues(values, aksjonspunkter);
    expect(transformedValues).to.eql([{
      kode: '5039',
      begrunnelse: 'vurdering',
      erVarigEndretNaering: false,
    }]);
  });
  it('skal teste transformValues for aksjonspunkt varigEndringAP hvor varEndring er true', () => {
    const aksjonspunkter = [varigEndringAP];
    const values = {
      fellesVurdering: 'vurdering',
      erVarigEndretNaering: true,
      vurderFastsettBruttoBeregningsgrunnlag: 'begrunnelse',
      bruttoBeregningsgrunnlag: 100,
    };
    const transformedValues = FastsettNaeringsinntektSN.transformValues(values, aksjonspunkter);
    expect(transformedValues).to.have.lengthOf(2);
    expect(transformedValues[0].kode).to.equal('5039');
    expect(transformedValues[0].begrunnelse).to.equal('vurdering');
    expect(transformedValues[0].erVarigEndretNaering).to.equal(true);
    expect(transformedValues[1].kode).to.equal('5042');
    expect(transformedValues[1].begrunnelse).to.equal('begrunnelse');
    expect(transformedValues[1].bruttoBeregningsgrunnlag).to.equal(100);
  });
});
