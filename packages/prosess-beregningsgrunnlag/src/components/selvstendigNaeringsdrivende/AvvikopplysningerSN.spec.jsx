import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import AvviksopplysningerSN from './AvvikopplysningerSN';


const sammenligningsgrunnlag = (kode) => ({
  sammenligningsgrunnlagFom: '2018-09-01',
  sammenligningsgrunnlagTom: '2019-10-31',
  rapportertPrAar: 330000,
  avvikPromille: 275,
  avvikProsent: 27.5,
  sammenligningsgrunnlagType: {
    kode,
  },
  differanseBeregnet: 12100,
});
const forstePeriode = [
  {
    pgiSnitt: 100,
    aktivitetStatus:
      {
        kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
      },
    næringer: [
      {
        erVarigEndret: false,
        erNyoppstartet: false,
      },
    ],
    erNyIArbeidslivet: false,
  },
];

describe('<AvviksopplysningerSN>', () => {
  it('Skal teste komponenten ved erNyArbLivet', () => {
    forstePeriode[0].erNyIArbeidslivet = true;
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_SN');
    const wrapper = shallowWithIntl(<AvviksopplysningerSN
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      alleAndelerIForstePeriode={forstePeriode}
      harAksjonspunkter
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.SN.NyIArbeidslivet');
  });
  it('Skal teste komponenten ved !erVarigEndring && !harAksjonspunkter', () => {
    forstePeriode[0].erNyIArbeidslivet = false;
    forstePeriode[0].næringer[0].erVarigEndret = false;
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_SN');
    const wrapper = shallowWithIntl(<AvviksopplysningerSN
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      alleAndelerIForstePeriode={forstePeriode}
      harAksjonspunkter={false}
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.SN.IkkeVarigEndring');
  });
  it('Skal teste komponenten ved  !harAksjonspunkter', () => {
    forstePeriode[0].erNyIArbeidslivet = false;
    forstePeriode[0].næringer[0].erVarigEndret = true;
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_SN');
    const wrapper = shallowWithIntl(<AvviksopplysningerSN
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      alleAndelerIForstePeriode={forstePeriode}
      harAksjonspunkter={false}
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.SN.IngenEndring');
  });
  it('Skal teste tabellen får korrekte rader med innhold vd SN', () => {
    forstePeriode[0].erNyIArbeidslivet = false;
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_SN');
    const wrapper = shallowWithIntl(<AvviksopplysningerSN
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      alleAndelerIForstePeriode={forstePeriode}
      harAksjonspunkter
    />);

    const rows = wrapper.find('Row');
    expect(rows).to.have.length(4);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.PensjonsgivendeInntekt');
    const omregnetAarsinntektVerdi = rows.first().find('Normaltekst');
    expect(omregnetAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(forstePeriode[0].pgiSnitt));

    const rapportertAarsinntektText = rows.at(1).find('FormattedMessage');
    expect(rapportertAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.OppgittAarsinntekt');
    const rapportertAarsinntektVerdi = rows.at(1).find('Normaltekst');
    expect(rapportertAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(sammenligningsgrunnlagPrStatus.rapportertPrAar));

    const avvikText = rows.at(3).find('FormattedMessage');
    expect(avvikText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik');
    const avvikVerdi = rows.at(3).find('Normaltekst');
    expect(avvikVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr((sammenligningsgrunnlagPrStatus.differanseBeregnet)));
    const avvikProsentText = rows.at(3).find('FormattedMessage').at(1);
    const avvikProsentValue = avvikProsentText.first().prop('values');
    expect(avvikProsentText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AvvikProsent');
    expect(avvikProsentValue.avvik).to.eql(sammenligningsgrunnlagPrStatus.avvikProsent);
  });
});
