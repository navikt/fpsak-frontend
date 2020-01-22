import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { GrunnlagForAarsinntektPanelFL2 as UnwrappedForm } from './GrunnlagForAarsinntektPanelFL_V2';


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
      beregningsgrunnlagFom: '2019-06-01',
      arbeidsforhold: {
        startdato: null,
      },
    },
  ],
};


describe('<GrunnlagForAarsinntektPanelFL_V2>', () => {
  it('Skal teste tabellen får korrekt antall rader UTEN arbeidsforhold startdato', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      isKombinasjonsstatus={false}
    />);
    const rows = wrapper.find('Row');

    expect(rows).to.have.length(2);

    const ledeText = rows.at(1).find('FormattedMessage');
    const mndAndelFL = rows.at(1).find('Normaltekst');
    const aarAndelFL = rows.at(1).find('Element');
    expect(ledeText.get(0).props.id).to.equal('Beregningsgrunnlag.AarsinntektPanel.InnrapportertFrilans');
    expect(mndAndelFL.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr((periode.beregningsgrunnlagPrStatusOgAndel[0].beregnetPrAar / 12)));
    expect(aarAndelFL.childAt(0).text()).to.equal(formatCurrencyNoKr(periode.beregningsgrunnlagPrStatusOgAndel[0].beregnetPrAar));
  });
  it('Skal teste tabellen får korrekt antall rader ved arbeidsforhold startdato', () => {
    periode.beregningsgrunnlagPrStatusOgAndel[0].arbeidsforhold.startdato = '2011-12-12';
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      isKombinasjonsstatus={false}
    />);
    const rows = wrapper.find('Row');
    const ledeTextStart = rows.at(0).find('FormattedMessage');
    const ledeTextStartDato = rows.at(0).find('DateLabel');

    expect(rows).to.have.length(3);
    expect(ledeTextStart.get(0).props.id).to.equal('Beregningsgrunnlag.AarsinntektPanel.FrilansStartDato2');
    expect(ledeTextStartDato.dateString).to.equal(periode.beregningsgrunnlagPrStatusOgAndel.beregningsgrunnlagFom);

    const ledeText = rows.at(2).find('FormattedMessage');
    const mndAndelFL = rows.at(2).find('Normaltekst');
    const aarAndelFL = rows.at(2).find('Element');

    expect(ledeText.get(0).props.id).to.equal('Beregningsgrunnlag.AarsinntektPanel.InnrapportertFrilans');
    expect(mndAndelFL.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr((periode.beregningsgrunnlagPrStatusOgAndel[0].beregnetPrAar / 12)));
    expect(aarAndelFL.childAt(0).text()).to.equal(formatCurrencyNoKr(periode.beregningsgrunnlagPrStatusOgAndel[0].beregnetPrAar));
  });
});
