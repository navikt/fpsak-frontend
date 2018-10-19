import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import { GrunnlagForAarsinntektPanelFL as UnwrappedForm } from './GrunnlagForAarsinntektPanelFL';

const periode = {
  bruttoPrAar: 300000,
  beregningsgrunnlagPrStatusOgAndel: [
    {
      aktivitetStatus: {
        kode: aktivitetStatus.FRILANSER,
      },
      elementNavn: 'arbeidsgiver 1',
      beregnetPrAar: 200000,
      overstyrtPrAar: 100,
    },
  ],
};
const aksjonspunkt = {
  id: 55,
  erAktivt: true,
  definisjon: {
    kode: '5038',
    navn: 'Fastsett varig brutto beregning',
  },
  toTrinnsBehandling: false,
  status: {
    kode: 'OPPR',
    navn: 'Opprettet',
  },
  begrunnelse: '',
  vilkarType: null,
  kanLoses: true,
};
describe('<GrunnlagForAarsinntektPanelFL>', () => {
  it('skal teste at korrekt brutto vises for frilanser', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      isAksjonspunktClosed
      aksjonspunkt={aksjonspunkt}
      isKombinasjonsstatus={false}

    />);
    const elements = wrapper.find('Element');
    expect(elements).to.have.length(1);
    expect(elements.at(0).children().text()).to.equal(formatCurrencyNoKr(200000));
  });

  it('skal teste at input felt ikke vises uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      isAksjonspunktClosed
      isKombinasjonsstatus={false}
    />);
    const textarea = wrapper.find('TextAreaField');
    const inputfield = wrapper.find('InputField');
    expect(textarea).to.have.length(0);
    expect(inputfield).to.have.length(0);
  });

  it('skal teste at input felt vises med aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      aksjonspunkt={aksjonspunkt}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      isAksjonspunktClosed={false}
      isKombinasjonsstatus={false}
    />);
    const inputfield = wrapper.find('InputField');
    expect(inputfield).to.have.length(1);
  });
});
