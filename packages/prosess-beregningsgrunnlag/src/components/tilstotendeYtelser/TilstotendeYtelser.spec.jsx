import React from 'react';
import { expect } from 'chai';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import TilstotendeYtelser2, { getTekstForAndelBruktIBeregning } from './TilstotendeYtelser';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-beregningsgrunnlag';

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
const relevanteStatuser = (erSN, erKombo) => ({
  isSelvstendigNaeringsdrivende: erSN,
  isKombinasjonsstatus: erKombo,
});
const andeler = [dpAndel, aapAndel, urelatertAndel];
describe('<TilstotendeYtelser>', () => {
  it('Skal teste at de korrekte ytelser for dagpenger / AAP vises og at urelaterte andeler ikke vises', () => {
    const wrapper = shallowWithIntl(<TilstotendeYtelser2
      alleAndeler={andeler}
      relevanteStatuser={relevanteStatuser(false, false)}
      gjelderBesteberegning={false}
    />);
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).to.have.length(4);
    expect(formattedMessage.at(0).prop('id')).to.equal('Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Maaned');
    expect(formattedMessage.at(1).prop('id')).to.equal('Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Aar');
    expect(formattedMessage.at(2).prop('id')).to.equal(dagpengerNavn);
    expect(formattedMessage.at(3).prop('id')).to.equal(aapNavn);
    const summer = wrapper.find('Normaltekst');
    expect(summer).to.have.length(4);
    expect(summer.children().at(0).text()).to.equal(formatCurrencyNoKr(dagpengerInntekt / 12));
    expect(summer.children().at(1).text()).to.equal(formatCurrencyNoKr(dagpengerInntekt));
    expect(summer.children().at(2).text()).to.equal(formatCurrencyNoKr(aapInntekt / 12));
    expect(summer.children().at(3).text()).to.equal(formatCurrencyNoKr(aapInntekt));
  });

  it('Skal hente riktig tekst for andel brukt i beregning', () => {
    expect(getTekstForAndelBruktIBeregning(aapAndel)).to.equal('Beregningsgrunnlag.TilstottendeYtelse.AAP');
    expect(getTekstForAndelBruktIBeregning(dpAndel)).to.equal('Beregningsgrunnlag.TilstottendeYtelse.Dagpenger');
  });
});
