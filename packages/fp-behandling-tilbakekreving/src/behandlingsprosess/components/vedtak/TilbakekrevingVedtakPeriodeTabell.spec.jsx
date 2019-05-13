import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';

import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';

describe('<TilbakekrevingVedtakPeriodeTabell>', () => {
  it('skal lage tabell med to perioder og en sum-rad', () => {
    const perioder = [{
      periode: ['2019-10-10', '2019-12-10'],
      feilutbetaltBeløp: 15430,
      vurdering: {
        kode: 'SIMP',
        kodeverk: 'VURDERING',
      },
      andelAvBeløp: 100,
      renterProsent: 10,
      tilbakekrevingBeløp: 15430,
    }, {
      periode: ['2019-05-10', '2019-06-10'],
      feilutbetaltBeløp: 14000,
      vurdering: {
        kode: 'SIMP',
        kodeverk: 'VURDERING',
      },
      andelAvBeløp: 50,
      tilbakekrevingBeløp: 7000,
    }];
    const getKodeverknavn = () => 'Simpel uaktsomhet';

    const wrapper = shallow(<TilbakekrevingVedtakPeriodeTabell
      perioder={perioder}
      getKodeverknavn={getKodeverknavn}
    />);

    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(3);

    const kolonnerForPeriode1 = rader.first().find(TableColumn);
    expect(kolonnerForPeriode1).to.have.length(6);
    expect(kolonnerForPeriode1.at(0).childAt(0).childAt(0).prop('dateStringFom')).to.eql('2019-10-10');
    expect(kolonnerForPeriode1.at(0).childAt(0).childAt(0).prop('dateStringTom')).to.eql('2019-12-10');
    expect(kolonnerForPeriode1.at(1).childAt(0).childAt(0).text()).to.eql('15 430');
    expect(kolonnerForPeriode1.at(2).childAt(0).childAt(0).text()).to.eql('Simpel uaktsomhet');
    expect(kolonnerForPeriode1.at(3).childAt(0).childAt(0).text()).to.eql('100%');
    expect(kolonnerForPeriode1.at(4).childAt(0).childAt(0).text()).to.eql('10');
    expect(kolonnerForPeriode1.at(5).childAt(0).childAt(0).text()).to.eql('15 430');

    const kolonnerForPeriode2 = rader.at(1).find(TableColumn);
    expect(kolonnerForPeriode2).to.have.length(6);
    expect(kolonnerForPeriode2.at(0).childAt(0).childAt(0).prop('dateStringFom')).to.eql('2019-05-10');
    expect(kolonnerForPeriode2.at(0).childAt(0).childAt(0).prop('dateStringTom')).to.eql('2019-06-10');
    expect(kolonnerForPeriode2.at(1).childAt(0).childAt(0).text()).to.eql('14 000');
    expect(kolonnerForPeriode2.at(2).childAt(0).childAt(0).text()).to.eql('Simpel uaktsomhet');
    expect(kolonnerForPeriode2.at(3).childAt(0).childAt(0).text()).to.eql('50%');
    expect(kolonnerForPeriode2.at(5).childAt(0).childAt(0).text()).to.eql('7 000');

    const kolonnerForSum = rader.at(2).find(TableColumn);
    expect(kolonnerForSum).to.have.length(6);
    expect(kolonnerForSum.at(0).childAt(0).childAt(0).prop('id')).to.eql('TilbakekrevingVedtakPeriodeTabell.Sum');
    expect(kolonnerForSum.at(1).childAt(0).childAt(0).text()).to.eql('29 430');
    expect(kolonnerForSum.at(5).childAt(0).childAt(0).text()).to.eql('22 430');
  });
});
