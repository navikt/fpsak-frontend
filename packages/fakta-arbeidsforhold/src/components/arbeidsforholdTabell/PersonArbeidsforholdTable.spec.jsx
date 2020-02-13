import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  DateLabel, Image, PeriodLabel, Table, TableColumn, TableRow,
} from '@fpsak-frontend/shared-components';
import PersonArbeidsforholdTable, { utledNøkkel } from './PersonArbeidsforholdTable';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';
import { mountWithIntl } from '../../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';


describe('<PersonArbeidsforholdTable>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsforholdId: '1231-2345',
    eksternArbeidsforholdId: '23456789',
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
    lagtTilAvSaksbehandler: false,
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
      eksternArbeidsforholdId: '565656565',
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
      lagtTilAvSaksbehandler: false,
    };

    const wrapper = mountWithIntl(<PersonArbeidsforholdTable
      alleArbeidsforhold={[arbeidsforhold, arbeidsforhold2]}
      selectedId={arbeidsforhold.id}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const table = wrapper.find(Table);
    expect(table).has.length(1);

    const rows = table.find(TableRow);

    expect(rows).has.length(3);

    const row1 = rows.at(1);
    expect(row1.prop('isSelected')).is.true;
    const colsRow1 = row1.find(TableColumn);
    expect(colsRow1).has.length(6);
    expect(colsRow1.first().childAt(0).childAt(0).text()).is.eql('Svendsen Eksos(1234567)...6789');
    expect(colsRow1.at(1).find(PeriodLabel)).has.length(1);
    expect(colsRow1.at(3).childAt(0).childAt(0).text()).is.eql('80.00 %');

    const row2 = rows.last();
    expect(row2.prop('isSelected')).is.false;
  });

  it('skal ikke vise mottatt dato for inntektsmelding når denne ikke finnes', () => {
    const wrapper = mountWithIntl(<PersonArbeidsforholdTable
      alleArbeidsforhold={[arbeidsforhold]}
      selectedId={arbeidsforhold.id}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const cols = wrapper.find(TableColumn);

    expect(cols).has.length(12);
    expect(cols.at(10).children()).has.length(1);
  });

  it('skal vise mottatt dato for inntektsmelding når denne finnes', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      mottattDatoInntektsmelding: '2018-05-05',
    };

    const wrapper = mountWithIntl(<PersonArbeidsforholdTable
      alleArbeidsforhold={[newArbeidsforhold]}
      selectedId={newArbeidsforhold.id}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const cols = wrapper.find(TableColumn);
    expect(cols).has.length(12);
    expect(wrapper.find(DateLabel).prop('dateString')).to.eql('2018-05-05');
  });

  it('skal ikke vise ikon for at arbeidsforholdet er i bruk', () => {
    const wrapper = mountWithIntl(<PersonArbeidsforholdTable
      alleArbeidsforhold={[arbeidsforhold]}
      selectedId={arbeidsforhold.id}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const cols = wrapper.find(TableColumn);
    expect(cols).has.length(12);
    expect(cols.last().children()).has.length(1);
  });

  it('skal vise ikon for at arbeidsforholdet er i bruk', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukArbeidsforholdet: true,
    };

    const wrapper = mountWithIntl(<PersonArbeidsforholdTable
      alleArbeidsforhold={[newArbeidsforhold]}
      selectedId={newArbeidsforhold.id}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const cols = wrapper.find(TableColumn);
    expect(cols).has.length(12);
    expect(cols.last().find(Image)).has.length(1);
  });

  it('skal vise IngenArbeidsforholdRegistrert komponent når ingen arbeidsforhold', () => {
    const wrapper = mountWithIntl(<PersonArbeidsforholdTable
      alleArbeidsforhold={[]}
      selectedId={undefined}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);
    const element = wrapper.find(IngenArbeidsforholdRegistrert);
    expect(element).has.length(1);
  });

  it('skal vise stillingsprosent selv når den er 0', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
      stillingsprosent: 0,
    };
    const wrapper = mountWithIntl(<PersonArbeidsforholdTable
      alleArbeidsforhold={[endretArbeidsforhold]}
      selectedId={undefined}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);
    const tableRow = wrapper.find(TableRow).at(1);
    expect(tableRow.props().model.stillingsprosent).to.eql(0);
  });

  it('skal vise riktig utledet navn når lagt til av saksbehandler', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
      lagtTilAvSaksbehandler: true,
    };
    const wrapper = mountWithIntl(<PersonArbeidsforholdTable
      alleArbeidsforhold={[endretArbeidsforhold]}
      selectedId={undefined}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);
    const tableRow = wrapper.find(TableRow).at(1);
    expect(tableRow.props().model.navn).to.eql('Svendsen Eksos');
  });
  it('skal vise overstyrt tom dato', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
      overstyrtTom: '2025-01-01',
    };
    const wrapper = mountWithIntl(<PersonArbeidsforholdTable
      alleArbeidsforhold={[endretArbeidsforhold]}
      selectedId={undefined}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);
    const periodeLabel = wrapper.find(PeriodLabel);
    expect(periodeLabel.props().dateStringTom).to.eql('2025-01-01');
  });
  it('skal vise tom dato', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
    };
    const wrapper = mountWithIntl(<PersonArbeidsforholdTable
      alleArbeidsforhold={[endretArbeidsforhold]}
      selectedId={undefined}
      selectArbeidsforholdCallback={sinon.spy()}
      fagsystemer={fagsystemer}
    />);
    const periodeLabel = wrapper.find(PeriodLabel);
    expect(periodeLabel.props().dateStringTom).to.eql('2018-10-10');
  });
  it('arbeidsforhold med samme navn og orgnr, en med arbeidsforholdId og en uten, skal få ulik nøkkel', () => {
    const arbfor1 = { ...arbeidsforhold };
    arbfor1.arbeidsforholdId = '123';
    arbfor1.eksternArbeidsforholdId = null;

    const arbfor2 = { ...arbeidsforhold };
    arbfor2.arbeidsforholdId = null;
    arbfor2.eksternArbeidsforholdId = null;

    const nøkkel1 = utledNøkkel(arbfor1);
    const nøkkel2 = utledNøkkel(arbfor2);
    expect(nøkkel1).to.not.eql(nøkkel2);
  });
});
