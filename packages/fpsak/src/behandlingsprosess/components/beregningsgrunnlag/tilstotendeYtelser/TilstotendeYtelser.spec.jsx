import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import relatertYtelseType from 'kodeverk/relatertYtelseType';
import relatertYtelseTypeTextCodes from 'behandlingsprosess/components/beregningsgrunnlag/fellesPaneler/relatertYtelseTypeTextCodes';
import TilstotendeYtelser from './TilstotendeYtelser';

const dagpengerInntekt = 200000;
const aapInntekt = 300000;
const aapNavn = 'Beregningsgrunnlag.TilstottendeYtelse.AAP';
const dagpengerNavn = 'Beregningsgrunnlag.TilstottendeYtelse.Dagpenger';
const dpAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.DAGPENGER,
    navn: dagpengerNavn,
  },
  beregnetPrAar: dagpengerInntekt,
  elementNavn: dagpengerNavn,
};
const aapAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.ARBEIDSAVKLARINGSPENGER,
    navn: aapNavn,
  },
  beregnetPrAar: aapInntekt,
  elementNavn: aapNavn,
};
const urelatertAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.FRILANSER,
    navn: 'Frilanser',
  },
  beregnetPrAar: aapInntekt,
};
const andeler = [dpAndel, aapAndel, urelatertAndel];
describe('<TilstotendeYtelser>', () => {
  it('Skal teste at de korrekte ytelser for dagpenger / AAP vises og at urelaterte andeler ikke vises', () => {
    const wrapper = shallowWithIntl(<TilstotendeYtelser
      alleAndeler={andeler}
      isKombinasjonsstatus={false}
      tilstøtendeYtelseType={undefined}
    />);
    const element = wrapper.find('Element');
    const formattedMessage = wrapper.find('FormattedMessage');

    expect(formattedMessage).to.have.length(2);
    expect(formattedMessage.at(0).prop('id')).to.equal(dagpengerNavn);
    expect(formattedMessage.at(1).prop('id')).to.equal(aapNavn);

    expect(element).to.have.length(2);
    expect(element.children().at(0).text()).to.equal(formatCurrencyNoKr(dagpengerInntekt));
    expect(element.children().at(1).text()).to.equal(formatCurrencyNoKr(aapInntekt));
  });

  it('Skal teste at de korrekte ytelser for tilstøtende ytelser vises', () => {
    const brutto = 290000;
    const wrapper = shallowWithIntl(<TilstotendeYtelser
      alleAndeler={andeler}
      isKombinasjonsstatus={false}
      tilstøtendeYtelseType={relatertYtelseType.ENSLIG_FORSORGER}
      bruttoPrAar={brutto}
    />);
    const element = wrapper.find('Element');
    const formattedMessage = wrapper.find('FormattedMessage');

    expect(formattedMessage).to.have.length(1);
    expect(formattedMessage.at(0).prop('id')).to.equal(relatertYtelseTypeTextCodes[relatertYtelseType.ENSLIG_FORSORGER]);

    expect(element).to.have.length(1);
    expect(element.children().at(0).text()).to.equal(formatCurrencyNoKr(brutto));
  });
});
