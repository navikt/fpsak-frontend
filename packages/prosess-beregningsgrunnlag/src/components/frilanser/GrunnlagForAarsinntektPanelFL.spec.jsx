import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { GrunnlagForAarsinntektPanelFL as UnwrappedForm } from './GrunnlagForAarsinntektPanelFL';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-beregningsgrunnlag';

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
const aktiveAksjonspunkter = [{
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
}];
const lukkedeAksjonspunkter = [{
  id: 55,
  erAktivt: false,
  definisjon: {
    kode: '5038',
    navn: 'Fastsett varig brutto beregning',
  },
  toTrinnsBehandling: false,
  status: {
    kode: 'UTFO',
    navn: 'Utført',
  },
  begrunnelse: '',
  vilkarType: null,
  kanLoses: true,
}];

describe('<GrunnlagForAarsinntektPanelFL>', () => {
  it('skal teste at korrekt brutto vises for frilanser', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      isAksjonspunktClosed
      aksjonspunkter={aktiveAksjonspunkter}
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
      aksjonspunkter={[]}
      isAksjonspunktClosed
      isKombinasjonsstatus={false}
    />);
    const textarea = wrapper.find('TextAreaField');
    const inputfield = wrapper.find('InputField');
    expect(textarea).to.have.length(0);
    expect(inputfield).to.have.length(0);
  });
  it('skal teste at input felt vises med aktivt aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      aksjonspunkter={aktiveAksjonspunkter}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      isAksjonspunktClosed={false}
      isKombinasjonsstatus={false}
    />);
    const inputfield = wrapper.find('InputField');
    expect(inputfield).to.have.length(1);
    expect(inputfield.props().isEdited).to.have.equal(false);
  });
  it('skal teste at input felt vises med lukket aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      aksjonspunkter={lukkedeAksjonspunkter}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      isAksjonspunktClosed
      isKombinasjonsstatus={false}
    />);
    const inputfield = wrapper.find('InputField');
    expect(inputfield).to.have.length(1);
    expect(inputfield.props().isEdited).to.have.equal(true);
  });
});
