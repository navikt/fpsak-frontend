import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Image from 'sharedComponents/Image';
import DateLabel from 'sharedComponents/DateLabel';
import PeriodLabel from 'sharedComponents/PeriodLabel';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import PersonArbeidsforholdTable from './PersonArbeidsforholdTable';

describe('<PersonArbeidsforholdTable>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsforholdId: '1231-2345',
    navn: 'Svendsen Eksos',
    arbeidsgiverIdentifikator: '1234567',
    arbeidsgiverIdentifiktorGUI: '1234567',
    fomDato: '2018-01-01',
    tomDato: '2018-10-10',
    kilde: {
      kode: 'INNTEKT',
      navn: '',
    },
    mottattDatoInntektsmelding: undefined,
    brukArbeidsforholdet: false,
    tilVurdering: true,
    stillingsprosent: 80,
  };

  const fagsystemer = [{
    kode: 'AA',
    navn: 'aa',
  }, {
    kode: 'INNTEKT',
    navn: 'inntekt',
  }];

  it('skal vise tabell med to arbeidsforhold der den ene raden er markert som valgt', () => {
    const arbeidsforhold2 = {
      id: '2',
      arbeidsforholdId: '1231-2345',
      navn: 'Nilsen Eksos',
      arbeidsgiverIdentifikator: '223455667',
      arbeidsgiverIdentifiktorGUI: '223455667',
      fomDato: '2018-02-01',
      tomDato: '2018-02-10',
      kilde: {
        kode: 'AA',
        navn: '',
      },
      mottattDatoInntektsmelding: undefined,
      brukArbeidsforholdet: false,
      stillingsprosent: 50,
    };

    const wrapper = shallow(<PersonArbeidsforholdTable
      alleArbeidsforhold={[arbeidsforhold, arbeidsforhold2]}
      selectedId={arbeidsforhold.id}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const table = wrapper.find(Table);
    expect(table).has.length(1);

    const rows = table.find(TableRow);
    expect(rows).has.length(2);

    const row1 = rows.first();
    expect(row1.prop('isSelected')).is.true;
    const colsRow1 = row1.find(TableColumn);
    expect(colsRow1).has.length(6);
    expect(colsRow1.first().childAt(0).childAt(0).text()).is.eql('Svendsen Eksos(1234567)...2345');
    expect(colsRow1.at(1).find(PeriodLabel)).has.length(1);
    expect(colsRow1.at(3).childAt(0).childAt(0).text()).is.eql('80.00 %');

    const row2 = rows.last();
    expect(row2.prop('isSelected')).is.false;
  });

  it('skal ikke vise mottatt dato for inntektsmelding når denne ikke finnes', () => {
    const wrapper = shallow(<PersonArbeidsforholdTable
      alleArbeidsforhold={[arbeidsforhold]}
      selectedId={arbeidsforhold.id}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const cols = wrapper.find(TableColumn);
    expect(cols).has.length(6);
    expect(cols.at(4).children()).has.length(0);
  });

  it('skal vise mottatt dato for inntektsmelding når denne finnes', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      mottattDatoInntektsmelding: '2018-05-05',
    };

    const wrapper = shallow(<PersonArbeidsforholdTable
      alleArbeidsforhold={[newArbeidsforhold]}
      selectedId={newArbeidsforhold.id}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const cols = wrapper.find(TableColumn);
    expect(cols).has.length(6);
    expect(cols.at(4).find(DateLabel).prop('dateString')).to.eql('2018-05-05');
  });

  it('skal ikke vise ikon for at arbeidsforholdet er i bruk', () => {
    const wrapper = shallow(<PersonArbeidsforholdTable
      alleArbeidsforhold={[arbeidsforhold]}
      selectedId={arbeidsforhold.id}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const cols = wrapper.find(TableColumn);
    expect(cols).has.length(6);
    expect(cols.last().children()).has.length(0);
  });

  it('skal vise ikon for at arbeidsforholdet er i bruk', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukArbeidsforholdet: true,
    };

    const wrapper = shallow(<PersonArbeidsforholdTable
      alleArbeidsforhold={[newArbeidsforhold]}
      selectedId={newArbeidsforhold.id}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const cols = wrapper.find(TableColumn);
    expect(cols).has.length(6);
    expect(cols.last().find(Image)).has.length(1);
  });
});
