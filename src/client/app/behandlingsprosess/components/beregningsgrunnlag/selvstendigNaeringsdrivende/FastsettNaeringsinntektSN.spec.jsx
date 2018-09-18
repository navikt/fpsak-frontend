import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import FastsettNaeringsinntektSN, { FastsettNaeringsinntektSNImpl } from './FastsettNaeringsinntektSN';

const varigEndretNaeringBeg = 'Dette er en begrunnelse for varig endret næring';
const fastsettBruttoBeg = 'Dette er en begrunnelse for fastsett brutto næringsinntekt';

const periode = {
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

const bruttoFastsattAP = {
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  },
  status: {
    kode: aksjonspunktStatus.UTFORT,
  },
  begrunnelse: fastsettBruttoBeg,
};

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

describe('<FastsettNaeringsinntektSN>', () => {
  it('skal teste at de korrekte komponentene blir satt hvis det ikke er varig endret næring', () => {
    const wrapper = shallowWithIntl(<FastsettNaeringsinntektSNImpl
      intl={intlMock}
      isAksjonspunktClosed={false}
      readOnly={false}
      gjeldendeAksjonspunkt={varigEndringAP}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
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
      isAksjonspunktClosed={false}
      readOnly={false}
      gjeldendeAksjonspunkt={varigEndringAP}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      erVarigEndretNaering
    />);
    const radios = wrapper.find('RadioOption');
    const textarea = wrapper.find('TextAreaField');
    const inputfield = wrapper.find('InputField');
    expect(radios).to.have.length(2);
    expect(textarea).to.have.length(2);
    expect(inputfield).to.have.length(1);
  });

  it('skal teste at de korrekte props blir satt med buildInitialValues', () => {
    const initialValues = FastsettNaeringsinntektSN.buildInitialValues(periode.beregningsgrunnlagPrStatusOgAndel, varigEndringAP, bruttoFastsattAP);
    expect(initialValues).to.eql({
      bruttoBeregningsgrunnlag: formatCurrencyNoKr(100),
      erVarigEndretNaering: true,
      fellesVurdering: varigEndretNaeringBeg,
      vurderFastsettBruttoBeregningsgrunnlag: fastsettBruttoBeg,
    });
  });

  it('skal teste at de korrekte komponentene blir satt hvis aksjonspunkt er å fastsette næringsinntekt for sn ny i arbeidslivet', () => {
    const wrapper = shallowWithIntl(<FastsettNaeringsinntektSNImpl
      intl={intlMock}
      isAksjonspunktClosed={false}
      readOnly={false}
      gjeldendeAksjonspunkt={nyIArbeidslivetAP}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      erVarigEndretNaering={false}
    />);
    const radios = wrapper.find('RadioOption');
    const textarea = wrapper.find('TextAreaField');
    const inputs = wrapper.find('InputField');
    expect(radios).to.have.length(0);
    expect(inputs).to.have.length(1);
    expect(textarea).to.have.length(1);
  });
});
