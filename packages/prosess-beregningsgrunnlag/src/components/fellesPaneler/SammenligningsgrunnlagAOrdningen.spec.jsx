import React from 'react';
import { expect } from 'chai';
import { intlMock, mountWithIntl, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import moment from 'moment';
import { formatCurrencyNoKr, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import SammenligningsgrunnlagAOrdningen from './SammenligningsgrunnlagAOrdningen';
import Lesmerpanel2 from '../redesign/LesmerPanel';


const relevanteStatuser = {
  isArbeidstaker: true,
  isFrilanser: true,
  isSelvstendigNaeringsdrivende: false,
  isKombinasjonsstatus: true,
};
const mockSammenligningsgrunnlagInntekt = [
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 31800,
    dato: '2018-09-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 0,
    dato: '2018-09-01',
  },
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 33450,
    dato: '2018-10-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 0,
    dato: '2018-10-01',
  },
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 33559,
    dato: '2018-11-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 10000,
    dato: '2018-11-01',
  },
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 41800,
    dato: '2018-12-01',
  },

  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 39450,
    dato: '2019-01-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 0,
    dato: '2019-01-01',
  },
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 39559,
    dato: '2019-02-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 0,
    dato: '2019-02-01',
  },
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 38800,
    dato: '2019-03-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 0,
    dato: '2019-03-01',
  },
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 39450,
    dato: '2019-04-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 0,
    dato: '2019-04-01',
  },
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 38559,
    dato: '2019-05-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 0,
    dato: '2019-05-01',
  },
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 39600,
    dato: '2019-06-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 64000,
    dato: '2019-06-01',
  },
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 49993,
    dato: '2019-07-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 55000,
    dato: '2019-07-01',
  },
  {
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    beløp: 48237,
    dato: '2019-08-01',
  },
  {
    aktivitetStatus: aktivitetStatus.FRILANSER,
    beløp: 30000,
    dato: '2019-08-01',
  },
];
const expectedFLverdier = [
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[1].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[1].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[3].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[3].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[5].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[5].beløp,
  },
  {
    maanedNavn: 'des.',
    belop: 0,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[8].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[8].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[10].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[10].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[12].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[12].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[14].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[14].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[16].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[16].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[18].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[18].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[20].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[20].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[22].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[22].beløp,
  },
];
const expectedATverdier = [
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[0].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[0].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[2].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[2].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[4].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[4].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[6].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[6].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[7].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[7].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[9].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[9].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[11].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[11].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[13].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[13].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[15].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[15].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[17].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[17].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[19].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[19].beløp,
  },
  {
    maanedNavn: moment(mockSammenligningsgrunnlagInntekt[21].dato, ISO_DATE_FORMAT).format('MMM'),
    belop: mockSammenligningsgrunnlagInntekt[21].beløp,
  },
];
const espectedSumATAndeler = 474257;
const espectedSumFLAndeler = 159000;
const skjeringstidspunktDato = '2019-09-16';

