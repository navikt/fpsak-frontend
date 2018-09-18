import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import TableRow from 'sharedComponents/TableRow';
import periodeResultatType from 'kodeverk/periodeResultatType';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import TimeLineData from './TimeLineData';

const startDate = '2018-01-28';
const endDate = '2018-02-18';

const item = {
  andeler: [
    {
      arbeidsgiver: '123456',
      refusjon: 0,
      tilSoker: 123,
      sisteUttaksdag: '2018-02-18',
      utbetalingsgrad: 50,
      aktivitetStatus: {
        navn: 'Arbeidstaker',
        kode: aktivitetStatus.ARBEIDSTAKER,
      },
      uttak: {
        periodeResultatType: periodeResultatType.INNVILGET,
        periodeType: 'Mødrekvoten',
        stonadskontoType: 'MØDREKVOTE',
        trekkdager: 15,
      },
    },
    {
      arbeidsgiver: '654321',
      refusjon: 22,
      tilSoker: 321,
      sisteUttaksdag: '2018-02-18',
      utbetalingsgrad: 100,
      aktivitetStatus: {
        navn: 'Frilans',
        kode: aktivitetStatus.FRILANSER,
      },
      uttak: {
        periodeResultatType: periodeResultatType.INNVILGET,
        periodeType: 'Fedrekvoten',
        stonadskontoType: 'FEDREKVOTE',
        trekkdager: 10,
      },
    },
  ],
  className: 'INNVILGET',
  dagsats: 1666,
  fom: '2018-01-28',
  tom: '2018-02-18',
  group: 1,
  id: 1,
};

describe('<TimeLineData>', () => {
  it('skal teste at TimeLineData viser korrekte verdier i detaljboks', () => {
    const wrapper = shallowWithIntl(<TimeLineData
      selectedItemStartDate={startDate}
      selectedItemEndDate={endDate}
      selectedItemData={item}
      callbackBackward={sinon.spy()}
      callbackForward={sinon.spy()}
    />);

    const messages = wrapper.find(FormattedMessage);
    expect(messages.at(1).props().values.fomVerdi).to.equal('28.01.2018');
    expect(messages.at(1).props().values.tomVerdi).to.equal('18.02.2018');

    const weeksAndDays = wrapper.find(FormattedMessage).at(2);
    expect(weeksAndDays.prop('id')).to.eql('UttakInfoPanel.AntallNullDagerOgFlereUker');
    expect(weeksAndDays.prop('values')).to.eql({
      weeks: '3',
      days: '0',
    });
  });

  it('skal teste at TimeLineData viser korrekte verdier i andelstabell', () => {
    const wrapper = shallowWithIntl(<TimeLineData
      selectedItemStartDate={startDate}
      selectedItemEndDate={endDate}
      selectedItemData={item}
      callbackBackward={sinon.spy()}
      callbackForward={sinon.spy()}
    />);

    const rows = wrapper.find(TableRow);
    // Første rad
    const firstRowNormalText = rows.first().find(Normaltekst);
    expect(firstRowNormalText.at(0).childAt(0).text()).to.equal('Mødrekvote');
    expect(firstRowNormalText.at(2).childAt(0).text()).to.equal('50');
    expect(firstRowNormalText.at(3).childAt(0)).is.empty;
    expect(firstRowNormalText.at(4).childAt(0).text()).to.equal('123');

    // Andre rad
    const secondRow = rows.last();
    expect(secondRow.find(FormattedMessage).at(0).prop('id')).to.eql('TilkjentYtelse.PeriodeData.Frilans');
    expect(secondRow.find(Normaltekst).at(0).childAt(0).text()).to.equal('Fedrekvote');
    expect(secondRow.find(Normaltekst).at(2).childAt(0).text()).to.equal('100');
    expect(secondRow.find(Normaltekst).at(3).childAt(0)).is.empty;
    expect(secondRow.find(Normaltekst).at(4).childAt(0).text()).to.equal('321');
  });
});
