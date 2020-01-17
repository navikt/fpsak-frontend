import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import moment from 'moment';
import { formatCurrencyNoKr, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import SammenligningsgrunnlagAOrdningen from './SammenligningsgrunnlagAOrdningen';


const relevanteStatuser = {
  isArbeidstaker: true,
  isFrilanser: true,
  isSelvstendigNaeringsdrivende: false,
  isKombinasjonsstatus: true,
};
const mockSammenligningsgrunnlagInntekt = [
  {
    atAndel: 31800,
    flAndel: 0,
    dato: '2018-08-01',
  },
  {
    atAndel: 33450,
    flAndel: 0,
    dato: '2018-09-01',
  },
  {
    atAndel: 33559,
    flAndel: 10000,
    dato: '2018-10-01',
  },
  {
    atAndel: 41800,
    flAndel: 0,
    dato: '2018-11-01',
  },
  {
    atAndel: 39450,
    flAndel: 0,
    dato: '2018-12-01',
  },
  {
    atAndel: 39559,
    flAndel: 0,
    dato: '2019-01-01',
  },
  {
    atAndel: 38800,
    flAndel: 0,
    dato: '2019-02-01',
  },
  {
    atAndel: 39450,
    flAndel: 0,
    dato: '2019-03-01',
  },
  {
    atAndel: 38559,
    flAndel: 0,
    dato: '2019-04-01',
  },
  {
    atAndel: 39600,
    flAndel: 64000,
    dato: '2019-05-01',
  },
  {
    atAndel: 49993,
    flAndel: 55000,
    dato: '2019-06-01',
  },
  {
    atAndel: 48237,
    flAndel: 30000,
    dato: '2019-07-01',
  },
];

describe('<SammenligningsgrunnlagFraA-Ordningen>', () => {
  it('Skal se at panelet ikke rendrer ved manglende SammenligningsgrunnlagInntekt', () => {
    const wrapper = shallowWithIntl(<SammenligningsgrunnlagAOrdningen
      relevanteStatuser={relevanteStatuser}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(0);
  });
  it('Skal se at panelet ikke rendrer ved SammenligningsgrunnlagInntekt og SN', () => {
    relevanteStatuser.isSelvstendigNaeringsdrivende = false;
    const wrapper = shallowWithIntl(<SammenligningsgrunnlagAOrdningen
      relevanteStatuser={relevanteStatuser}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(0);
  });
  it('Skal se at panelet rendrer korrekt SammenligningsgrunnlagInntekt og AT_FL', () => {
    const wrapper = shallowWithIntl(<SammenligningsgrunnlagAOrdningen
      relevanteStatuser={relevanteStatuser}
      sammenligningsGrunnlagInntekter={mockSammenligningsgrunnlagInntekt}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(2);
    const headerTitle = wrapper.find('FormattedMessage').first();
    const headerIngress = wrapper.find('FormattedMessage').at(1);
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Tittel');
    expect(headerIngress.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Ingress.AT_FL');
    const underTekster = wrapper.find('Undertekst');
    expect(underTekster.at(0).children().at(0).text()).to.equal('Arbeid');
    expect(underTekster.at(1).children().at(0).text()).to.equal('Frilans');

    let teller = 2;
    mockSammenligningsgrunnlagInntekt.forEach((andelManed) => {
      const maanedNavn = moment(andelManed.dato, ISO_DATE_FORMAT).format('MMM');
      const formattedMaaned = (maanedNavn.charAt(0).toUpperCase() + maanedNavn.slice(1, 3));
      const aar = moment(andelManed.dato, ISO_DATE_FORMAT).format('YYYY');
      expect(underTekster.at(teller).children().at(0).text()).to.equal(formattedMaaned);
      expect(underTekster.at(teller + 1).children().at(0).text()).to.equal(formatCurrencyNoKr(andelManed.atAndel));
      expect(underTekster.at(teller + 2).children().at(0).text()).to.equal(formatCurrencyNoKr(andelManed.flAndel));
      if (formattedMaaned === 'Des' || formattedMaaned === 'Jan') {
        expect(underTekster.at(teller + 3).children().at(0).text()).to.equal(aar);
        teller += 4;
      } else {
        teller += 3;
      }
    });
    const sumTitle = wrapper.find('FormattedMessage').at(2);
    expect(sumTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.SumTittel');
    const sumATAndeler = wrapper.find('Element').at(1);
    const sumFLAndeler = wrapper.find('Element').at(2);
    const calcSumATAndeler = mockSammenligningsgrunnlagInntekt.reduce((acc, andel) => acc + andel.atAndel, 0);
    const calcSumFLAndeler = mockSammenligningsgrunnlagInntekt.reduce((acc, andel) => acc + andel.flAndel, 0);
    expect(sumATAndeler.children().at(0).text()).to.equal(formatCurrencyNoKr(calcSumATAndeler));
    expect(sumFLAndeler.children().at(0).text()).to.equal(formatCurrencyNoKr(calcSumFLAndeler));
  });
  it('Skal se at panelet rendrer korrekt SammenligningsgrunnlagInntekt og FL', () => {
    relevanteStatuser.isArbeidstaker = false;
    relevanteStatuser.isKombinasjonsstatus = false;
    const wrapper = shallowWithIntl(<SammenligningsgrunnlagAOrdningen
      relevanteStatuser={relevanteStatuser}
      sammenligningsGrunnlagInntekter={mockSammenligningsgrunnlagInntekt}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(2);
    const headerTitle = wrapper.find('FormattedMessage').first();
    const headerIngress = wrapper.find('FormattedMessage').at(1);
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Tittel');
    expect(headerIngress.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Ingress.FL');
    const underTekster = wrapper.find('Undertekst');
    expect(underTekster.at(0).children().at(0).text()).to.equal('Frilans');

    let teller = 1;
    mockSammenligningsgrunnlagInntekt.forEach((andelManed) => {
      const maanedNavn = moment(andelManed.dato, ISO_DATE_FORMAT).format('MMM');
      const formattedMaaned = (maanedNavn.charAt(0).toUpperCase() + maanedNavn.slice(1, 3));
      const aar = moment(andelManed.dato, ISO_DATE_FORMAT).format('YYYY');
      expect(underTekster.at(teller).children().at(0).text()).to.equal(formattedMaaned);
      expect(underTekster.at(teller + 1).children().at(0).text()).to.equal(formatCurrencyNoKr(andelManed.flAndel));
      if (formattedMaaned === 'Des' || formattedMaaned === 'Jan') {
        expect(underTekster.at(teller + 2).children().at(0).text()).to.equal(aar);
        teller += 3;
      } else {
        teller += 2;
      }
    });
    const sumTitle = wrapper.find('FormattedMessage').at(2);
    expect(sumTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.SumTittel');
    const sumFLAndeler = wrapper.find('Element').at(1);
    const calcSumFLAndeler = mockSammenligningsgrunnlagInntekt.reduce((acc, andel) => acc + andel.flAndel, 0);
    expect(sumFLAndeler.children().at(0).text()).to.equal(formatCurrencyNoKr(calcSumFLAndeler));
  });
  it('Skal se at panelet rendrer korrekt SammenligningsgrunnlagInntekt og AT', () => {
    relevanteStatuser.isArbeidstaker = true;
    relevanteStatuser.isFrilanser = false;
    relevanteStatuser.isKombinasjonsstatus = false;
    const wrapper = shallowWithIntl(<SammenligningsgrunnlagAOrdningen
      relevanteStatuser={relevanteStatuser}
      sammenligningsGrunnlagInntekter={mockSammenligningsgrunnlagInntekt}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(2);
    const headerTitle = wrapper.find('FormattedMessage').first();
    const headerIngress = wrapper.find('FormattedMessage').at(1);
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Tittel');
    expect(headerIngress.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Ingress.AT');
    const underTekster = wrapper.find('Undertekst');
    expect(underTekster.at(0).children().at(0).text()).to.equal('Arbeid');

    let teller = 1;
    mockSammenligningsgrunnlagInntekt.forEach((andelManed) => {
      const maanedNavn = moment(andelManed.dato, ISO_DATE_FORMAT).format('MMM');
      const formattedMaaned = (maanedNavn.charAt(0).toUpperCase() + maanedNavn.slice(1, 3));
      const aar = moment(andelManed.dato, ISO_DATE_FORMAT).format('YYYY');
      expect(underTekster.at(teller).children().at(0).text()).to.equal(formattedMaaned);
      expect(underTekster.at(teller + 1).children().at(0).text()).to.equal(formatCurrencyNoKr(andelManed.atAndel));
      if (formattedMaaned === 'Des' || formattedMaaned === 'Jan') {
        expect(underTekster.at(teller + 2).children().at(0).text()).to.equal(aar);
        teller += 3;
      } else {
        teller += 2;
      }
    });
    const sumTitle = wrapper.find('FormattedMessage').at(2);
    expect(sumTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.SumTittel');
    const sumATAndeler = wrapper.find('Element').at(1);
    const calcSumATAndeler = mockSammenligningsgrunnlagInntekt.reduce((acc, andel) => acc + andel.atAndel, 0);
    expect(sumATAndeler.children().at(0).text()).to.equal(formatCurrencyNoKr(calcSumATAndeler));
  });
});