describe('<SammenligningsgrunnlagFraA-Ordningen>', () => {
  it('Skal se at panelet ikke rendrer ved manglende SammenligningsgrunnlagInntekt', () => {
    const wrapper = shallowWithIntl(<SammenligningsgrunnlagAOrdningen.WrappedComponent
      relevanteStatuser={relevanteStatuser}
      sammenligningsGrunnlagInntekter={[]}
      skjeringstidspunktDato={skjeringstidspunktDato}
      intl={intlMock}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(0);
  });
  it('Skal se at panelet ikke rendrer ved SammenligningsgrunnlagInntekt og SN', () => {
    relevanteStatuser.isSelvstendigNaeringsdrivende = true;
    const wrapper = shallowWithIntl(<SammenligningsgrunnlagAOrdningen.WrappedComponent
      relevanteStatuser={relevanteStatuser}
      sammenligningsGrunnlagInntekter={mockSammenligningsgrunnlagInntekt}
      skjeringstidspunktDato={skjeringstidspunktDato}
      intl={intlMock}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(0);
  });
  it('Skal se at panelet rendrer korrekt SammenligningsgrunnlagInntekt og AT_FL', () => {
    relevanteStatuser.isSelvstendigNaeringsdrivende = false;
    const wrapper = mountWithIntl(<SammenligningsgrunnlagAOrdningen.WrappedComponent
      relevanteStatuser={relevanteStatuser}
      sammenligningsGrunnlagInntekter={mockSammenligningsgrunnlagInntekt}
      skjeringstidspunktDato={skjeringstidspunktDato}
      intl={intlMock}
    />);
    const lesmer = wrapper.find(Lesmerpanel2);
    const rows = lesmer.find('FlexRow');
    expect(rows).to.have.length(2);
    const headerTitle = wrapper.find('FormattedMessage').first();
    const headerIngress = wrapper.find('FormattedMessage').at(1);
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Tittel');
    expect(headerIngress.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Ingress.AT_FL');
    const underTekster = wrapper.find('Undertekst');
    expect(underTekster.at(0).children().at(0).text()).to.equal('Arbeid');
    expect(underTekster.at(1).children().at(0).text()).to.equal('Frilans');

    let teller = 2;
    let expteller = 0;
    for (let step = 12; step > 0; step -= 1) {
      const formattedMaaned = expectedATverdier[expteller].maanedNavn.charAt(0).toUpperCase() + expectedATverdier[expteller].maanedNavn.slice(1, 3);
      expect(underTekster.at(teller).children().at(0).text()).to.equal(formattedMaaned);
      expect(underTekster.at(teller + 1).children().at(0).text()).to.equal(formatCurrencyNoKr(expectedATverdier[expteller].belop));
      expect(underTekster.at(teller + 2).children().at(0).text()).to.equal(formatCurrencyNoKr(expectedFLverdier[expteller].belop));
      if (formattedMaaned === 'Jan') {
        expect(underTekster.at(teller + 3).children().at(0).text()).to.equal((skjeringstidspunktDato.split('-')[0]).toString());
        teller += 4;
      } else if (formattedMaaned === 'Des') {
        expect(underTekster.at(teller + 3).children().at(0).text()).to.equal((skjeringstidspunktDato.split('-')[0] - 1).toString());
        teller += 4;
      } else {
        teller += 3;
      }
      expteller += 1;
    }

    const sumTitle = wrapper.find('FormattedMessage').at(2);
    expect(sumTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.SumTittel');
    const sumATAndeler = wrapper.find('Element').at(1);
    const sumFLAndeler = wrapper.find('Element').at(2);
    expect(sumATAndeler.children().at(0).text()).to.equal(formatCurrencyNoKr(espectedSumATAndeler));
    expect(sumFLAndeler.children().at(0).text()).to.equal(formatCurrencyNoKr(espectedSumFLAndeler));
  });
  it('Skal se at panelet rendrer korrekt SammenligningsgrunnlagInntekt og FL', () => {
    const statuser = { ...relevanteStatuser };
    statuser.isArbeidstaker = false;
    statuser.isKombinasjonsstatus = false;
    const wrapper = mountWithIntl(<SammenligningsgrunnlagAOrdningen.WrappedComponent
      relevanteStatuser={statuser}
      sammenligningsGrunnlagInntekter={mockSammenligningsgrunnlagInntekt}
      skjeringstidspunktDato={skjeringstidspunktDato}
      intl={intlMock}
    />);
    const lesmer = wrapper.find(Lesmerpanel2);
    const rows = lesmer.find('FlexRow');
    expect(rows).to.have.length(2);
    const headerTitle = wrapper.find('FormattedMessage').first();
    const headerIngress = wrapper.find('FormattedMessage').at(1);
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Tittel');
    expect(headerIngress.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Ingress.FL');
    const underTekster = wrapper.find('Undertekst');
    let teller = 0;
    let expTeller = 0;
    for (let step = 12; step > 0; step -= 1) {
      const formattedMaaned = expectedFLverdier[expTeller].maanedNavn.charAt(0).toUpperCase() + expectedFLverdier[expTeller].maanedNavn.slice(1, 3);
      expect(underTekster.at(teller).children().at(0).text()).to.equal(formattedMaaned);
      expect(underTekster.at(teller + 1).children().at(0).text()).to.equal(formatCurrencyNoKr(expectedFLverdier[expTeller].belop));
      if (formattedMaaned === 'Jan') {
        expect(underTekster.at(teller + 2).children().at(0).text()).to.equal((skjeringstidspunktDato.split('-')[0]).toString());
        teller += 3;
      } else if (formattedMaaned === 'Des') {
        expect(underTekster.at(teller + 2).children().at(0).text()).to.equal((skjeringstidspunktDato.split('-')[0] - 1).toString());
        teller += 3;
      } else {
        teller += 2;
      }
      expTeller += 1;
    }
    const sumTitle = wrapper.find('FormattedMessage').at(2);
    expect(sumTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.SumTittel');
    const sumFLAndeler = wrapper.find('Element').at(1);
    expect(sumFLAndeler.children().at(0).text()).to.equal(formatCurrencyNoKr(espectedSumFLAndeler));
  });
  it('Skal se at panelet rendrer korrekt SammenligningsgrunnlagInntekt og AT', () => {
    const statuser = { ...relevanteStatuser };
    statuser.isArbeidstaker = false;
    statuser.isKombinasjonsstatus = false;
    statuser.isArbeidstaker = true;
    statuser.isFrilanser = false;
    const wrapper = mountWithIntl(<SammenligningsgrunnlagAOrdningen.WrappedComponent
      relevanteStatuser={statuser}
      sammenligningsGrunnlagInntekter={mockSammenligningsgrunnlagInntekt}
      skjeringstidspunktDato={skjeringstidspunktDato}
      intl={intlMock}
    />);
    const lesmer = wrapper.find(Lesmerpanel2);
    const rows = lesmer.find('FlexRow');
    expect(rows).to.have.length(2);
    const headerTitle = wrapper.find('FormattedMessage').first();
    const headerIngress = wrapper.find('FormattedMessage').at(1);
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Tittel');
    expect(headerIngress.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Ingress.AT');
    const underTekster = wrapper.find('Undertekst');

    let teller = 0;
    let expTeller = 0;
    for (let step = 12; step > 0; step -= 1) {
      const formattedMaaned = expectedATverdier[expTeller].maanedNavn.charAt(0).toUpperCase() + expectedATverdier[expTeller].maanedNavn.slice(1, 3);
      expect(underTekster.at(teller).children().at(0).text()).to.equal(formattedMaaned);
      expect(underTekster.at(teller + 1).children().at(0).text()).to.equal(formatCurrencyNoKr(expectedATverdier[expTeller].belop));
      if (formattedMaaned === 'Jan') {
        expect(underTekster.at(teller + 2).children().at(0).text()).to.equal((skjeringstidspunktDato.split('-')[0]).toString());
        teller += 3;
      } else if (formattedMaaned === 'Des') {
        expect(underTekster.at(teller + 2).children().at(0).text()).to.equal((skjeringstidspunktDato.split('-')[0] - 1).toString());
        teller += 3;
      } else {
        teller += 2;
      }
      expTeller += 1;
    }
    const sumTitle = wrapper.find('FormattedMessage').at(2);
    expect(sumTitle.props().id).to.equal('Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.SumTittel');
    const sumATAndeler = wrapper.find('Element').at(1);
    expect(sumATAndeler.children().at(0).text()).to.equal(formatCurrencyNoKr(espectedSumATAndeler));
  });
});
